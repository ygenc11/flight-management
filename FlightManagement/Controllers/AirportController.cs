using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.Data;
using FlightManagement.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlightManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AirportController : ControllerBase
    {
        //dependency injection of the DbContext
        private readonly FlightManagementContext _context;
        public AirportController(FlightManagementContext context)
        {
            _context = context;
        }

        // GET: api/airport
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AirportDTO>>> GetAllAirports()
        {
            var airportList = await _context.Airports.ToListAsync();
            var dtoList = airportList.Select(a => new AirportDTO
            {
                Id = a.Id,
                Name = a.Name,
                City = a.City,
                Country = a.Country,
                IataCode = a.IataCode,
                IcaoCode = a.IcaoCode
            }).ToList();
            return Ok(dtoList);
        }

        // GET: api/airport/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AirportDTO>> GetAirportById(int id)
        {
            var airport = await _context.Airports.FindAsync(id);
            if (airport == null)
            {
                return NotFound();
            }
            var dto = new AirportDTO
            {
                Id = airport.Id,
                Name = airport.Name,
                City = airport.City,
                Country = airport.Country,
                IataCode = airport.IataCode,
                IcaoCode = airport.IcaoCode
            };
            return Ok(dto);
        }

        // POST: api/airport
        [HttpPost]
        public async Task<IActionResult> CreateAirport(CreateAirportDTO airportDto)
        {
            var airport = new Entities.Airport
            {
                Name = airportDto.Name,
                City = airportDto.City,
                Country = airportDto.Country,
                IataCode = airportDto.IataCode,
                IcaoCode = airportDto.IcaoCode
            };
            _context.Airports.Add(airport);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAirportById), new { id = airport.Id }, airport);
        }

        // PUT: api/airport/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAirport(int id, CreateAirportDTO airportDto)
        {
            var airport = await _context.Airports.FindAsync(id);
            if (airport == null)
            {
                return NotFound();
            }
            airport.Name = airportDto.Name;
            airport.City = airportDto.City;
            airport.Country = airportDto.Country;
            airport.IataCode = airportDto.IataCode;
            airport.IcaoCode = airportDto.IcaoCode;

            _context.Entry(airport).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Airports.Any(e => e.Id == id))
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

        // DELETE: api/airport/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAirport(int id)
        {
            var airport = await _context.Airports.FindAsync(id);
            if (airport == null)
            {
                return NotFound();
            }
            _context.Airports.Remove(airport);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}