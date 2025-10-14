using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FlightManagement.DTO;
using FlightManagement.Services;
using Microsoft.Extensions.Logging;

namespace FlightManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CrewController : ControllerBase
    {
        private readonly ICrewService _crewService;
        private readonly ILogger<CrewController> _logger;

        public CrewController(ICrewService crewService, ILogger<CrewController> logger)
        {
            _crewService = crewService;
            _logger = logger;
        }

        // GET: api/crew
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CrewDTO>>> GetAllCrewMembers()
        {
            var crewList = await _crewService.GetAllCrewMembersAsync();

            var crewDtoList = crewList.Select(crew => new CrewDTO
            {
                Id = crew.Id,
                FirstName = crew.FirstName,
                LastName = crew.LastName,
                Role = crew.Role,
                LicenseNumber = crew.LicenseNumber
            }).ToList();

            return Ok(crewDtoList);
        }

        // GET: api/crew/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CrewDTO>> GetCrewMemberById(int id)
        {
            var crewMember = await _crewService.GetCrewMemberByIdAsync(id);
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
            // Validate crew data using service
            var (isValid, errorMessage) = await _crewService.ValidateCrewCreationAsync(
                crewMemberDto.Role,
                crewMemberDto.LicenseNumber
            );

            if (!isValid)
            {
                _logger.LogWarning("Crew creation validation failed: {Error}", errorMessage);
                return BadRequest(errorMessage);
            }

            // Create crew member
            var crewMember = await _crewService.CreateCrewMemberAsync(
                crewMemberDto.FirstName,
                crewMemberDto.LastName,
                crewMemberDto.Role,
                crewMemberDto.LicenseNumber
            );

            // Map to DTO for response
            var crewDto = new CrewDTO
            {
                Id = crewMember.Id,
                FirstName = crewMember.FirstName,
                LastName = crewMember.LastName,
                Role = crewMember.Role,
                LicenseNumber = crewMember.LicenseNumber
            };

            _logger.LogInformation("Crew member created successfully: {Id} - {FirstName} {LastName} ({Role})", crewMember.Id, crewMember.FirstName, crewMember.LastName, crewMember.Role);

            return CreatedAtAction(nameof(GetCrewMemberById), new { id = crewDto.Id }, crewDto);
        }

        // PUT: api/crew/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCrewMember(int id, CreateCrewDTO crewMemberDto)
        {
            // Validate crew data using service
            var (isValid, errorMessage) = await _crewService.ValidateCrewUpdateAsync(
                id,
                crewMemberDto.Role,
                crewMemberDto.LicenseNumber
            );

            if (!isValid)
            {
                _logger.LogWarning("Crew update validation failed: {Error}", errorMessage);
                return BadRequest(errorMessage);
            }

            // Update crew member
            var success = await _crewService.UpdateCrewMemberAsync(
                id,
                crewMemberDto.FirstName,
                crewMemberDto.LastName,
                crewMemberDto.Role,
                crewMemberDto.LicenseNumber
            );

            if (!success)
            {
                _logger.LogError("Crew member not found for update: {Id}", id);
                return NotFound();
            }

            _logger.LogInformation("Crew member updated successfully: {Id} - {FirstName} {LastName} ({Role})", id, crewMemberDto.FirstName, crewMemberDto.LastName, crewMemberDto.Role);

            return NoContent();
        }

        // DELETE: api/crew/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCrewMember(int id)
        {
            // Check if crew member can be deleted
            var (canDelete, errorMessage) = await _crewService.CanDeleteCrewMemberAsync(id);
            if (!canDelete)
            {
                _logger.LogWarning("Cannot delete crew member {Id}: {Error}", id, errorMessage);
                return BadRequest(errorMessage);
            }

            // Delete crew member
            var success = await _crewService.SoftDeleteCrewMemberAsync(id);
            if (!success)
            {
                _logger.LogError("Crew member not found for delete: {Id}", id);
                return NotFound();
            }

            _logger.LogInformation("Crew member deleted successfully: {Id}", id);

            return NoContent();
        }
    }
}