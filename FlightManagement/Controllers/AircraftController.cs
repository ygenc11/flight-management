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
    public class AircraftController : ControllerBase
    {
        //dependency injection of the DbContext
        private readonly FlightManagementContext _context;
        private readonly ILogger<AircraftController> _logger;
        public AircraftController(FlightManagementContext context, ILogger<AircraftController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/aircraft
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AircraftDTO>>> GetAllAircraft()
        {
            var aircraftList = await _context.Aircraft.ToListAsync();
            var dtoList = aircraftList.Where(p => p.IsActive).Select(a => new AircraftDTO
            {
                Id = a.Id,
                Model = a.Model,
                TailNumber = a.TailNumber, // DTO'da Registration varsa
                SeatsCapacity = a.SeatsCapacity,  // DTO'da Capacity varsa
            }).ToList();
            _logger.LogDebug("All aircraft listed. Count: {Count}", dtoList.Count);
            return Ok(dtoList);
        }

        // GET: api/aircraft/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AircraftDTO>> GetAircraftById(int id)
        {
            var aircraft = await _context.Aircraft.FindAsync(id);
            if (aircraft == null)
            {
                _logger.LogWarning("Aircraft not found: {Id}", id);
                return NotFound();
            }
            var dto = new AircraftDTO
            {
                Id = aircraft.Id,
                Model = aircraft.Model,
                TailNumber = aircraft.TailNumber,
                SeatsCapacity = aircraft.SeatsCapacity
            };
            _logger.LogInformation("Aircraft fetched: {Id} {Model}", dto.Id, dto.Model);
            return Ok(dto);
        }

        // POST: api/aircraft
        [HttpPost]
        public async Task<ActionResult<AircraftDTO>> CreateAircraft(CreateAircraftDTO aircraftDto)
        {
            var aircraft = new Entities.Aircraft
            {
                Model = aircraftDto.Model,
                TailNumber = aircraftDto.TailNumber,
                SeatsCapacity = aircraftDto.SeatsCapacity,
                IsActive = true // entityde isactive otomatik true olarak ayarlanıyor yani buraya yazmasak da olur
            };
            _context.Aircraft.Add(aircraft);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Aircraft created: {Id} {Model}", aircraft.Id, aircraft.Model);
            return CreatedAtAction(nameof(GetAircraftById), new { id = aircraft.Id }, aircraft);
        }

        // PUT: api/aircraft/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAircraft(int id, CreateAircraftDTO aircraft)
        {
            var existingAircraft = await _context.Aircraft.FindAsync(id);
            if (existingAircraft == null)
            {
                _logger.LogError("Aircraft not found for update: {Id}", id);
                return NotFound();
            }
            existingAircraft.Model = aircraft.Model;
            existingAircraft.TailNumber = aircraft.TailNumber;
            existingAircraft.SeatsCapacity = aircraft.SeatsCapacity;

            _context.Entry(existingAircraft).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Aircraft updated: {Id} {Model}", existingAircraft.Id, existingAircraft.Model);
            }
            catch (Exception)
            {
                if (!_context.Aircraft.Any(e => e.Id == id))
                {
                    _logger.LogError("Aircraft not found after exception: {Id}", id);
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE: api/aircraft/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAircraft(int id)
        {
            var aircraft = await _context.Aircraft.FindAsync(id);
            if (aircraft == null)
            {
                _logger.LogError("Aircraft not found for delete: {Id}", id);
                return NotFound();
            }
            _context.Aircraft.Remove(aircraft);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Aircraft deleted: {Id} {Model}", aircraft.Id, aircraft.Model);
            return NoContent();
        }


    }
}