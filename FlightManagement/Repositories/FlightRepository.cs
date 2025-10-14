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
    // Repository implementation for Flight-specific database operations
    public class FlightRepository : Repository<Flight>, IFlightRepository
    {
        private readonly ILogger<FlightRepository> _logger;

        public FlightRepository(FlightManagementContext context, ILogger<FlightRepository> logger)
            : base(context)
        {
            _logger = logger;
        }


        // Gets flights by aircraft within a date range

        public async Task<IEnumerable<Flight>> GetFlightsByAircraftAsync(int aircraftId, DateTime? startDate = null, DateTime? endDate = null)
        {
            _logger.LogDebug("Fetching flights for aircraft {AircraftId} (start: {StartDate}, end: {EndDate})",
                aircraftId, startDate, endDate);

            var query = _dbSet.Where(f => f.AircraftId == aircraftId);

            if (startDate.HasValue)
            {
                query = query.Where(f => f.DepartureTime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(f => f.ArrivalTime <= endDate.Value);
            }

            return await query
                .Include(f => f.Aircraft)
                .Include(f => f.DepartureAirport)
                .Include(f => f.ArrivalAirport)
                .Include(f => f.CrewMembers)
                .ToListAsync();
        }


        // Gets flights by crew member within a date range

        public async Task<IEnumerable<Flight>> GetFlightsByCrewMemberAsync(int crewId, DateTime? startDate = null, DateTime? endDate = null)
        {
            _logger.LogDebug("Fetching flights for crew member {CrewId} (start: {StartDate}, end: {EndDate})",
                crewId, startDate, endDate);

            var query = _dbSet.Where(f => f.CrewMembers.Any(c => c.Id == crewId));

            if (startDate.HasValue)
            {
                query = query.Where(f => f.DepartureTime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(f => f.ArrivalTime <= endDate.Value);
            }

            return await query
                .Include(f => f.Aircraft)
                .Include(f => f.DepartureAirport)
                .Include(f => f.ArrivalAirport)
                .Include(f => f.CrewMembers)
                .ToListAsync();
        }

        // Gets flights within a date range
        public async Task<IEnumerable<Flight>> GetFlightsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            _logger.LogDebug("Fetching flights between {StartDate} and {EndDate}", startDate, endDate);

            return await _dbSet
                .Where(f => f.DepartureTime >= startDate && f.ArrivalTime <= endDate)
                .Include(f => f.Aircraft)
                .Include(f => f.DepartureAirport)
                .Include(f => f.ArrivalAirport)
                .Include(f => f.CrewMembers)
                .ToListAsync();
        }


        // Gets flights by airport (departure or arrival)

        public async Task<IEnumerable<Flight>> GetFlightsByAirportAsync(int airportId, bool isArrival = false, DateTime? startDate = null, DateTime? endDate = null)
        {
            _logger.LogDebug("Fetching {Type} flights for airport {AirportId} (start: {StartDate}, end: {EndDate})",
                isArrival ? "arrival" : "departure", airportId, startDate, endDate);

            var query = isArrival
                ? _dbSet.Where(f => f.ArrivalAirportId == airportId)
                : _dbSet.Where(f => f.DepartureAirportId == airportId);

            if (startDate.HasValue)
            {
                query = query.Where(f => f.DepartureTime >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(f => f.ArrivalTime <= endDate.Value);
            }

            return await query
                .Include(f => f.Aircraft)
                .Include(f => f.DepartureAirport)
                .Include(f => f.ArrivalAirport)
                .Include(f => f.CrewMembers)
                .ToListAsync();
        }

        // Checks if an aircraft is available for the given time period
        // Time overlap detection: newDeparture < existingArrival && newArrival > existingDeparture

        public async Task<bool> IsAircraftAvailableAsync(int aircraftId, DateTime departureTime, DateTime arrivalTime, int? excludeFlightId = null)
        {
            _logger.LogDebug("Checking aircraft {AircraftId} availability from {Departure} to {Arrival} (excluding flight: {ExcludeId})",
                aircraftId, departureTime, arrivalTime, excludeFlightId);

            var query = _dbSet.Where(f =>
                f.AircraftId == aircraftId &&
                f.DepartureTime < arrivalTime &&
                f.ArrivalTime > departureTime
            );

            if (excludeFlightId.HasValue)
            {
                query = query.Where(f => f.Id != excludeFlightId.Value);
            }

            var conflictingFlights = await query.CountAsync();
            var isAvailable = conflictingFlights == 0;

            _logger.LogDebug("Aircraft {AircraftId} availability: {IsAvailable} (conflicts: {Conflicts})",
                aircraftId, isAvailable, conflictingFlights);

            return isAvailable;
        }


        // Checks if a crew member is available for the given time period
        // Time overlap detection: newDeparture < existingArrival && newArrival > existingDeparture
        public async Task<bool> IsCrewMemberAvailableAsync(int crewId, DateTime departureTime, DateTime arrivalTime, int? excludeFlightId = null)
        {
            _logger.LogDebug("Checking crew member {CrewId} availability from {Departure} to {Arrival} (excluding flight: {ExcludeId})",
                crewId, departureTime, arrivalTime, excludeFlightId);

            var query = _dbSet.Where(f =>
                f.CrewMembers.Any(c => c.Id == crewId) &&
                f.DepartureTime < arrivalTime &&
                f.ArrivalTime > departureTime
            );

            if (excludeFlightId.HasValue)
            {
                query = query.Where(f => f.Id != excludeFlightId.Value);
            }

            var conflictingFlights = await query.CountAsync();
            var isAvailable = conflictingFlights == 0;

            _logger.LogDebug("Crew member {CrewId} availability: {IsAvailable} (conflicts: {Conflicts})",
                crewId, isAvailable, conflictingFlights);

            return isAvailable;
        }


        // Gets crew members assigned to a flight
        public async Task<IEnumerable<Crew>> GetFlightCrewMembersAsync(int flightId)
        {
            _logger.LogDebug("Fetching crew members for flight {FlightId}", flightId);

            var flight = await _dbSet
                .Include(f => f.CrewMembers)
                .FirstOrDefaultAsync(f => f.Id == flightId);

            return flight?.CrewMembers ?? new List<Crew>();
        }

        // Gets a flight with all navigation properties (Aircraft, Airports, Crew)
        public async Task<Flight?> GetFlightWithDetailsAsync(int flightId)
        {
            _logger.LogDebug("Fetching flight {FlightId} with all details", flightId);

            return await _dbSet
                .Include(f => f.Aircraft)
                .Include(f => f.DepartureAirport)
                .Include(f => f.ArrivalAirport)
                .Include(f => f.CrewMembers)
                .FirstOrDefaultAsync(f => f.Id == flightId);
        }

        // Gets all flights with navigation properties (Aircraft, Airports, Crew)
        public async Task<IEnumerable<Flight>> GetAllFlightsWithDetailsAsync()
        {
            _logger.LogDebug("Fetching all flights with all details");

            return await _dbSet
                .Include(f => f.Aircraft)
                .Include(f => f.DepartureAirport)
                .Include(f => f.ArrivalAirport)
                .Include(f => f.CrewMembers)
                .ToListAsync();
        }
    }
}
