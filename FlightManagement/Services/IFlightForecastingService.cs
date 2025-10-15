namespace FlightManagement.Services
{
    public interface IFlightForecastingService
    {
        DateTime? CalculateArrivalTime(
            string departureIATA,
            string arrivalIATA,
            string aircraftModel,
            DateTime departureTime);
    }
}
