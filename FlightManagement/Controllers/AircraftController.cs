using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.DTO;
using FlightManagement.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace FlightManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AircraftController : ControllerBase
    {
        private readonly ILogger<AircraftController> _logger;
        private readonly IAircraftService _aircraftService;

        public AircraftController(
            ILogger<AircraftController> logger,
            IAircraftService aircraftService)
        {
            _logger = logger;
            _aircraftService = aircraftService;
        }

        // GET: api/aircraft
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AircraftDTO>>> GetAllAircraft()
        {
            var aircraftList = await _aircraftService.GetAllActiveAircraftAsync();

            var dtoList = aircraftList.Select(aircraft => new AircraftDTO
            {
                Id = aircraft.Id,
                Model = aircraft.Model,
                TailNumber = aircraft.TailNumber,
                SeatsCapacity = aircraft.SeatsCapacity
            }).ToList();

            return Ok(dtoList);
        }

        // GET: api/aircraft/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AircraftDTO>> GetAircraftById(int id)
        {
            var aircraft = await _aircraftService.GetAircraftByIdAsync(id);
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
            // Validate using service
            var (isValid, errorMessage) = await _aircraftService.ValidateAircraftCreationAsync(
                aircraftDto.TailNumber,
                aircraftDto.SeatsCapacity);

            if (!isValid)
            {
                _logger.LogWarning("Aircraft creation validation failed: {Error}", errorMessage);
                return BadRequest(errorMessage);
            }

            // Create using service
            var aircraft = await _aircraftService.CreateAircraftAsync(
                aircraftDto.Model,
                aircraftDto.TailNumber,
                aircraftDto.SeatsCapacity);

            var dto = new AircraftDTO
            {
                Id = aircraft.Id,
                Model = aircraft.Model,
                TailNumber = aircraft.TailNumber,
                SeatsCapacity = aircraft.SeatsCapacity
            };

            _logger.LogInformation("Aircraft created successfully: {Id} - {Model} ({TailNumber})", aircraft.Id, aircraft.Model, aircraft.TailNumber);
            return CreatedAtAction(nameof(GetAircraftById), new { id = aircraft.Id }, dto);
        }

        // PUT: api/aircraft/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAircraft(int id, CreateAircraftDTO aircraftDto)
        {
            // Validate using service
            var (isValid, errorMessage) = await _aircraftService.ValidateAircraftUpdateAsync(
                id,
                aircraftDto.TailNumber,
                aircraftDto.SeatsCapacity);

            if (!isValid)
            {
                _logger.LogWarning("Aircraft update validation failed for ID {Id}: {Error}", id, errorMessage);
                return BadRequest(errorMessage);
            }

            // Update using service
            var updated = await _aircraftService.UpdateAircraftAsync(
                id,
                aircraftDto.Model,
                aircraftDto.TailNumber,
                aircraftDto.SeatsCapacity);

            if (!updated)
            {
                _logger.LogError("Aircraft not found for update: {Id}", id);
                return NotFound();
            }

            _logger.LogInformation("Aircraft updated successfully: {Id} - {Model} ({TailNumber})", id, aircraftDto.Model, aircraftDto.TailNumber);
            return NoContent();
        }

        // DELETE: api/aircraft/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAircraft(int id)
        {
            // Check if aircraft can be deleted
            var (canDelete, errorMessage) = await _aircraftService.CanDeleteAircraftAsync(id);
            if (!canDelete)
            {
                _logger.LogWarning("Cannot delete aircraft: {Id} - {Error}", id, errorMessage);
                return BadRequest(errorMessage);
            }

            // Soft delete using service
            var deleted = await _aircraftService.SoftDeleteAircraftAsync(id);
            if (!deleted)
            {
                _logger.LogError("Aircraft not found for delete: {Id}", id);
                return NotFound();
            }

            return NoContent();
        }


    }
}