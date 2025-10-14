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
    /// Repository implementation for Aircraft-specific database operations
    /// </summary>
    public class AircraftRepository : Repository<Aircraft>, IAircraftRepository
    {
        private readonly ILogger<AircraftRepository> _logger;

        public AircraftRepository(FlightManagementContext context, ILogger<AircraftRepository> logger)
            : base(context)
        {
            _logger = logger;
        }

        /// <summary>
        /// Gets all active aircraft (non-deleted)
        /// </summary>
        public async Task<IEnumerable<Aircraft>> GetActiveAircraftAsync()
        {
            _logger.LogDebug("Fetching all active aircraft");
            return await _dbSet
                .Where(a => a.IsActive)
                .ToListAsync();
        }

        /// <summary>
        /// Gets an aircraft by its tail number
        /// </summary>
        public async Task<Aircraft?> GetByTailNumberAsync(string tailNumber)
        {
            _logger.LogDebug("Fetching aircraft by tail number: {TailNumber}", tailNumber);
            return await _dbSet
                .FirstOrDefaultAsync(a => a.TailNumber == tailNumber);
        }

        /// <summary>
        /// Checks if a tail number is unique (optionally excluding a specific aircraft)
        /// </summary>
        public async Task<bool> IsTailNumberUniqueAsync(string tailNumber, int? excludeAircraftId = null)
        {
            _logger.LogDebug("Checking tail number uniqueness: {TailNumber} (excluding ID: {ExcludeId})",
                tailNumber, excludeAircraftId);

            var query = _dbSet.Where(a => a.TailNumber == tailNumber);

            if (excludeAircraftId.HasValue)
            {
                query = query.Where(a => a.Id != excludeAircraftId.Value);
            }

            return !await query.AnyAsync();
        }

        /// <summary>
        /// Gets all flights for a specific aircraft within a date range
        /// </summary>
        public async Task<IEnumerable<Flight>> GetAircraftFlightsAsync(int aircraftId, DateTime? startDate = null, DateTime? endDate = null)
        {
            _logger.LogDebug("Fetching flights for aircraft {AircraftId} (start: {StartDate}, end: {EndDate})",
                aircraftId, startDate, endDate);

            var query = _context.Set<Flight>()
                .Where(f => f.AircraftId == aircraftId);

            if (startDate.HasValue)
            {
                query = query.Where(f => f.DepartureTime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(f => f.ArrivalTime <= endDate.Value);
            }

            return await query.ToListAsync();
        }

        /// <summary>
        /// Checks if an aircraft has any assigned flights
        /// </summary>
        public async Task<bool> HasFlightsAsync(int aircraftId)
        {
            _logger.LogDebug("Checking if aircraft {AircraftId} has flights", aircraftId);
            return await _context.Set<Flight>()
                .AnyAsync(f => f.AircraftId == aircraftId);
        }
    }
}
