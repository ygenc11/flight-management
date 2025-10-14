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
    /// Repository implementation for Airport-specific database operations
    /// </summary>
    public class AirportRepository : Repository<Airport>, IAirportRepository
    {
        private readonly ILogger<AirportRepository> _logger;

        public AirportRepository(FlightManagementContext context, ILogger<AirportRepository> logger)
            : base(context)
        {
            _logger = logger;
        }

        /// <summary>
        /// Gets an airport by its IATA code
        /// </summary>
        public async Task<Airport?> GetByIataCodeAsync(string iataCode)
        {
            _logger.LogDebug("Fetching airport by IATA code: {IataCode}", iataCode);
            return await _dbSet
                .FirstOrDefaultAsync(a => a.IataCode == iataCode);
        }

        /// <summary>
        /// Checks if an IATA code is unique (optionally excluding a specific airport)
        /// </summary>
        public async Task<bool> IsIataCodeUniqueAsync(string iataCode, int? excludeAirportId = null)
        {
            _logger.LogDebug("Checking IATA code uniqueness: {IataCode} (excluding ID: {ExcludeId})",
                iataCode, excludeAirportId);

            var query = _dbSet.Where(a => a.IataCode == iataCode);

            if (excludeAirportId.HasValue)
            {
                query = query.Where(a => a.Id != excludeAirportId.Value);
            }

            return !await query.AnyAsync();
        }

        /// <summary>
        /// Gets airports by city
        /// </summary>
        public async Task<IEnumerable<Airport>> GetAirportsByCityAsync(string city)
        {
            _logger.LogDebug("Fetching airports by city: {City}", city);
            return await _dbSet
                .Where(a => a.City == city)
                .ToListAsync();
        }

        /// <summary>
        /// Gets airports by country
        /// </summary>
        public async Task<IEnumerable<Airport>> GetAirportsByCountryAsync(string country)
        {
            _logger.LogDebug("Fetching airports by country: {Country}", country);
            return await _dbSet
                .Where(a => a.Country == country)
                .ToListAsync();
        }

        /// <summary>
        /// Gets all departure flights from an airport
        /// </summary>
        public async Task<IEnumerable<Flight>> GetDepartureFlightsAsync(int airportId, DateTime? startDate = null, DateTime? endDate = null)
        {
            _logger.LogDebug("Fetching departure flights for airport {AirportId} (start: {StartDate}, end: {EndDate})",
                airportId, startDate, endDate);

            var query = _context.Set<Flight>()
                .Where(f => f.DepartureAirportId == airportId);

            if (startDate.HasValue)
            {
                query = query.Where(f => f.DepartureTime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(f => f.DepartureTime <= endDate.Value);
            }

            return await query.ToListAsync();
        }

        /// <summary>
        /// Gets all arrival flights to an airport
        /// </summary>
        public async Task<IEnumerable<Flight>> GetArrivalFlightsAsync(int airportId, DateTime? startDate = null, DateTime? endDate = null)
        {
            _logger.LogDebug("Fetching arrival flights for airport {AirportId} (start: {StartDate}, end: {EndDate})",
                airportId, startDate, endDate);

            var query = _context.Set<Flight>()
                .Where(f => f.ArrivalAirportId == airportId);

            if (startDate.HasValue)
            {
                query = query.Where(f => f.ArrivalTime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(f => f.ArrivalTime <= endDate.Value);
            }

            return await query.ToListAsync();
        }

        /// <summary>
        /// Checks if an airport has any assigned flights (departures or arrivals)
        /// </summary>
        public async Task<bool> HasFlightsAsync(int airportId)
        {
            _logger.LogDebug("Checking if airport {AirportId} has flights", airportId);

            var hasDepartures = await _context.Set<Flight>()
                .AnyAsync(f => f.DepartureAirportId == airportId);

            if (hasDepartures)
                return true;

            var hasArrivals = await _context.Set<Flight>()
                .AnyAsync(f => f.ArrivalAirportId == airportId);

            return hasArrivals;
        }
    }
}
