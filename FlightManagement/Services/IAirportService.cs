using System.Collections.Generic;
using System.Threading.Tasks;
using FlightManagement.Entities;

namespace FlightManagement.Services
{
    /// <summary>
    /// Service interface for Airport business logic
    /// </summary>
    public interface IAirportService
    {
        // ============= CRUD Operations =============

        /// <summary>
        /// Gets all airports
        /// </summary>
        Task<IEnumerable<Airport>> GetAllAirportsAsync();

        /// <summary>
        /// Gets an airport by ID
        /// </summary>
        Task<Airport?> GetAirportByIdAsync(int id);

        /// <summary>
        /// Gets an airport by IATA code
        /// </summary>
        Task<Airport?> GetAirportByIataCodeAsync(string iataCode);

        /// <summary>
        /// Creates a new airport
        /// </summary>
        Task<Airport> CreateAirportAsync(string name, string city, string country, string iataCode);

        /// <summary>
        /// Updates an existing airport
        /// </summary>
        Task<bool> UpdateAirportAsync(int id, string name, string city, string country, string iataCode);

        /// <summary>
        /// Deletes an airport
        /// </summary>
        Task<bool> DeleteAirportAsync(int id);

        // ============= Validation Methods =============

        /// <summary>
        /// Validates IATA code format (3 uppercase letters)
        /// </summary>
        bool IsValidIataCode(string iataCode);

        /// <summary>
        /// Validates airport data for creation
        /// </summary>
        Task<(bool isValid, string errorMessage)> ValidateAirportCreationAsync(string iataCode);

        /// <summary>
        /// Validates airport data for update
        /// </summary>
        Task<(bool isValid, string errorMessage)> ValidateAirportUpdateAsync(int airportId, string iataCode);

        /// <summary>
        /// Checks if an airport can be deleted (not assigned to any flights)
        /// </summary>
        Task<(bool canDelete, string errorMessage)> CanDeleteAirportAsync(int id);
    }
}
