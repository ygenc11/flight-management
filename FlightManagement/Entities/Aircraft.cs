using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FlightManagement.Entities
{
    public class Aircraft
    {
        public int Id { get; set; }
        [Required]
        public string Model { get; set; } = string.Empty;
        [Required]
        public string TailNumber { get; set; } = string.Empty;
        [Required]
        public int SeatsCapacity { get; set; }
    }
}