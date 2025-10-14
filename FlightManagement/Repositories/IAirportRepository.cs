using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FlightManagement.Entities;

namespace FlightManagement.Repositories
{
    /// <summary>
    /// Repository interface for Airport-specific database operations
    /// </summary>
    public interface IAirportRepository : IRepository<Airport>
    {
        /// <summary>
        /// Gets an airport by its IATA code
        /// </summary>
        Task<Airport?> GetByIataCodeAsync(string iataCode);

        /// <summary>
        /// Checks if an IATA code is unique (optionally excluding a specific airport)
        /// </summary>
        Task<bool> IsIataCodeUniqueAsync(string iataCode, int? excludeAirportId = null);

        /// <summary>
        /// Gets airports by city
        /// </summary>
        Task<IEnumerable<Airport>> GetAirportsByCityAsync(string city);

        /// <summary>
        /// Gets airports by country
        /// </summary>
        Task<IEnumerable<Airport>> GetAirportsByCountryAsync(string country);

        /// <summary>
        /// Gets all departure flights from an airport
        /// </summary>
        Task<IEnumerable<Flight>> GetDepartureFlightsAsync(int airportId, DateTime? startDate = null, DateTime? endDate = null);

        /// <summary>
        /// Gets all arrival flights to an airport
        /// </summary>
        Task<IEnumerable<Flight>> GetArrivalFlightsAsync(int airportId, DateTime? startDate = null, DateTime? endDate = null);

        /// <summary>
        /// Checks if an airport has any assigned flights (departures or arrivals)
        /// </summary>
        Task<bool> HasFlightsAsync(int airportId);
    }
}
