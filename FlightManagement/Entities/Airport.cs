using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FlightManagement.Entities
{
    public class Airport
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty; // Full name of the airport
        [Required]
        [MinLength(3)]
        [MaxLength(3)]
        public string IataCode { get; set; } = string.Empty; // 3-letter code
        [MinLength(4)]
        [MaxLength(4)]
        public string? IcaoCode { get; set; } //ICA code 4-letter code (optional)
        public string CountryCode { get; set; } = string.Empty; // ISO country code can be null
        public string City { get; set; } = string.Empty; // City where the airport is located
        public string Country { get; set; } = string.Empty; // Country where the airport is located
        public double Latitude { get; set; } // Airport latitude coordinate
        public double Longitude { get; set; } // Airport longitude coordinate


    }
}