using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightManagement.Entities
{
    public class Crew
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // e.g., pilot, copilot
        public string LicenseNumber { get; set; } = string.Empty; // Applicable for pilots

        public bool IsActive { get; set; } = true;

        // Many-to-many relationship with Flight
        public ICollection<Flight> Flights { get; set; } = new List<Flight>();
    }
}