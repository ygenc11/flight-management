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
        public FlightController(FlightManagementContext context)
        {
            _context = context;
        }

        // GET: api/flight
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FlightDTO>>> GetAllFlights()
        {
            var flightList = await _context.Flights.ToListAsync();
            var flightDtoList = flightList.Select(f => new FlightDTO
            {
                Id = f.Id,
                FlightNumber = f.FlightNumber,
                AircraftId = f.AircraftId,
                DepartureTime = f.DepartureTime,
                ArrivalTime = f.ArrivalTime,
                DepartureAirportId = f.DepartureAirportId,
                ArrivalAirportId = f.ArrivalAirportId
            }).ToList();
            return Ok(flightDtoList);
        }
        // GET: api/flight/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FlightDTO>> GetFlightById(int id)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
            {
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
                ArrivalAirportId = flight.ArrivalAirportId
            };
            return Ok(flightDto);
        }

        // POST: api/flight
        [HttpPost]
        public async Task<IActionResult> CreateFlight(CreateFlightDTO flightDto)
        {
            var aircraft = await _context.Aircraft.FindAsync(flightDto.AircraftId);
            if (aircraft == null)
            {
                return BadRequest("Invalid aircraft ID.");
            }

            var departureAirport = await _context.Airports.FindAsync(flightDto.DepartureAirportId);
            if (departureAirport == null)
            {
                return BadRequest("Invalid departure airport ID.");
            }

            var arrivalAirport = await _context.Airports.FindAsync(flightDto.ArrivalAirportId);
            if (arrivalAirport == null)
            {
                return BadRequest("Invalid arrival airport ID.");
            }

            var crewMembers = await _context.CrewMembers
                .Where(c => flightDto.CrewMemberIds.Contains(c.Id))
                .ToListAsync();

            if (crewMembers.Count != flightDto.CrewMemberIds.Count)
            {
                return BadRequest("One or more crew member IDs are invalid.");
            }

            //!!!!role validation can be added here!!!!

            var flight = new Entities.Flight
            {
                FlightNumber = flightDto.FlightNumber,
                DepartureTime = flightDto.DepartureTime,
                ArrivalTime = flightDto.ArrivalTime,
                AircraftId = flightDto.AircraftId,
                DepartureAirportId = flightDto.DepartureAirportId,
                ArrivalAirportId = flightDto.ArrivalAirportId
            };
            _context.Flights.Add(flight);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFlightById), new { id = flight.Id }, flight);
        }

        // PUT: api/flight/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlight(int id, CreateFlightDTO flightDto)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
            {
                return NotFound();
            }
            flight.FlightNumber = flightDto.FlightNumber;
            flight.DepartureTime = flightDto.DepartureTime;
            flight.ArrivalTime = flightDto.ArrivalTime;
            flight.AircraftId = flightDto.AircraftId;
            flight.DepartureAirportId = flightDto.DepartureAirportId;
            flight.ArrivalAirportId = flightDto.ArrivalAirportId;

            _context.Entry(flight).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FlightExists(id))
                {
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
                return NotFound();
            }
            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // POST: api/flight/{id}/assign-crew
        [HttpPost("{id}/assign-crew")]
        public async Task<IActionResult> AssignCrew(int id, List<int> crewIds)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
            {
                return NotFound();
            }

            // Assign crew members to the flight
            foreach (var crewId in crewIds)
            {
                var crewMember = await _context.CrewMembers.FindAsync(crewId);
                if (crewMember != null)
                {
                    flight.CrewMembers.Add(crewMember);
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
        // PATCH: api/flight/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateFlightStatus(int id, [FromBody] FlightStatus status)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
                return NotFound();

            flight.Status = status;
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }

}