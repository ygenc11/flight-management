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
    public class AirportController : ControllerBase
    {
        private readonly IAirportService _airportService;
        private readonly ILogger<AirportController> _logger;

        public AirportController(IAirportService airportService, ILogger<AirportController> logger)
        {
            _airportService = airportService;
            _logger = logger;
        }

        // GET: api/airport
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AirportDTO>>> GetAllAirports()
        {
            var airportList = await _airportService.GetAllAirportsAsync();

            var dtoList = airportList.Select(airport => new AirportDTO
            {
                Id = airport.Id,
                Name = airport.Name,
                City = airport.City,
                Country = airport.Country,
                IataCode = airport.IataCode,
                IcaoCode = airport.IcaoCode,
                CountryCode = airport.CountryCode,
                Latitude = airport.Latitude,
                Longitude = airport.Longitude
            }).ToList();

            return Ok(dtoList);
        }

        // GET: api/airport/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AirportDTO>> GetAirportById(int id)
        {
            var airport = await _airportService.GetAirportByIdAsync(id);
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
                IcaoCode = airport.IcaoCode,
                Latitude = airport.Latitude,
                Longitude = airport.Longitude
            };
            _logger.LogInformation("Airport fetched: {Id} {Name}", dto.Id, dto.Name);
            return Ok(dto);
        }

        // POST: api/airport
        [HttpPost]
        public async Task<IActionResult> CreateAirport(CreateAirportDTO airportDto)
        {
            // Validate airport data using service
            var (isValid, errorMessage) = await _airportService.ValidateAirportCreationAsync(airportDto.IataCode);

            if (!isValid)
            {
                _logger.LogWarning("Airport creation validation failed: {Error}", errorMessage);
                return BadRequest(errorMessage);
            }

            // Create airport
            var airport = await _airportService.CreateAirportAsync(
                airportDto.Name,
                airportDto.City,
                airportDto.Country,
                airportDto.IataCode,
                airportDto.Latitude,
                airportDto.Longitude
            );

            // Map to DTO for response
            var dto = new AirportDTO
            {
                Id = airport.Id,
                Name = airport.Name,
                City = airport.City,
                Country = airport.Country,
                IataCode = airport.IataCode,
                IcaoCode = airport.IcaoCode,
                Latitude = airport.Latitude,
                Longitude = airport.Longitude
            };

            _logger.LogInformation("Airport created successfully: {Id} - {Name} ({IataCode})", airport.Id, airport.Name, airport.IataCode);

            return CreatedAtAction(nameof(GetAirportById), new { id = dto.Id }, dto);
        }

        // PUT: api/airport/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAirport(int id, CreateAirportDTO airportDto)
        {
            // Validate airport data using service
            var (isValid, errorMessage) = await _airportService.ValidateAirportUpdateAsync(id, airportDto.IataCode);

            if (!isValid)
            {
                _logger.LogWarning("Airport update validation failed: {Error}", errorMessage);
                return BadRequest(errorMessage);
            }

            // Update airport
            var success = await _airportService.UpdateAirportAsync(
                id,
                airportDto.Name,
                airportDto.City,
                airportDto.Country,
                airportDto.IataCode,
                airportDto.Latitude,
                airportDto.Longitude
            );

            if (!success)
            {
                _logger.LogError("Airport not found for update: {Id}", id);
                return NotFound();
            }

            _logger.LogInformation("Airport updated successfully: {Id} - {Name} ({IataCode})", id, airportDto.Name, airportDto.IataCode);

            return NoContent();
        }

        // DELETE: api/airport/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAirport(int id)
        {
            // Check if airport can be deleted
            var (canDelete, errorMessage) = await _airportService.CanDeleteAirportAsync(id);
            if (!canDelete)
            {
                _logger.LogWarning("Cannot delete airport {Id}: {Error}", id, errorMessage);
                return BadRequest(errorMessage);
            }

            // Delete airport
            var success = await _airportService.DeleteAirportAsync(id);
            if (!success)
            {
                _logger.LogError("Airport not found for delete: {Id}", id);
                return NotFound();
            }

            _logger.LogInformation("Airport deleted successfully: {Id}", id);

            return NoContent();
        }

    }
}