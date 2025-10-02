using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightManagement.DTO;

namespace FlightManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CrewController : ControllerBase
    {

        // dependency injection of the DbContext
        private readonly FlightManagementContext _context;
        public CrewController(FlightManagementContext context)
        {
            _context = context;
        }

        // GET: api/crew
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CrewDTO>>> GetAllCrewMembers()
        {
            var crewList = await _context.CrewMembers.ToListAsync();
            var crewDtoList = crewList.Select(c => new CrewDTO
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Role = c.Role,
                LicenseNumber = c.LicenseNumber
            }).ToList();
            return Ok(crewDtoList);
        }

        // GET: api/crew/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CrewDTO>> GetCrewMemberById(int id)
        {
            var crewMember = await _context.CrewMembers.FindAsync(id);
            if (crewMember == null)
            {
                return NotFound();
            }
            var crewDto = new CrewDTO
            {
                Id = crewMember.Id,
                FirstName = crewMember.FirstName,
                LastName = crewMember.LastName,
                Role = crewMember.Role,
                LicenseNumber = crewMember.LicenseNumber
            };
            return Ok(crewDto);
        }

        // POST: api/crew
        [HttpPost]
        public async Task<IActionResult> CreateCrewMember(CreateCrewDTO crewMemberDto)
        {
            var crewMember = new Entities.Crew
            {
                FirstName = crewMemberDto.FirstName,
                LastName = crewMemberDto.LastName,
                Role = crewMemberDto.Role,
                LicenseNumber = crewMemberDto.LicenseNumber
            };
            _context.CrewMembers.Add(crewMember);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCrewMemberById), new { id = crewMember.Id }, crewMember);
        }

        // PUT: api/crew/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCrewMember(int id, CreateCrewDTO crewMemberDto)
        {
            var crewMember = await _context.CrewMembers.FindAsync(id);
            if (crewMember == null)
            {
                return NotFound();
            }
            crewMember.FirstName = crewMemberDto.FirstName;
            crewMember.LastName = crewMemberDto.LastName;
            crewMember.Role = crewMemberDto.Role;
            crewMember.LicenseNumber = crewMemberDto.LicenseNumber;

            _context.Entry(crewMember).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CrewMemberExists(id))
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

        private bool CrewMemberExists(int id)
        {
            return _context.CrewMembers.Any(e => e.Id == id);
        }

        // DELETE: api/crew/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCrewMember(int id)
        {
            var crewMember = await _context.CrewMembers.FindAsync(id);
            if (crewMember == null)
            {
                return NotFound();
            }
            _context.CrewMembers.Remove(crewMember);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}