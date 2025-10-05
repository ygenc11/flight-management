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
    public class AircraftController : ControllerBase
    {
        //dependency injection of the DbContext
        private readonly FlightManagementContext _context;
        public AircraftController(FlightManagementContext context)
        {
            _context = context;

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

            return Ok(dtoList);
        }

        // GET: api/aircraft/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AircraftDTO>> GetAircraftById(int id)
        {
            var aircraft = await _context.Aircraft.FindAsync(id);
            if (aircraft == null)
            {
                return NotFound();
            }
            var dto = new AircraftDTO
            {
                Id = aircraft.Id,
                Model = aircraft.Model,
                TailNumber = aircraft.TailNumber,
                SeatsCapacity = aircraft.SeatsCapacity
            };
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
            return CreatedAtAction(nameof(GetAircraftById), new { id = aircraft.Id }, aircraft);
        }

        // PUT: api/aircraft/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAircraft(int id, CreateAircraftDTO aircraft)
        {
            var existingAircraft = await _context.Aircraft.FindAsync(id);
            if (existingAircraft == null)
            {
                return NotFound();
            }
            existingAircraft.Model = aircraft.Model;
            existingAircraft.TailNumber = aircraft.TailNumber;
            existingAircraft.SeatsCapacity = aircraft.SeatsCapacity;

            _context.Entry(existingAircraft).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                if (!_context.Aircraft.Any(e => e.Id == id))
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

        // DELETE: api/aircraft/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAircraft(int id)
        {
            var aircraft = await _context.Aircraft.FindAsync(id);
            if (aircraft == null)
            {
                return NotFound();
            }
            _context.Aircraft.Remove(aircraft);
            await _context.SaveChangesAsync();
            return NoContent();
        }


    }
}