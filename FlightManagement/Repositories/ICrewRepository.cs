using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FlightManagement.Entities;

namespace FlightManagement.Repositories
{
    /// <summary>
    /// Repository interface for Crew entity with specific operations
    /// </summary>
    public interface ICrewRepository : IRepository<Crew>
    {
        /// <summary>
        /// Gets all crew members by role
        /// </summary>
        /// <param name="role">Crew role (pilot, copilot, flightattendant)</param>
        Task<IEnumerable<Crew>> GetCrewByRoleAsync(string role);

        /// <summary>
        /// Gets crew member by license number
        /// </summary>
        Task<Crew?> GetCrewByLicenseNumberAsync(string licenseNumber);

        /// <summary>
        /// Checks if license number is unique
        /// </summary>
        /// <param name="licenseNumber">License number to check</param>
        /// <param name="excludeCrewId">Optional: Crew ID to exclude from check (for updates)</param>
        Task<bool> IsLicenseNumberUniqueAsync(string licenseNumber, int? excludeCrewId = null);

        /// <summary>
        /// Gets all flights assigned to a crew member
        /// </summary>
        /// <param name="crewId">Crew member ID</param>
        /// <param name="startDate">Optional: Start date filter</param>
        /// <param name="endDate">Optional: End date filter</param>
        Task<IEnumerable<Flight>> GetCrewFlightsAsync(int crewId, DateTime? startDate = null, DateTime? endDate = null);

        /// <summary>
        /// Gets available crew members for a specific time period
        /// </summary>
        /// <param name="departureTime">Flight departure time</param>
        /// <param name="arrivalTime">Flight arrival time</param>
        Task<IEnumerable<Crew>> GetAvailableCrewForFlightAsync(DateTime departureTime, DateTime arrivalTime);
    }
}
