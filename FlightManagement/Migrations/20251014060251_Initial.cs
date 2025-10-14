using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlightManagement.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Aircraft",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TailNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SeatsCapacity = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aircraft", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Airports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IataCode = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    IcaoCode = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: true),
                    CountryCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Airports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CrewMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LicenseNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrewMembers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Flights",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlightNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DepartureTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ArrivalTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AircraftId = table.Column<int>(type: "int", nullable: false),
                    DepartureAirportId = table.Column<int>(type: "int", nullable: false),
                    ArrivalAirportId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flights", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Flights_Aircraft_AircraftId",
                        column: x => x.AircraftId,
                        principalTable: "Aircraft",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Flights_Airports_ArrivalAirportId",
                        column: x => x.ArrivalAirportId,
                        principalTable: "Airports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Flights_Airports_DepartureAirportId",
                        column: x => x.DepartureAirportId,
                        principalTable: "Airports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FlightCrewMembers",
                columns: table => new
                {
                    CrewMembersId = table.Column<int>(type: "int", nullable: false),
                    FlightsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlightCrewMembers", x => new { x.CrewMembersId, x.FlightsId });
                    table.ForeignKey(
                        name: "FK_FlightCrewMembers_CrewMembers_CrewMembersId",
                        column: x => x.CrewMembersId,
                        principalTable: "CrewMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FlightCrewMembers_Flights_FlightsId",
                        column: x => x.FlightsId,
                        principalTable: "Flights",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Aircraft_TailNumber",
                table: "Aircraft",
                column: "TailNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Airports_IataCode",
                table: "Airports",
                column: "IataCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FlightCrewMembers_FlightsId",
                table: "FlightCrewMembers",
                column: "FlightsId");

            migrationBuilder.CreateIndex(
                name: "IX_Flights_AircraftId",
                table: "Flights",
                column: "AircraftId");

            migrationBuilder.CreateIndex(
                name: "IX_Flights_ArrivalAirportId",
                table: "Flights",
                column: "ArrivalAirportId");

            migrationBuilder.CreateIndex(
                name: "IX_Flights_DepartureAirportId",
                table: "Flights",
                column: "DepartureAirportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FlightCrewMembers");

            migrationBuilder.DropTable(
                name: "CrewMembers");

            migrationBuilder.DropTable(
                name: "Flights");

            migrationBuilder.DropTable(
                name: "Aircraft");

            migrationBuilder.DropTable(
                name: "Airports");
        }
    }
}
