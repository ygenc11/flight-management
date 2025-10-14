using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FlightManagement.Entities;

namespace FlightManagement.Repositories
{
    /// <summary>
    /// Repository interface for Aircraft-specific database operations
    /// </summary>
    public interface IAircraftRepository : IRepository<Aircraft>
    {
        /// <summary>
        /// Gets all active aircraft (non-deleted)
        /// </summary>
        Task<IEnumerable<Aircraft>> GetActiveAircraftAsync();

        /// <summary>
        /// Gets an aircraft by its tail number
        /// </summary>
        Task<Aircraft?> GetByTailNumberAsync(string tailNumber);

        /// <summary>
        /// Checks if a tail number is unique (optionally excluding a specific aircraft)
        /// </summary>
        Task<bool> IsTailNumberUniqueAsync(string tailNumber, int? excludeAircraftId = null);

        /// <summary>
        /// Gets all flights for a specific aircraft within a date range
        /// </summary>
        Task<IEnumerable<Flight>> GetAircraftFlightsAsync(int aircraftId, DateTime? startDate = null, DateTime? endDate = null);

        /// <summary>
        /// Checks if an aircraft has any assigned flights
        /// </summary>
        Task<bool> HasFlightsAsync(int aircraftId);
    }
}
