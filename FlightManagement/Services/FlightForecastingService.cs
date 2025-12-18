using System.Text.Json;
using FlightManagement.Repositories;

namespace FlightManagement.Services
{
    public class FlightForecastingService : IFlightForecastingService
    {
        private readonly Dictionary<string, int> _aircraftSpeeds;
        private readonly Dictionary<string, (int TaxiOut, int TaxiIn)> _taxiTimes;
        private readonly ILogger<FlightForecastingService> _logger;
        private readonly IAirportRepository _airportRepository;

        public FlightForecastingService(
            ILogger<FlightForecastingService> logger,
            IAirportRepository airportRepository)
        {
            _logger = logger;
            _airportRepository = airportRepository;
            _aircraftSpeeds = LoadAircraftSpeeds();
            _taxiTimes = LoadTaxiTimes();
        }

        public DateTime? CalculateArrivalTime(
            string departureIATA,
            string arrivalIATA,
            string aircraftModel,
            DateTime departureTime)
        {
            try
            {
                // 1. Havalimanı koordinatlarını veritabanından al
                var depAirport = _airportRepository.GetByIataCodeAsync(departureIATA).Result;
                if (depAirport == null)
                {
                    _logger.LogWarning($"Airport {departureIATA} not found in database");
                    return null;
                }

                var arrAirport = _airportRepository.GetByIataCodeAsync(arrivalIATA).Result;
                if (arrAirport == null)
                {
                    _logger.LogWarning($"Airport {arrivalIATA} not found in database");
                    return null;
                }

                // 2. Mesafeyi hesapla (Haversine formülü)
                double distanceKm = CalculateDistance(
                    depAirport.Latitude, depAirport.Longitude,
                    arrAirport.Latitude, arrAirport.Longitude);

                // 3. Uçak hızını al
                if (!_aircraftSpeeds.TryGetValue(aircraftModel, out int speedKmh))
                {
                    _logger.LogWarning($"Aircraft model '{aircraftModel}' not found, using default speed 840 km/h");
                    speedKmh = 840; // Default narrowbody speed
                }

                // 4. Hava süresi hesapla (saat cinsinden)
                double flightHours = distanceKm / speedKmh;
                int flightMinutes = (int)Math.Round(flightHours * 60);

                // 5. Taxi sürelerini al
                var taxiOut = GetTaxiOutTime(departureIATA);
                var taxiIn = GetTaxiInTime(arrivalIATA);

                // 6. Toplam süre = taxi-out + flight time + taxi-in
                int totalMinutes = taxiOut + flightMinutes + taxiIn;

                // 7. Varış saatini hesapla
                var arrivalTime = departureTime.AddMinutes(totalMinutes);

                _logger.LogInformation(
                    $"Flight forecast: {departureIATA}->{arrivalIATA}, " +
                    $"Distance: {distanceKm:F0}km, Speed: {speedKmh}km/h, " +
                    $"Flight: {flightMinutes}min, Taxi: {taxiOut}+{taxiIn}min, " +
                    $"Total: {totalMinutes}min");

                return arrivalTime;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error calculating arrival time for {departureIATA}->{arrivalIATA}");
                return null;
            }
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            // Haversine formülü - İki nokta arası mesafe hesaplama
            const double R = 6371; // Dünya yarıçapı (km)

            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var distance = R * c;

            return distance;
        }

        private double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180.0;
        }

        private int GetTaxiOutTime(string iataCode)
        {
            if (_taxiTimes.TryGetValue(iataCode, out var times))
                return times.TaxiOut;

            // Default taxi out time
            return _taxiTimes.TryGetValue("default", out var defaultTimes)
                ? defaultTimes.TaxiOut
                : 15;
        }

        private int GetTaxiInTime(string iataCode)
        {
            if (_taxiTimes.TryGetValue(iataCode, out var times))
                return times.TaxiIn;

            // Default taxi in time
            return _taxiTimes.TryGetValue("default", out var defaultTimes)
                ? defaultTimes.TaxiIn
                : 7;
        }

        private Dictionary<string, int> LoadAircraftSpeeds()
        {
            try
            {
                var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "AircraftSpeeds.json");
                var jsonString = File.ReadAllText(jsonPath);
                var speeds = JsonSerializer.Deserialize<Dictionary<string, int>>(jsonString);

                return speeds ?? new Dictionary<string, int>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading aircraft speeds data");
                return new Dictionary<string, int>();
            }
        }

        private Dictionary<string, (int TaxiOut, int TaxiIn)> LoadTaxiTimes()
        {
            try
            {
                var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "AirportTaxiTimes.json");
                var jsonString = File.ReadAllText(jsonPath);
                var taxiData = JsonSerializer.Deserialize<Dictionary<string, TaxiTimeData>>(jsonString);

                return taxiData?.ToDictionary(
                    kvp => kvp.Key,
                    kvp => (kvp.Value.taxiOut, kvp.Value.taxiIn)
                ) ?? new Dictionary<string, (int, int)>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading taxi times data");
                return new Dictionary<string, (int, int)>
                {
                    { "default", (15, 7) }
                };
            }
        }

        // JSON deserialization models
        private class TaxiTimeData
        {
            public int taxiOut { get; set; }
            public int taxiIn { get; set; }
        }
    }
}
