using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightManagement.DTO
{
    public class FlightDTO
    {
        public int Id { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int AircraftId { get; set; }
        public AircraftDTO Aircraft { get; set; } = new();

        public int DepartureAirportId { get; set; }
        public AirportDTO DepartureAirport { get; set; } = new();

        public int ArrivalAirportId { get; set; }
        public AirportDTO ArrivalAirport { get; set; } = new();

        public List<CrewDTO> CrewMembers { get; set; } = new();

    }


}