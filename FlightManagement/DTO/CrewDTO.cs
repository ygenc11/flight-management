using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FlightManagement.Entities;


namespace FlightManagement.DTO
{
    public class CrewDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // e.g., Pilot, Co-Pilot, Flight Attendant
        public string LicenseNumber { get; set; } = string.Empty; // Applicable for pilots
        public bool IsActive { get; set; } = true;

    }
}