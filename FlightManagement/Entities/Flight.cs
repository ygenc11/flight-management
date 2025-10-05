using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightManagement.Entities
{

    public class Flight
    {
        public int Id { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int AircraftId { get; set; }
        public Aircraft? Aircraft { get; set; }
        public int DepartureAirportId { get; set; }
        public Airport? DepartureAirport { get; set; }
        public int ArrivalAirportId { get; set; }
        public Airport? ArrivalAirport { get; set; }

        // Navigation property for the crew members

        public List<Crew> CrewMembers { get; set; } = new List<Crew>();
        public string Status { get; set; } = "Planned";
    }

}