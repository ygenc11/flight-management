using System.Text.Json.Serialization;

namespace FlightManagement.DTO
{
    public class UpdateFlightStatusDTO
    {
        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("statusDescription")]
        public string? StatusDescription { get; set; }
    }
}
