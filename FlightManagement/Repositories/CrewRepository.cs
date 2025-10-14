using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.Data;
using FlightManagement.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FlightManagement.Repositories
{
    /// <summary>
    /// Repository implementation for Crew entity
    /// </summary>
    public class CrewRepository : Repository<Crew>, ICrewRepository
    {
        private readonly ILogger<CrewRepository> _logger;

        public CrewRepository(FlightManagementContext context, ILogger<CrewRepository> logger)
            : base(context)
        {
            _logger = logger;
        }

        /// <summary>
        /// Gets all crew members by role
        /// </summary>
        public async Task<IEnumerable<Crew>> GetCrewByRoleAsync(string role)
        {
            _logger.LogDebug("Getting crew members by role: {Role}", role);
            return await _dbSet
                .Where(c => c.Role.ToLower() == role.ToLower())
                .ToListAsync();
        }

        /// <summary>
        /// Gets crew member by license number
        /// </summary>
        public async Task<Crew?> GetCrewByLicenseNumberAsync(string licenseNumber)
        {
            _logger.LogDebug("Getting crew member by license number: {LicenseNumber}", licenseNumber);
            return await _dbSet
                .FirstOrDefaultAsync(c => c.LicenseNumber == licenseNumber);
        }

        /// <summary>
        /// Checks if license number is unique
        /// </summary>
        public async Task<bool> IsLicenseNumberUniqueAsync(string licenseNumber, int? excludeCrewId = null)
        {
            var query = _dbSet.Where(c => c.LicenseNumber == licenseNumber);

            if (excludeCrewId.HasValue)
            {
                query = query.Where(c => c.Id != excludeCrewId.Value);
            }

            var exists = await query.AnyAsync();
            return !exists; // Return true if it doesn't exist (is unique)
        }

        /// <summary>
        /// Gets all flights assigned to a crew member
        /// </summary>
        public async Task<IEnumerable<Flight>> GetCrewFlightsAsync(int crewId, DateTime? startDate = null, DateTime? endDate = null)
        {
            _logger.LogDebug("Getting flights for crew member: {CrewId}", crewId);

            var query = _context.Flights
                .Include(f => f.CrewMembers)
                .Where(f => f.CrewMembers.Any(c => c.Id == crewId));

            if (startDate.HasValue)
            {
                query = query.Where(f => f.DepartureTime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(f => f.ArrivalTime <= endDate.Value);
            }

            return await query.OrderBy(f => f.DepartureTime).ToListAsync();
        }

        /// <summary>
        /// Gets available crew members for a specific time period
        /// </summary>
        public async Task<IEnumerable<Crew>> GetAvailableCrewForFlightAsync(DateTime departureTime, DateTime arrivalTime)
        {
            _logger.LogDebug("Getting available crew for flight from {DepartureTime} to {ArrivalTime}",
                departureTime, arrivalTime);

            // Get crew members who are NOT assigned to any conflicting flights
            var busyCrewIds = await _context.Flights
                .Include(f => f.CrewMembers)
                .Where(f =>
                    (departureTime >= f.DepartureTime && departureTime < f.ArrivalTime) ||
                    (arrivalTime > f.DepartureTime && arrivalTime <= f.ArrivalTime) ||
                    (departureTime <= f.DepartureTime && arrivalTime >= f.ArrivalTime))
                .SelectMany(f => f.CrewMembers.Select(c => c.Id))
                .Distinct()
                .ToListAsync();

            return await _dbSet
                .Where(c => !busyCrewIds.Contains(c.Id))
                .ToListAsync();
        }
    }
}
