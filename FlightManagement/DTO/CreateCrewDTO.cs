using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightManagement.DTO
{
    public class CreateCrewDTO
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // e.g., Pilot, Co-Pilot, Flight Attendant
        public string LicenseNumber { get; set; } = string.Empty; // Applicable for pilots
    }
}