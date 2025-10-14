using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.Entities;
using FlightManagement.Repositories;
using Microsoft.Extensions.Logging;

namespace FlightManagement.Services
{
    // Service implementation for Flight business logic
    public class FlightService : IFlightService
    {
        private readonly IFlightRepository _flightRepository;
        private readonly ICrewRepository _crewRepository;
        private readonly ILogger<FlightService> _logger;

        public FlightService(
            IFlightRepository flightRepository,
            ICrewRepository crewRepository,
            ILogger<FlightService> logger)
        {
            _flightRepository = flightRepository;
            _crewRepository = crewRepository;
            _logger = logger;
        }

        // ============= CRUD Operations =============

        // Gets all flights with navigation properties (Aircraft, Airports, Crew)
        public async Task<IEnumerable<Flight>> GetAllFlightsAsync()
        {
            _logger.LogDebug("Fetching all flights with details");
            return await _flightRepository.GetAllFlightsWithDetailsAsync();
        }

        // Gets a flight by ID
        public async Task<Flight?> GetFlightByIdAsync(int id)
        {
            _logger.LogDebug("Fetching flight by ID: {FlightId}", id);
            return await _flightRepository.GetByIdAsync(id);
        }

        // Gets a flight with all details (Aircraft, Airports, Crew)
        public async Task<Flight?> GetFlightWithDetailsAsync(int id)
        {
            _logger.LogDebug("Fetching flight with details: {FlightId}", id);
            return await _flightRepository.GetFlightWithDetailsAsync(id);
        }

        // Creates a new flight with crew members
        public async Task<Flight> CreateFlightAsync(
            string flightNumber,
            DateTime departureTime,
            DateTime arrivalTime,
            int aircraftId,
            int departureAirportId,
            int arrivalAirportId,
            List<int> crewMemberIds)
        {
            var flight = new Flight
            {
                FlightNumber = flightNumber,
                DepartureTime = departureTime,
                ArrivalTime = arrivalTime,
                AircraftId = aircraftId,
                DepartureAirportId = departureAirportId,
                ArrivalAirportId = arrivalAirportId,
                Status = "Planned"
            };

            // Get crew members
            foreach (var crewId in crewMemberIds)
            {
                var crew = await _crewRepository.GetByIdAsync(crewId);
                if (crew != null)
                {
                    flight.CrewMembers.Add(crew);
                }
            }

            await _flightRepository.AddAsync(flight);

            _logger.LogInformation("Flight created: {Id} {FlightNumber} with {CrewCount} crew members",
                flight.Id, flight.FlightNumber, flight.CrewMembers.Count);

            return flight;
        }


        // Updates an existing flight with crew members
        public async Task<bool> UpdateFlightAsync(
            int id,
            string flightNumber,
            DateTime departureTime,
            DateTime arrivalTime,
            int aircraftId,
            int departureAirportId,
            int arrivalAirportId,
            List<int> crewMemberIds,
            string status)
        {
            var flight = await _flightRepository.GetFlightWithDetailsAsync(id);
            if (flight == null)
            {
                _logger.LogWarning("Flight not found for update: {FlightId}", id);
                return false;
            }

            flight.FlightNumber = flightNumber;
            flight.DepartureTime = departureTime;
            flight.ArrivalTime = arrivalTime;
            flight.AircraftId = aircraftId;
            flight.DepartureAirportId = departureAirportId;
            flight.ArrivalAirportId = arrivalAirportId;
            flight.Status = status;

            // Update crew members
            flight.CrewMembers.Clear();
            foreach (var crewId in crewMemberIds)
            {
                var crew = await _crewRepository.GetByIdAsync(crewId);
                if (crew != null)
                {
                    flight.CrewMembers.Add(crew);
                }
            }

            await _flightRepository.UpdateAsync(flight);

            _logger.LogInformation("Flight updated: {Id} {FlightNumber} with {CrewCount} crew members",
                flight.Id, flight.FlightNumber, flight.CrewMembers.Count);

            return true;
        }

        // Updates only the status of a flight
        public async Task<bool> UpdateFlightStatusAsync(int id, string status, string statusDescription)
        {
            var flight = await _flightRepository.GetByIdAsync(id);
            if (flight == null)
            {
                _logger.LogWarning("Flight not found for status update: {FlightId}", id);
                return false;
            }

            flight.Status = status;
            flight.StatusDescription = statusDescription;

            await _flightRepository.UpdateAsync(flight);

            _logger.LogInformation("Flight status updated: {Id} {FlightNumber} - New status: {Status}",
                flight.Id, flight.FlightNumber, status);

            return true;
        }

        // Deletes a flight
        public async Task<bool> DeleteFlightAsync(int id)
        {
            var flight = await _flightRepository.GetByIdAsync(id);
            if (flight == null)
            {
                _logger.LogWarning("Flight not found for delete: {FlightId}", id);
                return false;
            }

            await _flightRepository.DeleteAsync(flight);

            _logger.LogInformation("Flight deleted: {Id} {FlightNumber}",
                flight.Id, flight.FlightNumber);

            return true;
        }

