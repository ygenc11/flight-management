using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightManagement.DTO;
using Microsoft.Extensions.Logging;

namespace FlightManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CrewController : ControllerBase
    {

        // dependency injection of the DbContext
        private readonly FlightManagementContext _context;
        private readonly ILogger<CrewController> _logger;
        public CrewController(FlightManagementContext context, ILogger<CrewController> logger)
        {
            _context = context;
            _logger = logger;
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
            _logger.LogDebug("All crew members listed. Count: {Count}", crewDtoList.Count);
            return Ok(crewDtoList);
        }

        // GET: api/crew/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CrewDTO>> GetCrewMemberById(int id)
        {
            var crewMember = await _context.CrewMembers.FindAsync(id);
            if (crewMember == null)
            {
                _logger.LogWarning("Crew member not found: {Id}", id);
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
            _logger.LogInformation("Crew member fetched: {Id} {FirstName} {LastName}", crewDto.Id, crewDto.FirstName, crewDto.LastName);
            return Ok(crewDto);
        }

        // POST: api/crew
        [HttpPost]
        public async Task<IActionResult> CreateCrewMember(CreateCrewDTO crewMemberDto)
        {
            var validRoles = new[] { "pilot", "copilot", "flightattendant" };
            if (!validRoles.Contains(crewMemberDto.Role.ToLowerInvariant()))
            {
                _logger.LogWarning("Invalid crew member role: {Role}", crewMemberDto.Role);
                return BadRequest("Invalid crew member role. Allowed roles: pilot, copilot, flightattendant.");
            }
            var crewMember = new Entities.Crew
            {
                FirstName = crewMemberDto.FirstName,
                LastName = crewMemberDto.LastName,
                Role = crewMemberDto.Role.ToLowerInvariant(),
                LicenseNumber = crewMemberDto.LicenseNumber
            };
            _context.CrewMembers.Add(crewMember);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Crew member created: {FirstName} {LastName} ({Role})", crewMember.FirstName, crewMember.LastName, crewMember.Role);
            return CreatedAtAction(nameof(GetCrewMemberById), new { id = crewMember.Id }, crewMember);
        }

        // PUT: api/crew/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCrewMember(int id, CreateCrewDTO crewMemberDto)
        {
            var validRoles = new[] { "pilot", "copilot", "flightattendant" };
            if (!validRoles.Contains(crewMemberDto.Role.ToLower()))
            {
                _logger.LogWarning("Invalid crew member role for update: {Role}", crewMemberDto.Role);
                return BadRequest("Invalid crew member role. Allowed roles: pilot, copilot, flightattendant.");
            }
            var crewMember = await _context.CrewMembers.FindAsync(id);
            if (crewMember == null)
            {
                _logger.LogError("Crew member not found for update: {Id}", id);
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
                _logger.LogInformation("Crew member updated: {Id} {FirstName} {LastName}", crewMember.Id, crewMember.FirstName, crewMember.LastName);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CrewMemberExists(id))
                {
                    _logger.LogError("Crew member not found after concurrency exception: {Id}", id);
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
                _logger.LogError("Crew member not found for delete: {Id}", id);
                return NotFound();
            }
            _context.CrewMembers.Remove(crewMember);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Crew member deleted: {Id} {FirstName} {LastName}", crewMember.Id, crewMember.FirstName, crewMember.LastName);
            return NoContent();
        }
    }
}