using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FlightManagement.Entities;

namespace FlightManagement.Repositories
{
    // Repository interface for Flight-specific database operations
    public interface IFlightRepository : IRepository<Flight>
    {
        // Gets flights by aircraft within a date range
        Task<IEnumerable<Flight>> GetFlightsByAircraftAsync(int aircraftId, DateTime? startDate = null, DateTime? endDate = null);

        // Gets flights by crew member within a date range
        Task<IEnumerable<Flight>> GetFlightsByCrewMemberAsync(int crewId, DateTime? startDate = null, DateTime? endDate = null);

        // Gets flights within a date range
        Task<IEnumerable<Flight>> GetFlightsByDateRangeAsync(DateTime startDate, DateTime endDate);

        // Gets flights by airport (departure or arrival)
        Task<IEnumerable<Flight>> GetFlightsByAirportAsync(int airportId, bool isArrival = false, DateTime? startDate = null, DateTime? endDate = null);

        // Checks if an aircraft is available for the given time period (not assigned to another flight)
        Task<bool> IsAircraftAvailableAsync(int aircraftId, DateTime departureTime, DateTime arrivalTime, int? excludeFlightId = null);

        // Checks if a crew member is available for the given time period (not assigned to another flight)
        Task<bool> IsCrewMemberAvailableAsync(int crewId, DateTime departureTime, DateTime arrivalTime, int? excludeFlightId = null);

        // Gets crew members assigned to a flight
        Task<IEnumerable<Crew>> GetFlightCrewMembersAsync(int flightId);

        // Gets a flight with all navigation properties (Aircraft, Airports, Crew)
        Task<Flight?> GetFlightWithDetailsAsync(int flightId);

        // Gets all flights with navigation properties (Aircraft, Airports, Crew)
        Task<IEnumerable<Flight>> GetAllFlightsWithDetailsAsync();
    }
}
