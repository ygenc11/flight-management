namespace FlightManagement.DTO
{
    public class CreateAircraftDTO
    {

        public string Model { get; set; } = string.Empty;
        public string TailNumber { get; set; } = string.Empty;
        public int SeatsCapacity { get; set; }
        public bool IsActive { get; set; } = true;

    }
}