        // ============= Validation Methods =============

        // Validates flight times
        // Rule 1: Arrival time must be after departure time
        // Rule 2: Departure time must be in the future
        public (bool isValid, string errorMessage) ValidateFlightTimes(DateTime departureTime, DateTime arrivalTime)
        {
            // Rule 1: Arrival > Departure
            if (arrivalTime <= departureTime)
            {
                _logger.LogWarning("Flight time validation failed: Arrival time ({Arrival}) must be after departure time ({Departure})",
                    arrivalTime, departureTime);
                return (false, "Arrival time must be after departure time.");
            }

            // Rule 2: Departure time must be in the future
            if (departureTime <= DateTime.UtcNow)
            {
                _logger.LogWarning("Flight time validation failed: Departure time ({Departure}) must be in the future. Current time: {Now}",
                    departureTime, DateTime.UtcNow);
                return (false, "Departure time must be in the future. Cannot schedule flights in the past.");
            }

            return (true, string.Empty);
        }

        // Validates airports
        // Rule: Departure and arrival airports cannot be the same
        public (bool isValid, string errorMessage) ValidateAirports(int departureAirportId, int arrivalAirportId)
        {
            if (departureAirportId == arrivalAirportId)
            {
                _logger.LogWarning("Airport validation failed: Departure and arrival airports are the same ({AirportId})",
                    departureAirportId);
                return (false, "Departure and arrival airports cannot be the same.");
            }

            return (true, string.Empty);
        }

        // Validates crew composition
        // Rule: Flight must have at least 1 Pilot and 1 CoPilot
        public async Task<(bool isValid, string errorMessage)> ValidateCrewCompositionAsync(List<int> crewMemberIds)
        {
            if (crewMemberIds == null || crewMemberIds.Count == 0)
            {
                _logger.LogWarning("Crew composition validation failed: No crew members assigned");
                return (false, "Flight must have at least 1 Pilot and 1 CoPilot.");
            }

            // Get all crew members
            var crewMembers = new List<Crew>();
            foreach (var crewId in crewMemberIds)
            {
                var crew = await _crewRepository.GetByIdAsync(crewId);
                if (crew != null)
                {
                    crewMembers.Add(crew);
                }
            }

            // Check for at least 1 Pilot
            var hasPilot = crewMembers.Any(c => c.Role.Equals("pilot", StringComparison.OrdinalIgnoreCase));
            if (!hasPilot)
            {
                _logger.LogWarning("Crew composition validation failed: No Pilot assigned");
                return (false, "Flight must have at least 1 Pilot.");
            }

            // Check for at least 1 CoPilot
            var hasCoPilot = crewMembers.Any(c => c.Role.Equals("copilot", StringComparison.OrdinalIgnoreCase));
            if (!hasCoPilot)
            {
                _logger.LogWarning("Crew composition validation failed: No CoPilot assigned");
                return (false, "Flight must have at least 1 CoPilot.");
            }

            _logger.LogDebug("Crew composition validation passed: {PilotCount} Pilot(s), {CoPilotCount} CoPilot(s), {AttendantCount} Flight Attendant(s)",
                crewMembers.Count(c => c.Role.Equals("pilot", StringComparison.OrdinalIgnoreCase)),
                crewMembers.Count(c => c.Role.Equals("copilot", StringComparison.OrdinalIgnoreCase)),
                crewMembers.Count(c => c.Role.Equals("flightattendant", StringComparison.OrdinalIgnoreCase)));

            return (true, string.Empty);
        }

        // Validates aircraft availability
        // Rule: Aircraft cannot be assigned to multiple flights at the same time
        public async Task<(bool isValid, string errorMessage)> ValidateAircraftAvailabilityAsync(
            int aircraftId,
            DateTime departureTime,
            DateTime arrivalTime,
            int? excludeFlightId = null)
        {
            var isAvailable = await _flightRepository.IsAircraftAvailableAsync(
                aircraftId,
                departureTime,
                arrivalTime,
                excludeFlightId);

            if (!isAvailable)
            {
                _logger.LogWarning("Aircraft availability validation failed: Aircraft {AircraftId} is already assigned to another flight during {Departure} - {Arrival}",
                    aircraftId, departureTime, arrivalTime);
                return (false, $"Aircraft is already assigned to another flight during this time period.");
            }

            return (true, string.Empty);
        }

