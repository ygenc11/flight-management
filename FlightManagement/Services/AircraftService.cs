using FlightManagement.Entities;
using FlightManagement.Repositories;
using Microsoft.Extensions.Logging;

namespace FlightManagement.Services
{
    public class AircraftService : IAircraftService
    {
        private readonly IAircraftRepository _aircraftRepository;
        private readonly ILogger<AircraftService> _logger;

        public AircraftService(IAircraftRepository aircraftRepository, ILogger<AircraftService> logger)
        {
            _aircraftRepository = aircraftRepository;
            _logger = logger;
        }

        // Validates if the tail number is unique (not already in use)
        public async Task<bool> IsTailNumberUniqueAsync(string tailNumber, int? excludeAircraftId = null)
        {
            if (string.IsNullOrWhiteSpace(tailNumber))
            {
                return false;
            }

            return await _aircraftRepository.IsTailNumberUniqueAsync(tailNumber, excludeAircraftId);
        }

        // Validates if the seats capacity is valid (greater than 0)
        public bool IsSeatsCapacityValid(int seatsCapacity)
        {
            return seatsCapacity > 0;
        }

        // Validates aircraft data for creation
        public async Task<(bool isValid, string errorMessage)> ValidateAircraftCreationAsync(
            string tailNumber,
            int seatsCapacity)
        {
            // 1. Tail number cannot be empty
            if (string.IsNullOrWhiteSpace(tailNumber))
            {
                _logger.LogWarning("Aircraft creation validation failed: Tail number is empty");
                return (false, "Tail number is required.");
            }

            // 2. Seats capacity must be greater than 0
            if (!IsSeatsCapacityValid(seatsCapacity))
            {
                _logger.LogWarning("Aircraft creation validation failed: Invalid seats capacity {SeatsCapacity}", seatsCapacity);
                return (false, "Seats capacity must be greater than 0.");
            }

            // 3. Tail number must be unique
            var isTailNumberUnique = await IsTailNumberUniqueAsync(tailNumber);
            if (!isTailNumberUnique)
            {
                _logger.LogWarning("Aircraft creation validation failed: Tail number {TailNumber} already exists", tailNumber);
                return (false, $"An aircraft with tail number '{tailNumber}' already exists.");
            }

            _logger.LogInformation("Aircraft creation validation passed for tail number {TailNumber}", tailNumber);
            return (true, string.Empty);
        }

        // Validates aircraft data for update
        public async Task<(bool isValid, string errorMessage)> ValidateAircraftUpdateAsync(
            int aircraftId,
            string tailNumber,
            int seatsCapacity)
        {
            // 1. Tail number cannot be empty
            if (string.IsNullOrWhiteSpace(tailNumber))
            {
                _logger.LogWarning("Aircraft update validation failed: Tail number is empty for aircraft {AircraftId}", aircraftId);
                return (false, "Tail number is required.");
            }

            // 2. Seats capacity must be greater than 0
            if (!IsSeatsCapacityValid(seatsCapacity))
            {
                _logger.LogWarning("Aircraft update validation failed: Invalid seats capacity {SeatsCapacity} for aircraft {AircraftId}",
                    seatsCapacity, aircraftId);
                return (false, "Seats capacity must be greater than 0.");
            }

            // 3. Tail number must be unique (excluding current aircraft)
            var isTailNumberUnique = await IsTailNumberUniqueAsync(tailNumber, aircraftId);
            if (!isTailNumberUnique)
            {
                _logger.LogWarning("Aircraft update validation failed: Tail number {TailNumber} already exists for aircraft {AircraftId}",
                    tailNumber, aircraftId);
                return (false, $"An aircraft with tail number '{tailNumber}' already exists.");
            }

            _logger.LogInformation("Aircraft update validation passed for aircraft {AircraftId}", aircraftId);
            return (true, string.Empty);
        }

        // Gets all aircraft (including inactive)
        public async Task<IEnumerable<Aircraft>> GetAllAircraftAsync()
        {
            _logger.LogDebug("Fetching all aircraft");
            return await _aircraftRepository.GetAllAsync();
        }

        // Gets all active aircraft
        public async Task<IEnumerable<Aircraft>> GetAllActiveAircraftAsync()
        {
            _logger.LogDebug("Fetching all active aircraft");
            return await _aircraftRepository.GetActiveAircraftAsync();
        }

        // Gets aircraft by ID
        public async Task<Aircraft?> GetAircraftByIdAsync(int id)
        {
            _logger.LogDebug("Fetching aircraft by ID: {AircraftId}", id);
            return await _aircraftRepository.GetByIdAsync(id);
        }

        // Creates a new aircraft
        public async Task<Aircraft> CreateAircraftAsync(string model, string tailNumber, int seatsCapacity)
        {
            var aircraft = new Aircraft
            {
                Model = model,
                TailNumber = tailNumber,
                SeatsCapacity = seatsCapacity,
                IsActive = true // Default to active
            };

            await _aircraftRepository.AddAsync(aircraft);

            _logger.LogInformation("Aircraft created: {Id} {Model} {TailNumber}",
                aircraft.Id, aircraft.Model, aircraft.TailNumber);

            return aircraft;
        }

        // Updates an existing aircraft
        public async Task<bool> UpdateAircraftAsync(int id, string model, string tailNumber, int seatsCapacity, bool isActive = true)
        {
            var aircraft = await _aircraftRepository.GetByIdAsync(id);
            if (aircraft == null)
            {
                _logger.LogWarning("Aircraft not found for update: {AircraftId}", id);
                return false;
            }

            aircraft.Model = model;
            aircraft.TailNumber = tailNumber;
            aircraft.SeatsCapacity = seatsCapacity;
            aircraft.IsActive = isActive;

            await _aircraftRepository.UpdateAsync(aircraft);

            _logger.LogInformation("Aircraft updated: {Id} {Model} {TailNumber} - Active: {IsActive}",
                aircraft.Id, aircraft.Model, aircraft.TailNumber, aircraft.IsActive);

            return true;
        }

        // Soft deletes an aircraft (sets IsActive to false)
        public async Task<bool> SoftDeleteAircraftAsync(int id)
        {
            var aircraft = await _aircraftRepository.GetByIdAsync(id);
            if (aircraft == null)
            {
                _logger.LogWarning("Aircraft not found for soft delete: {AircraftId}", id);
                return false;
            }

            aircraft.IsActive = false;
            await _aircraftRepository.UpdateAsync(aircraft);

            _logger.LogInformation("Aircraft soft deleted: {Id} {Model} {TailNumber}",
                aircraft.Id, aircraft.Model, aircraft.TailNumber);

            return true;
        }

        // Checks if an aircraft can be deleted (not used in any flights)
        public async Task<(bool canDelete, string errorMessage)> CanDeleteAircraftAsync(int id)
        {
            // Check if aircraft is used in any flights
            var hasFlights = await _aircraftRepository.HasFlightsAsync(id);

            if (hasFlights)
            {
                _logger.LogWarning("Cannot delete aircraft {AircraftId}: Used in flights", id);
                return (false, "Cannot delete aircraft that is assigned to flights. Consider deactivating instead.");
            }

            return (true, string.Empty);
        }
    }
}
