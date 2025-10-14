using FlightManagement.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FlightManagement.Services
{
    /// <summary>
    /// Service interface for Crew business logic
    /// </summary>
    public interface ICrewService
    {
        // ============= CRUD Operations =============

        /// <summary>
        /// Gets all crew members
        /// </summary>
        Task<IEnumerable<Crew>> GetAllCrewMembersAsync();

        /// <summary>
        /// Gets crew member by ID
        /// </summary>
        Task<Crew?> GetCrewMemberByIdAsync(int id);

        /// <summary>
        /// Creates a new crew member
        /// </summary>
        Task<Crew> CreateCrewMemberAsync(string firstName, string lastName, string role, string licenseNumber);

        /// <summary>
        /// Updates an existing crew member
        /// </summary>
        Task<bool> UpdateCrewMemberAsync(int id, string firstName, string lastName, string role, string licenseNumber, bool isActive = true);

        /// <summary>
        /// Soft deletes a crew member
        /// </summary>
        Task<bool> SoftDeleteCrewMemberAsync(int id);

        // ============= Validation Methods =============

        /// <summary>
        /// Validates if the role is valid (pilot, copilot, flightattendant)
        /// </summary>
        bool IsValidRole(string role);

        /// <summary>
        /// Validates crew data for creation
        /// </summary>
        Task<(bool isValid, string errorMessage)> ValidateCrewCreationAsync(string role, string licenseNumber);

        /// <summary>
        /// Validates crew data for update
        /// </summary>
        Task<(bool isValid, string errorMessage)> ValidateCrewUpdateAsync(int crewId, string role, string licenseNumber);

        /// <summary>
        /// Checks if a crew member can be deleted (not assigned to any flights)
        /// </summary>
        Task<(bool canDelete, string errorMessage)> CanDeleteCrewMemberAsync(int id);
    }
}
