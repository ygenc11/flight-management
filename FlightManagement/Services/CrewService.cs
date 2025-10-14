using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.Entities;
using FlightManagement.Repositories;
using Microsoft.Extensions.Logging;

namespace FlightManagement.Services
{
    /// <summary>
    /// Service implementation for Crew business logic
    /// </summary>
    public class CrewService : ICrewService
    {
        private readonly ICrewRepository _crewRepository;
        private readonly ILogger<CrewService> _logger;
        private readonly string[] _validRoles = { "pilot", "copilot", "flightattendant" };

        public CrewService(ICrewRepository crewRepository, ILogger<CrewService> logger)
        {
            _crewRepository = crewRepository;
            _logger = logger;
        }

        // ============= CRUD Operations =============

        /// <summary>
        /// Gets all crew members
        /// </summary>
        public async Task<IEnumerable<Crew>> GetAllCrewMembersAsync()
        {
            _logger.LogDebug("Fetching all crew members");
            return await _crewRepository.GetAllAsync();
        }

        /// <summary>
        /// Gets crew member by ID
        /// </summary>
        public async Task<Crew?> GetCrewMemberByIdAsync(int id)
        {
            _logger.LogDebug("Fetching crew member by ID: {CrewId}", id);
            return await _crewRepository.GetByIdAsync(id);
        }

        /// <summary>
        /// Creates a new crew member
        /// </summary>
        public async Task<Crew> CreateCrewMemberAsync(string firstName, string lastName, string role, string licenseNumber)
        {
            var crew = new Crew
            {
                FirstName = firstName,
                LastName = lastName,
                Role = role.ToLowerInvariant(), // Normalize role to lowercase
                LicenseNumber = licenseNumber
            };

            await _crewRepository.AddAsync(crew);

            _logger.LogInformation("Crew member created: {Id} {FirstName} {LastName} ({Role})",
                crew.Id, crew.FirstName, crew.LastName, crew.Role);

            return crew;
        }

        /// <summary>
        /// Updates an existing crew member
        /// </summary>
        public async Task<bool> UpdateCrewMemberAsync(int id, string firstName, string lastName, string role, string licenseNumber, bool isActive = true)
        {
            var crew = await _crewRepository.GetByIdAsync(id);
            if (crew == null)
            {
                _logger.LogWarning("Crew member not found for update: {CrewId}", id);
                return false;
            }

            crew.FirstName = firstName;
            crew.LastName = lastName;
            crew.Role = role.ToLowerInvariant();
            crew.LicenseNumber = licenseNumber;
            crew.IsActive = isActive;

            await _crewRepository.UpdateAsync(crew);

            _logger.LogInformation("Crew member updated: {Id} {FirstName} {LastName} ({Role}) - Active: {IsActive}",
                crew.Id, crew.FirstName, crew.LastName, crew.Role, crew.IsActive);

            return true;
        }

        /// <summary>
        /// Soft deletes a crew member (not implemented - would need IsActive field in Crew entity)
        /// For now, performs hard delete
        /// </summary>
        public async Task<bool> SoftDeleteCrewMemberAsync(int id)
        {
            var crew = await _crewRepository.GetByIdAsync(id);
            if (crew == null)
            {
                _logger.LogWarning("Crew member not found for delete: {CrewId}", id);
                return false;
            }

            // TODO: If you add IsActive field to Crew entity, implement soft delete
            // crew.IsActive = false;
            // await _crewRepository.UpdateAsync(crew);

            // For now, hard delete
            await _crewRepository.DeleteAsync(crew);

            _logger.LogInformation("Crew member deleted: {Id} {FirstName} {LastName}",
                crew.Id, crew.FirstName, crew.LastName);

            return true;
        }

        // ============= Validation Methods =============

        /// <summary>
        /// Validates if the role is valid (pilot, copilot, flightattendant)
        /// </summary>
        public bool IsValidRole(string role)
        {
            if (string.IsNullOrWhiteSpace(role))
                return false;

            return _validRoles.Contains(role.ToLowerInvariant());
        }

        /// <summary>
        /// Validates crew data for creation
        /// </summary>
        public async Task<(bool isValid, string errorMessage)> ValidateCrewCreationAsync(string role, string licenseNumber)
        {
            // 1. Role must be valid
            if (!IsValidRole(role))
            {
                _logger.LogWarning("Crew creation validation failed: Invalid role {Role}", role);
                return (false, $"Invalid crew member role. Allowed roles: {string.Join(", ", _validRoles)}");
            }

            // 2. License number cannot be empty
            if (string.IsNullOrWhiteSpace(licenseNumber))
            {
                _logger.LogWarning("Crew creation validation failed: License number is empty");
                return (false, "License number is required.");
            }

            // 3. License number must be unique
            var isLicenseUnique = await _crewRepository.IsLicenseNumberUniqueAsync(licenseNumber);
            if (!isLicenseUnique)
            {
                _logger.LogWarning("Crew creation validation failed: License number {LicenseNumber} already exists", licenseNumber);
                return (false, $"A crew member with license number '{licenseNumber}' already exists.");
            }

            _logger.LogInformation("Crew creation validation passed for license {LicenseNumber}", licenseNumber);
            return (true, string.Empty);
        }

        /// <summary>
        /// Validates crew data for update
        /// </summary>
        public async Task<(bool isValid, string errorMessage)> ValidateCrewUpdateAsync(int crewId, string role, string licenseNumber)
        {
            // 1. Role must be valid
            if (!IsValidRole(role))
            {
                _logger.LogWarning("Crew update validation failed: Invalid role {Role} for crew {CrewId}", role, crewId);
                return (false, $"Invalid crew member role. Allowed roles: {string.Join(", ", _validRoles)}");
            }

            // 2. License number cannot be empty
            if (string.IsNullOrWhiteSpace(licenseNumber))
            {
                _logger.LogWarning("Crew update validation failed: License number is empty for crew {CrewId}", crewId);
                return (false, "License number is required.");
            }

            // 3. License number must be unique (excluding current crew member)
            var isLicenseUnique = await _crewRepository.IsLicenseNumberUniqueAsync(licenseNumber, crewId);
            if (!isLicenseUnique)
            {
                _logger.LogWarning("Crew update validation failed: License number {LicenseNumber} already exists for crew {CrewId}",
                    licenseNumber, crewId);
                return (false, $"A crew member with license number '{licenseNumber}' already exists.");
            }

            _logger.LogInformation("Crew update validation passed for crew {CrewId}", crewId);
            return (true, string.Empty);
        }

        /// <summary>
        /// Checks if a crew member can be deleted (not assigned to any flights)
        /// </summary>
        public async Task<(bool canDelete, string errorMessage)> CanDeleteCrewMemberAsync(int id)
        {
            // Check if crew member is assigned to any flights
            var flights = await _crewRepository.GetCrewFlightsAsync(id);

            if (flights.Any())
            {
                _logger.LogWarning("Cannot delete crew member {CrewId}: Assigned to {FlightCount} flights",
                    id, flights.Count());
                return (false, "Cannot delete crew member that is assigned to flights. Consider deactivating instead.");
            }

            return (true, string.Empty);
        }
    }
}