        // Validates crew member availability
        // Rule: Crew member cannot be assigned to multiple flights at the same time
        public async Task<(bool isValid, string errorMessage)> ValidateCrewMemberAvailabilityAsync(
            int crewId,
            DateTime departureTime,
            DateTime arrivalTime,
            int? excludeFlightId = null)
        {
            var isAvailable = await _flightRepository.IsCrewMemberAvailableAsync(
                crewId,
                departureTime,
                arrivalTime,
                excludeFlightId);

            if (!isAvailable)
            {
                var crew = await _crewRepository.GetByIdAsync(crewId);
                var crewName = crew != null ? $"{crew.FirstName} {crew.LastName}" : $"ID:{crewId}";

                _logger.LogWarning("Crew availability validation failed: Crew member {CrewId} ({CrewName}) is already assigned to another flight during {Departure} - {Arrival}",
                    crewId, crewName, departureTime, arrivalTime);
                return (false, $"Crew member '{crewName}' is already assigned to another flight during this time period.");
            }

            return (true, string.Empty);
        }

        // Validates all crew members' availability for a flight
        public async Task<(bool isValid, string errorMessage)> ValidateAllCrewAvailabilityAsync(
            List<int> crewMemberIds,
            DateTime departureTime,
            DateTime arrivalTime,
            int? excludeFlightId = null)
        {
            foreach (var crewId in crewMemberIds)
            {
                var (isValid, errorMessage) = await ValidateCrewMemberAvailabilityAsync(
                    crewId,
                    departureTime,
                    arrivalTime,
                    excludeFlightId);

                if (!isValid)
                {
                    return (false, errorMessage);
                }
            }

            return (true, string.Empty);
        }

        // Validates all flight data for creation
        public async Task<(bool isValid, string errorMessage)> ValidateFlightCreationAsync(
            DateTime departureTime,
            DateTime arrivalTime,
            int aircraftId,
            int departureAirportId,
            int arrivalAirportId,
            List<int> crewMemberIds)
        {
            // 1. Validate flight times
            var timeValidation = ValidateFlightTimes(departureTime, arrivalTime);
            if (!timeValidation.isValid)
            {
                return timeValidation;
            }

            // 2. Validate airports
            var airportValidation = ValidateAirports(departureAirportId, arrivalAirportId);
            if (!airportValidation.isValid)
            {
                return airportValidation;
            }

            // 3. Validate crew composition (at least 1 Pilot and 1 CoPilot)
            var compositionValidation = await ValidateCrewCompositionAsync(crewMemberIds);
            if (!compositionValidation.isValid)
            {
                return compositionValidation;
            }

            // 4. Validate aircraft availability
            var aircraftValidation = await ValidateAircraftAvailabilityAsync(
                aircraftId,
                departureTime,
                arrivalTime);
            if (!aircraftValidation.isValid)
            {
                return aircraftValidation;
            }

            // 5. Validate crew availability
            var crewValidation = await ValidateAllCrewAvailabilityAsync(
                crewMemberIds,
                departureTime,
                arrivalTime);
            if (!crewValidation.isValid)
            {
                return crewValidation;
            }

            _logger.LogInformation("Flight creation validation passed");
            return (true, string.Empty);
        }

        // Validates all flight data for update
        public async Task<(bool isValid, string errorMessage)> ValidateFlightUpdateAsync(
            int flightId,
            DateTime departureTime,
            DateTime arrivalTime,
            int aircraftId,
            int departureAirportId,
            int arrivalAirportId,
            List<int> crewMemberIds)
        {
            // 1. Validate flight times
            var timeValidation = ValidateFlightTimes(departureTime, arrivalTime);
            if (!timeValidation.isValid)
            {
                return timeValidation;
            }

            // 2. Validate airports
            var airportValidation = ValidateAirports(departureAirportId, arrivalAirportId);
            if (!airportValidation.isValid)
            {
                return airportValidation;
            }

            // 3. Validate crew composition (at least 1 Pilot and 1 CoPilot)
            var compositionValidation = await ValidateCrewCompositionAsync(crewMemberIds);
            if (!compositionValidation.isValid)
            {
                return compositionValidation;
            }

            // 4. Validate aircraft availability (excluding current flight)
            var aircraftValidation = await ValidateAircraftAvailabilityAsync(
                aircraftId,
                departureTime,
                arrivalTime,
                flightId);
            if (!aircraftValidation.isValid)
            {
                return aircraftValidation;
            }

            // 5. Validate crew availability (excluding current flight)
            var crewValidation = await ValidateAllCrewAvailabilityAsync(
                crewMemberIds,
                departureTime,
                arrivalTime,
                flightId);
            if (!crewValidation.isValid)
            {
                return crewValidation;
            }

            _logger.LogInformation("Flight update validation passed for flight {FlightId}", flightId);
            return (true, string.Empty);
        }

        // Checks if a flight can be deleted
        public async Task<(bool canDelete, string errorMessage)> CanDeleteFlightAsync(int id)
        {
            var flight = await _flightRepository.GetByIdAsync(id);
            if (flight == null)
            {
                return (false, "Flight not found.");
            }

            // Optional: Add business rules for deletion
            // For example: Cannot delete flights that have already departed
            // if (flight.DepartureTime <= DateTime.UtcNow)
            // {
            //     return (false, "Cannot delete flights that have already departed.");
            // }

            return (true, string.Empty);
        }
    }
}
