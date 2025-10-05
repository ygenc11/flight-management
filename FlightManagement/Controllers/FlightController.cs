using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightManagement.DTO;
using FlightManagement.Entities;


namespace FlightManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightController : ControllerBase
    {
        // dependency injection of the DbContext
        private readonly FlightManagementContext _context;
        private readonly ILogger<FlightController> _logger;
        public FlightController(FlightManagementContext context, ILogger<FlightController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/flight
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FlightDTO>>> GetAllFlights()
        {
            var flightList = await _context.Flights
                .Include(f => f.CrewMembers)
                .Include(f => f.Aircraft)
                .Include(f => f.DepartureAirport)
                .Include(f => f.ArrivalAirport)
                .ToListAsync();

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
            _logger.LogDebug("All flights listed. Count: {Count}", flightDtoList.Count);
            return Ok(flightDtoList);
        }
        // GET: api/flight/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FlightDTO>> GetFlightById(int id)
        {
            var flight = await _context.Flights
                .Include(f => f.CrewMembers)
                .Include(f => f.Aircraft)
                .Include(f => f.DepartureAirport)
                .Include(f => f.ArrivalAirport)
                .FirstOrDefaultAsync(f => f.Id == id);

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
            var aircraft = await _context.Aircraft.FindAsync(flightDto.AircraftId);
            if (aircraft == null)
            {
                _logger.LogWarning("Invalid aircraft ID: {AircraftId}", flightDto.AircraftId);
                return BadRequest("Invalid aircraft ID.");
            }

            var departureAirport = await _context.Airports.FindAsync(flightDto.DepartureAirportId);
            if (departureAirport == null)
            {
                _logger.LogWarning("Invalid departure airport ID: {DepartureAirportId}", flightDto.DepartureAirportId);
                return BadRequest("Invalid departure airport ID.");
            }

            var arrivalAirport = await _context.Airports.FindAsync(flightDto.ArrivalAirportId);
            if (arrivalAirport == null)
            {
                _logger.LogWarning("Invalid arrival airport ID: {ArrivalAirportId}", flightDto.ArrivalAirportId);
                return BadRequest("Invalid arrival airport ID.");
            }

            var crewMembers = await _context.CrewMembers
                .Where(c => flightDto.CrewMemberIds.Contains(c.Id))
                .ToListAsync();

            if (crewMembers.Count != flightDto.CrewMemberIds.Count)
            {
                _logger.LogWarning("Invalid crew member IDs for flight creation.");
                return BadRequest("One or more crew member IDs are invalid.");
            }

            var validRoles = new[] { "pilot", "copilot", "flightattendant" };
            if (!crewMembers.All(c => validRoles.Contains(c.Role.ToLowerInvariant())))
            {
                _logger.LogWarning("Invalid crew member role for flight creation.");
                return BadRequest("Invalid crew member role.");
            }
            if (!crewMembers.Any(c => c.Role == "pilot"))
            {
                _logger.LogWarning("No pilot assigned for flight creation.");
                return BadRequest("At least one Pilot is required for each flight.");
            }
            if (!crewMembers.Any(c => c.Role == "copilot"))
            {
                _logger.LogWarning("No copilot assigned for flight creation.");
                return BadRequest("At least one CoPilot is required for each flight.");
            }

            var flight = new Entities.Flight
            {
                FlightNumber = flightDto.FlightNumber,
                DepartureTime = flightDto.DepartureTime,
                ArrivalTime = flightDto.ArrivalTime,
                AircraftId = flightDto.AircraftId,
                DepartureAirportId = flightDto.DepartureAirportId,
                ArrivalAirportId = flightDto.ArrivalAirportId,
                CrewMembers = crewMembers
            };

            _context.Flights.Add(flight);
            await _context.SaveChangesAsync();

            var responseDto = new FlightDTO
            {
                Id = flight.Id,
                FlightNumber = flight.FlightNumber,
                DepartureTime = flight.DepartureTime,
                ArrivalTime = flight.ArrivalTime,
                AircraftId = flight.AircraftId,
                DepartureAirportId = flight.DepartureAirportId,
                ArrivalAirportId = flight.ArrivalAirportId,
                Aircraft = new AircraftDTO
                {
                    Id = aircraft.Id,
                    Model = aircraft.Model,
                    TailNumber = aircraft.TailNumber,
                    SeatsCapacity = aircraft.SeatsCapacity
                },
                DepartureAirport = new AirportDTO
                {
                    Id = departureAirport.Id,
                    Name = departureAirport.Name,
                    IataCode = departureAirport.IataCode,
                    IcaoCode = departureAirport.IcaoCode,
                    City = departureAirport.City,
                    Country = departureAirport.Country
                },
                ArrivalAirport = new AirportDTO
                {
                    Id = arrivalAirport.Id,
                    Name = arrivalAirport.Name,
                    IataCode = arrivalAirport.IataCode,
                    IcaoCode = arrivalAirport.IcaoCode,
                    City = arrivalAirport.City,
                    Country = arrivalAirport.Country
                },
                CrewMembers = crewMembers.Select(c => new CrewDTO
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Role = c.Role,
                    LicenseNumber = c.LicenseNumber
                }).ToList()
            };

            _logger.LogInformation("Flight created: {Id} {FlightNumber}", flight.Id, flight.FlightNumber);
            return CreatedAtAction(nameof(GetFlightById), new { id = flight.Id }, responseDto);
        }

        // PUT: api/flight/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlight(int id, CreateFlightDTO flightDto)
        {
            var flight = await _context.Flights
                .Include(f => f.CrewMembers)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (flight == null)
            {
                _logger.LogError("Flight not found for update: {Id}", id);
                return NotFound();
            }

            var crewMembers = await _context.CrewMembers
                .Where(c => flightDto.CrewMemberIds.Contains(c.Id))
                .ToListAsync();

            if (crewMembers.Count != flightDto.CrewMemberIds.Count)
            {
                _logger.LogWarning("Invalid crew member IDs for flight update.");
                return BadRequest("One or more crew member IDs are invalid.");
            }

            var validRoles = new[] { "pilot", "copilot", "flightattendant" };
            if (!crewMembers.All(c => validRoles.Contains(c.Role.ToLowerInvariant())))
            {
                _logger.LogWarning("Invalid crew member role for flight update.");
                return BadRequest("Invalid crew member role.");
            }
            if (!crewMembers.Any(c => c.Role == "pilot"))
            {
                _logger.LogWarning("No pilot assigned for flight update.");
                return BadRequest("At least one Pilot is required for each flight.");
            }
            if (!crewMembers.Any(c => c.Role == "copilot"))
            {
                _logger.LogWarning("No copilot assigned for flight update.");
                return BadRequest("At least one CoPilot is required for each flight.");
            }

            flight.FlightNumber = flightDto.FlightNumber;
            flight.DepartureTime = flightDto.DepartureTime;
            flight.ArrivalTime = flightDto.ArrivalTime;
            flight.AircraftId = flightDto.AircraftId;
            flight.DepartureAirportId = flightDto.DepartureAirportId;
            flight.ArrivalAirportId = flightDto.ArrivalAirportId;

            // Update crew members
            flight.CrewMembers.Clear();
            flight.CrewMembers = crewMembers;

            _context.Entry(flight).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Flight updated: {Id} {FlightNumber}", flight.Id, flight.FlightNumber);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightExists(id))
                {
                    _logger.LogError("Flight not found after concurrency exception: {Id}", id);
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        private bool FlightExists(int id)
        {
            return _context.Flights.Any(e => e.Id == id);
        }
        // DELETE: api/flight/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
            {
                _logger.LogError("Flight not found for delete: {Id}", id);
                return NotFound();
            }
            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Flight deleted: {Id} {FlightNumber}", flight.Id, flight.FlightNumber);
            return NoContent();
        }
        // POST: api/flight/{id}/assign-crew
        [HttpPost("{id}/assign-crew")]
        public async Task<IActionResult> AssignCrew(int id, List<int> crewIds)
        {
            var flight = await _context.Flights
                .Include(f => f.CrewMembers)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (flight == null)
            {
                return NotFound();
            }

            var crewMembers = await _context.CrewMembers
                .Where(c => crewIds.Contains(c.Id))
                .ToListAsync();

            if (crewMembers.Count != crewIds.Count)
            {
                return BadRequest("One or more crew member IDs are invalid.");
            }

            var validRoles = new[] { "pilot", "copilot", "flightattendant" };
            if (!crewMembers.All(c => validRoles.Contains(c.Role)))
            {
                return BadRequest("Invalid crew member role.");
            }
            if (!crewMembers.Any(c => c.Role == "pilot"))
            {
                return BadRequest("At least one pilot is required for each flight.");
            }
            if (!crewMembers.Any(c => c.Role == "copilot"))
            {
                return BadRequest("At least one copilot is required for each flight.");
            }

            // Önceki ekip üyelerini temizle ve yenilerini ata
            flight.CrewMembers.Clear();
            flight.CrewMembers = crewMembers;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH: api/flight/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateFlightStatus(int id, [FromBody] string status, string statusDescription = "")
        {
            var validStatuses = new[] { "Planned", "Delayed", "Cancelled", "Departed", "Arrived" };
            if (!validStatuses.Contains(status))
            {
                return BadRequest("Invalid flight status.");
            }
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
                return NotFound();

            flight.Status = status;
            flight.StatusDescription = statusDescription;
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }

}