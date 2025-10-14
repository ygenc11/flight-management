using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FlightManagement.Entities;

namespace FlightManagement.Services
{

    // Service interface for Flight business logic
    public interface IFlightService
    {
        // ============= CRUD Operations =============

        // Gets all flights
        Task<IEnumerable<Flight>> GetAllFlightsAsync();

        // Gets a flight by ID
        Task<Flight?> GetFlightByIdAsync(int id);

        // Gets a flight with all details (Aircraft, Airports, Crew)
        Task<Flight?> GetFlightWithDetailsAsync(int id);

        // Creates a new flight with crew members
        Task<Flight> CreateFlightAsync(
            string flightNumber,
            DateTime departureTime,
            DateTime arrivalTime,
            int aircraftId,
            int departureAirportId,
            int arrivalAirportId,
            List<int> crewMemberIds);

        // Updates an existing flight with crew members
        Task<bool> UpdateFlightAsync(
            int id,
            string flightNumber,
            DateTime departureTime,
            DateTime arrivalTime,
            int aircraftId,
            int departureAirportId,
            int arrivalAirportId,
            List<int> crewMemberIds,
            string status);

        // Updates only the flight status
        Task<bool> UpdateFlightStatusAsync(int id, string status, string statusDescription);

        // Deletes a flight
        Task<bool> DeleteFlightAsync(int id);

        // ============= Validation Methods =============


        // Validates flight times (Arrival > Departure, Departure in future)

        (bool isValid, string errorMessage) ValidateFlightTimes(DateTime departureTime, DateTime arrivalTime);


        // Validates airports (Departure != Arrival)

        (bool isValid, string errorMessage) ValidateAirports(int departureAirportId, int arrivalAirportId);

        // Validates crew composition (at least 1 Pilot and 1 CoPilot)
        Task<(bool isValid, string errorMessage)> ValidateCrewCompositionAsync(List<int> crewMemberIds);

        // Validates aircraft availability (not assigned to another flight at the same time)

        Task<(bool isValid, string errorMessage)> ValidateAircraftAvailabilityAsync(
            int aircraftId,
            DateTime departureTime,
            DateTime arrivalTime,
            int? excludeFlightId = null);


        // Validates crew member availability (not assigned to another flight at the same time)

        Task<(bool isValid, string errorMessage)> ValidateCrewMemberAvailabilityAsync(
            int crewId,
            DateTime departureTime,
            DateTime arrivalTime,
            int? excludeFlightId = null);


        // Validates all crew members' availability for a flight

        Task<(bool isValid, string errorMessage)> ValidateAllCrewAvailabilityAsync(
            List<int> crewMemberIds,
            DateTime departureTime,
            DateTime arrivalTime,
            int? excludeFlightId = null);


        // Validates all flight data for creation

        Task<(bool isValid, string errorMessage)> ValidateFlightCreationAsync(
            DateTime departureTime,
            DateTime arrivalTime,
            int aircraftId,
            int departureAirportId,
            int arrivalAirportId,
            List<int> crewMemberIds);
        // Validates all flight data for update

        Task<(bool isValid, string errorMessage)> ValidateFlightUpdateAsync(
            int flightId,
            DateTime departureTime,
            DateTime arrivalTime,
            int aircraftId,
            int departureAirportId,
            int arrivalAirportId,
            List<int> crewMemberIds);


        // Checks if a flight can be deleted

        Task<(bool canDelete, string errorMessage)> CanDeleteFlightAsync(int id);
    }
}
