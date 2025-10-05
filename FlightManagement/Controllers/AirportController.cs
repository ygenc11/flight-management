using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.Data;
using FlightManagement.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FlightManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AirportController : ControllerBase
    {
        // dependency injection of the DbContext
        private readonly FlightManagementContext _context;
        private readonly ILogger<AirportController> _logger;
        public AirportController(FlightManagementContext context, ILogger<AirportController> logger)
        {
            _context = context;
            _logger = logger;
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
            _logger.LogDebug("All airports listed. Count: {Count}", dtoList.Count);
            return Ok(dtoList);
        }

        // GET: api/airport/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AirportDTO>> GetAirportById(int id)
        {
            var airport = await _context.Airports.FindAsync(id);
            if (airport == null)
            {
                _logger.LogWarning("Airport not found: {Id}", id);
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
            _logger.LogInformation("Airport fetched: {Id} {Name}", dto.Id, dto.Name);
            return Ok(dto);
        }

        // POST: api/airport
        [HttpPost]
        public async Task<IActionResult> CreateAirport(CreateAirportDTO airportDto)
        {
            // IataCode benzersiz mi kontrolü
            var exists = await _context.Airports.AnyAsync(a => a.IataCode == airportDto.IataCode);
            if (exists)
            {
                _logger.LogWarning("Airport create failed: IataCode already exists ({IataCode})", airportDto.IataCode);
                return BadRequest(new { error = "Bu IataCode zaten mevcut!" });
            }
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
            _logger.LogInformation("Airport created: {Id} {Name}", airport.Id, airport.Name);
            return CreatedAtAction(nameof(GetAirportById), new { id = airport.Id }, airport);
        }

        // PUT: api/airport/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAirport(int id, CreateAirportDTO airportDto)
        {
            var airport = await _context.Airports.FindAsync(id);
            if (airport == null)
            {
                _logger.LogError("Airport not found for update: {Id}", id);
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
                _logger.LogInformation("Airport updated: {Id} {Name}", airport.Id, airport.Name);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Airports.Any(e => e.Id == id))
                {
                    _logger.LogError("Airport not found after concurrency exception: {Id}", id);
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
                _logger.LogError("Airport not found for delete: {Id}", id);
                return NotFound();
            }
            _context.Airports.Remove(airport);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Airport deleted: {Id} {Name}", airport.Id, airport.Name);
            return NoContent();
        }

    }
}