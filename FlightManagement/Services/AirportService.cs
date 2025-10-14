using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FlightManagement.Entities;
using FlightManagement.Repositories;
using Microsoft.Extensions.Logging;

namespace FlightManagement.Services
{
    /// <summary>
    /// Service implementation for Airport business logic
    /// </summary>
    public class AirportService : IAirportService
    {
        private readonly IAirportRepository _airportRepository;
        private readonly ILogger<AirportService> _logger;

        public AirportService(IAirportRepository airportRepository, ILogger<AirportService> logger)
        {
            _airportRepository = airportRepository;
            _logger = logger;
        }

        // ============= CRUD Operations =============

        /// <summary>
        /// Gets all airports
        /// </summary>
        public async Task<IEnumerable<Airport>> GetAllAirportsAsync()
        {
            _logger.LogDebug("Fetching all airports");
            return await _airportRepository.GetAllAsync();
        }

        /// <summary>
        /// Gets an airport by ID
        /// </summary>
        public async Task<Airport?> GetAirportByIdAsync(int id)
        {
            _logger.LogDebug("Fetching airport by ID: {AirportId}", id);
            return await _airportRepository.GetByIdAsync(id);
        }

        /// <summary>
        /// Gets an airport by IATA code
        /// </summary>
        public async Task<Airport?> GetAirportByIataCodeAsync(string iataCode)
        {
            _logger.LogDebug("Fetching airport by IATA code: {IataCode}", iataCode);
            return await _airportRepository.GetByIataCodeAsync(iataCode);
        }

        /// <summary>
        /// Creates a new airport
        /// </summary>
        public async Task<Airport> CreateAirportAsync(string name, string city, string country, string iataCode)
        {
            var airport = new Airport
            {
                Name = name,
                City = city,
                Country = country,
                IataCode = iataCode.ToUpperInvariant() // Normalize to uppercase
            };

            await _airportRepository.AddAsync(airport);

            _logger.LogInformation("Airport created: {Id} {Name} ({IataCode})",
                airport.Id, airport.Name, airport.IataCode);

            return airport;
        }

        /// <summary>
        /// Updates an existing airport
        /// </summary>
        public async Task<bool> UpdateAirportAsync(int id, string name, string city, string country, string iataCode)
        {
            var airport = await _airportRepository.GetByIdAsync(id);
            if (airport == null)
            {
                _logger.LogWarning("Airport not found for update: {AirportId}", id);
                return false;
            }

            airport.Name = name;
            airport.City = city;
            airport.Country = country;
            airport.IataCode = iataCode.ToUpperInvariant();

            await _airportRepository.UpdateAsync(airport);

            _logger.LogInformation("Airport updated: {Id} {Name} ({IataCode})",
                airport.Id, airport.Name, airport.IataCode);

            return true;
        }

        /// <summary>
        /// Deletes an airport
        /// </summary>
        public async Task<bool> DeleteAirportAsync(int id)
        {
            var airport = await _airportRepository.GetByIdAsync(id);
            if (airport == null)
            {
                _logger.LogWarning("Airport not found for delete: {AirportId}", id);
                return false;
            }

            await _airportRepository.DeleteAsync(airport);

            _logger.LogInformation("Airport deleted: {Id} {Name} ({IataCode})",
                airport.Id, airport.Name, airport.IataCode);

            return true;
        }

        // ============= Validation Methods =============

        /// <summary>
        /// Validates IATA code format (3 uppercase letters)
        /// </summary>
        public bool IsValidIataCode(string iataCode)
        {
            if (string.IsNullOrWhiteSpace(iataCode))
                return false;

            // IATA codes must be exactly 3 letters
            var regex = new Regex(@"^[A-Z]{3}$", RegexOptions.IgnoreCase);
            return regex.IsMatch(iataCode);
        }

        /// <summary>
        /// Validates airport data for creation
        /// </summary>
        public async Task<(bool isValid, string errorMessage)> ValidateAirportCreationAsync(string iataCode)
        {
            // 1. IATA code must be valid format
            if (!IsValidIataCode(iataCode))
            {
                _logger.LogWarning("Airport creation validation failed: Invalid IATA code format {IataCode}", iataCode);
                return (false, "IATA code must be exactly 3 letters.");
            }

            // 2. IATA code must be unique
            var isIataCodeUnique = await _airportRepository.IsIataCodeUniqueAsync(iataCode);
            if (!isIataCodeUnique)
            {
                _logger.LogWarning("Airport creation validation failed: IATA code {IataCode} already exists", iataCode);
                return (false, $"An airport with IATA code '{iataCode.ToUpperInvariant()}' already exists.");
            }

            _logger.LogInformation("Airport creation validation passed for IATA code {IataCode}", iataCode);
            return (true, string.Empty);
        }

        /// <summary>
        /// Validates airport data for update
        /// </summary>
        public async Task<(bool isValid, string errorMessage)> ValidateAirportUpdateAsync(int airportId, string iataCode)
        {
            // 1. IATA code must be valid format
            if (!IsValidIataCode(iataCode))
            {
                _logger.LogWarning("Airport update validation failed: Invalid IATA code format {IataCode} for airport {AirportId}",
                    iataCode, airportId);
                return (false, "IATA code must be exactly 3 letters.");
            }

            // 2. IATA code must be unique (excluding current airport)
            var isIataCodeUnique = await _airportRepository.IsIataCodeUniqueAsync(iataCode, airportId);
            if (!isIataCodeUnique)
            {
                _logger.LogWarning("Airport update validation failed: IATA code {IataCode} already exists for airport {AirportId}",
                    iataCode, airportId);
                return (false, $"An airport with IATA code '{iataCode.ToUpperInvariant()}' already exists.");
            }

            _logger.LogInformation("Airport update validation passed for airport {AirportId}", airportId);
            return (true, string.Empty);
        }

        /// <summary>
        /// Checks if an airport can be deleted (not assigned to any flights)
        /// </summary>
        public async Task<(bool canDelete, string errorMessage)> CanDeleteAirportAsync(int id)
        {
            // Check if airport is used in any flights (departures or arrivals)
            var hasFlights = await _airportRepository.HasFlightsAsync(id);

            if (hasFlights)
            {
                _logger.LogWarning("Cannot delete airport {AirportId}: Assigned to flights", id);
                return (false, "Cannot delete airport that is assigned to flights as departure or arrival location.");
            }

            return (true, string.Empty);
        }
    }
}
