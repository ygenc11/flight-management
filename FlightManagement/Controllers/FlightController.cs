using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FlightManagement.DTO;
using FlightManagement.Services;

namespace FlightManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightController : ControllerBase
    {
        private readonly IFlightService _flightService;
        private readonly ILogger<FlightController> _logger;

        public FlightController(IFlightService flightService, ILogger<FlightController> logger)
        {
            _flightService = flightService;
            _logger = logger;
        }

        // GET: api/flight
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FlightDTO>>> GetAllFlights()
        {
            var flightList = await _flightService.GetAllFlightsAsync();

            var flightDtoList = flightList.Select(f => new FlightDTO
            {
                Id = f.Id,
                FlightNumber = f.FlightNumber,
                AircraftId = f.AircraftId,
                DepartureTime = f.DepartureTime,
                ArrivalTime = f.ArrivalTime,
                DepartureAirportId = f.DepartureAirportId,
                ArrivalAirportId = f.ArrivalAirportId,
                Status = f.Status,
                StatusDescription = f.StatusDescription,

                Aircraft = f.Aircraft != null ? new AircraftDTO
                {
                    Id = f.Aircraft.Id,
                    Model = f.Aircraft.Model,
                    TailNumber = f.Aircraft.TailNumber,
                    SeatsCapacity = f.Aircraft.SeatsCapacity
                } : new AircraftDTO(),
                DepartureAirport = f.DepartureAirport != null ? new AirportDTO
                {
                    Id = f.DepartureAirport.Id,
                    Name = f.DepartureAirport.Name,
                    IataCode = f.DepartureAirport.IataCode,
                    IcaoCode = f.DepartureAirport.IcaoCode,
                    City = f.DepartureAirport.City,
                    Country = f.DepartureAirport.Country
                } : new AirportDTO(),
                ArrivalAirport = f.ArrivalAirport != null ? new AirportDTO
                {
                    Id = f.ArrivalAirport.Id,
                    Name = f.ArrivalAirport.Name,
                    IataCode = f.ArrivalAirport.IataCode,
                    IcaoCode = f.ArrivalAirport.IcaoCode,
                    City = f.ArrivalAirport.City,
                    Country = f.ArrivalAirport.Country
                } : new AirportDTO(),
                CrewMembers = f.CrewMembers.Select(c => new CrewDTO
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Role = c.Role,
                    LicenseNumber = c.LicenseNumber
                }).ToList()
            }).ToList();

            return Ok(flightDtoList);
        }
        // GET: api/flight/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FlightDTO>> GetFlightById(int id)
        {
            var flight = await _flightService.GetFlightWithDetailsAsync(id);

            if (flight == null)
            {
                _logger.LogWarning("Flight not found: {Id}", id);
                return NotFound();
            }

            var flightDto = new FlightDTO
            {
                Id = flight.Id,
                FlightNumber = flight.FlightNumber,
                AircraftId = flight.AircraftId,
                DepartureTime = flight.DepartureTime,
                ArrivalTime = flight.ArrivalTime,
                DepartureAirportId = flight.DepartureAirportId,
                ArrivalAirportId = flight.ArrivalAirportId,
                Status = flight.Status,
                StatusDescription = flight.StatusDescription,
                Aircraft = flight.Aircraft != null ? new AircraftDTO
                {
                    Id = flight.Aircraft.Id,
                    Model = flight.Aircraft.Model,
                    TailNumber = flight.Aircraft.TailNumber,
                    SeatsCapacity = flight.Aircraft.SeatsCapacity
                } : new AircraftDTO(),
                DepartureAirport = flight.DepartureAirport != null ? new AirportDTO
                {
                    Id = flight.DepartureAirport.Id,
                    Name = flight.DepartureAirport.Name,
                    IataCode = flight.DepartureAirport.IataCode,
                    IcaoCode = flight.DepartureAirport.IcaoCode,
                    City = flight.DepartureAirport.City,
                    Country = flight.DepartureAirport.Country
                } : new AirportDTO(),
                ArrivalAirport = flight.ArrivalAirport != null ? new AirportDTO
                {
                    Id = flight.ArrivalAirport.Id,
                    Name = flight.ArrivalAirport.Name,
                    IataCode = flight.ArrivalAirport.IataCode,
                    IcaoCode = flight.ArrivalAirport.IcaoCode,
                    City = flight.ArrivalAirport.City,
                    Country = flight.ArrivalAirport.Country
                } : new AirportDTO(),
                CrewMembers = flight.CrewMembers.Select(c => new CrewDTO
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Role = c.Role,
                    LicenseNumber = c.LicenseNumber
                }).ToList()
            };
            _logger.LogInformation("Flight fetched: {Id} {FlightNumber}", flightDto.Id, flightDto.FlightNumber);
            return Ok(flightDto);
        }

        // POST: api/flight
        [HttpPost]
        public async Task<IActionResult> CreateFlight(CreateFlightDTO flightDto)
        {
            // Validate all flight data using service
            var (isValid, errorMessage) = await _flightService.ValidateFlightCreationAsync(
                flightDto.DepartureTime,
                flightDto.ArrivalTime,
                flightDto.AircraftId,
                flightDto.DepartureAirportId,
                flightDto.ArrivalAirportId,
                flightDto.CrewMemberIds);

            if (!isValid)
            {
                _logger.LogWarning("Flight creation validation failed: {Error}", errorMessage);
                return BadRequest(errorMessage);
            }

            // Create flight
            var flight = await _flightService.CreateFlightAsync(
                flightDto.FlightNumber,
                flightDto.DepartureTime,
                flightDto.ArrivalTime,
                flightDto.AircraftId,
                flightDto.DepartureAirportId,
                flightDto.ArrivalAirportId,
                flightDto.CrewMemberIds);

            // Get flight with details for response
            var flightWithDetails = await _flightService.GetFlightWithDetailsAsync(flight.Id);
            if (flightWithDetails == null)
            {
                return StatusCode(500, "Flight created but could not retrieve details.");
            }

            // Map to DTO for response
            var responseDto = new FlightDTO
            {
                Id = flightWithDetails.Id,
                FlightNumber = flightWithDetails.FlightNumber,
                DepartureTime = flightWithDetails.DepartureTime,
                ArrivalTime = flightWithDetails.ArrivalTime,
                AircraftId = flightWithDetails.AircraftId,
                DepartureAirportId = flightWithDetails.DepartureAirportId,
                ArrivalAirportId = flightWithDetails.ArrivalAirportId,
                Status = flightWithDetails.Status,
                StatusDescription = flightWithDetails.StatusDescription,
                Aircraft = flightWithDetails.Aircraft != null ? new AircraftDTO
                {
                    Id = flightWithDetails.Aircraft.Id,
                    Model = flightWithDetails.Aircraft.Model,
                    TailNumber = flightWithDetails.Aircraft.TailNumber,
                    SeatsCapacity = flightWithDetails.Aircraft.SeatsCapacity
                } : new AircraftDTO(),
                DepartureAirport = flightWithDetails.DepartureAirport != null ? new AirportDTO
                {
                    Id = flightWithDetails.DepartureAirport.Id,
                    Name = flightWithDetails.DepartureAirport.Name,
                    IataCode = flightWithDetails.DepartureAirport.IataCode,
                    IcaoCode = flightWithDetails.DepartureAirport.IcaoCode,
                    City = flightWithDetails.DepartureAirport.City,
                    Country = flightWithDetails.DepartureAirport.Country
                } : new AirportDTO(),
                ArrivalAirport = flightWithDetails.ArrivalAirport != null ? new AirportDTO
                {
                    Id = flightWithDetails.ArrivalAirport.Id,
                    Name = flightWithDetails.ArrivalAirport.Name,
                    IataCode = flightWithDetails.ArrivalAirport.IataCode,
                    IcaoCode = flightWithDetails.ArrivalAirport.IcaoCode,
                    City = flightWithDetails.ArrivalAirport.City,
                    Country = flightWithDetails.ArrivalAirport.Country
                } : new AirportDTO(),
                CrewMembers = flightWithDetails.CrewMembers.Select(c => new CrewDTO
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Role = c.Role,
                    LicenseNumber = c.LicenseNumber
                }).ToList()
            };

            _logger.LogInformation("Flight created successfully: {Id} - {FlightNumber} from {DepartureAirport} to {ArrivalAirport}",
                flight.Id, flight.FlightNumber, flightWithDetails.DepartureAirport?.IataCode ?? "N/A", flightWithDetails.ArrivalAirport?.IataCode ?? "N/A");

            return CreatedAtAction(nameof(GetFlightById), new { id = responseDto.Id }, responseDto);
        }

        // PUT: api/flight/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlight(int id, CreateFlightDTO flightDto)
        {
            try
            {
                _logger.LogInformation("Flight update request received for flight {Id}. Status from request: '{Status}'", id, flightDto.Status);

                // Validate all flight data using service
                var (isValid, errorMessage) = await _flightService.ValidateFlightUpdateAsync(
                    id,
                    flightDto.DepartureTime,
                    flightDto.ArrivalTime,
                    flightDto.AircraftId,
                    flightDto.DepartureAirportId,
                    flightDto.ArrivalAirportId,
                    flightDto.CrewMemberIds);

                if (!isValid)
                {
                    _logger.LogWarning("Flight update validation failed for flight {Id}: {Error}", id, errorMessage);
                    return BadRequest(errorMessage);
                }

                // Update flight
                var success = await _flightService.UpdateFlightAsync(
                    id,
                    flightDto.FlightNumber,
                    flightDto.DepartureTime,
                    flightDto.ArrivalTime,
                    flightDto.AircraftId,
                    flightDto.DepartureAirportId,
                    flightDto.ArrivalAirportId,
                    flightDto.CrewMemberIds,
                    flightDto.Status);

                if (!success)
                {
                    _logger.LogError("Flight not found for update: {Id}", id);
                    return NotFound();
                }

                _logger.LogInformation("Flight {Id} updated successfully with status: {Status}", id, flightDto.Status);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating flight {Id}", id);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PATCH: api/flight/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateFlightStatus(int id, [FromBody] UpdateFlightStatusDTO statusDto)
        {
            try
            {
                _logger.LogInformation("Flight status update request received for flight {Id}. New status: '{Status}'", id, statusDto.Status);

                var success = await _flightService.UpdateFlightStatusAsync(id, statusDto.Status, statusDto.StatusDescription ?? string.Empty);

                if (!success)
                {
                    _logger.LogWarning("Flight not found for status update: {Id}", id);
                    return NotFound($"Flight with ID {id} not found.");
                }

                _logger.LogInformation("Flight {Id} status updated successfully to: {Status}", id, statusDto.Status);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating flight status for flight {Id}", id);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/flight/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            // Check if flight can be deleted
            var (canDelete, errorMessage) = await _flightService.CanDeleteFlightAsync(id);
            if (!canDelete)
            {
                _logger.LogWarning("Cannot delete flight {Id}: {Error}", id, errorMessage);
                return BadRequest(errorMessage);
            }

            // Delete flight
            var success = await _flightService.DeleteFlightAsync(id);
            if (!success)
            {
                _logger.LogError("Flight not found for delete: {Id}", id);
                return NotFound();
            }

            _logger.LogInformation("Flight deleted successfully: {Id}", id);

            return NoContent();
        }
    }
}