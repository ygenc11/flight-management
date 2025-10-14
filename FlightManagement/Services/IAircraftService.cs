using FlightManagement.Entities;

namespace FlightManagement.Services
{
    public interface IAircraftService
    {

        Task<bool> IsTailNumberUniqueAsync(string tailNumber, int? excludeAircraftId = null);

        bool IsSeatsCapacityValid(int seatsCapacity);

        Task<(bool isValid, string errorMessage)> ValidateAircraftCreationAsync(string tailNumber, int seatsCapacity);

        Task<(bool isValid, string errorMessage)> ValidateAircraftUpdateAsync(int aircraftId, string tailNumber, int seatsCapacity);

        Task<IEnumerable<Aircraft>> GetAllAircraftAsync();
        Task<IEnumerable<Aircraft>> GetAllActiveAircraftAsync();
        Task<Aircraft?> GetAircraftByIdAsync(int id);
        Task<Aircraft> CreateAircraftAsync(string model, string tailNumber, int seatsCapacity);
        Task<bool> UpdateAircraftAsync(int id, string model, string tailNumber, int seatsCapacity, bool isActive = true);

        Task<bool> SoftDeleteAircraftAsync(int id);
        Task<(bool canDelete, string errorMessage)> CanDeleteAircraftAsync(int id);
    }
}