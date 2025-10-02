using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightManagement.DTO
{
    public class CreateAirportDTO
    {
        public string Name { get; set; } = string.Empty;
        public string IataCode { get; set; } = string.Empty;

        public string IcaoCode { get; set; } = string.Empty; //ICA code 4-letter code
        public string CountryCode { get; set; } = string.Empty; // ISO country code can be null
        public string City { get; set; } = string.Empty; // City where the airport is located
        public string Country { get; set; } = string.Empty; // Country where the airport is located

    }
}