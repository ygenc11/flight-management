using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FlightManagement.Entities;

namespace FlightManagement.Data
{
    public class FlightManagementContext : DbContext
    {
        public FlightManagementContext(DbContextOptions<FlightManagementContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Flight> Flights { get; set; }
        public DbSet<Crew> CrewMembers { get; set; }
        public DbSet<Aircraft> Aircraft { get; set; }
        public DbSet<Airport> Airports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure many-to-many relationship between Flight and Crew
            modelBuilder.Entity<Flight>()
                .HasMany(f => f.CrewMembers)
                .WithMany(c => c.Flights)
                .UsingEntity(j => j.ToTable("FlightCrewMembers"));

            modelBuilder.Entity<Flight>()
                .HasOne(f => f.Aircraft)
                .WithMany()
                .HasForeignKey(f => f.AircraftId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Flight>()
                .HasOne(f => f.DepartureAirport)
                .WithMany()
                .HasForeignKey(f => f.DepartureAirportId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Flight>()
                .HasOne(f => f.ArrivalAirport)
                .WithMany()
                .HasForeignKey(f => f.ArrivalAirportId)
                .OnDelete(DeleteBehavior.Restrict);


            // Unique constraint on Airport IATA code
            modelBuilder.Entity<Airport>()
                .HasIndex(a => a.IataCode)
                .IsUnique();

            // Unique constraint on Airport ICAO code
            modelBuilder.Entity<Airport>()
                .HasIndex(a => a.IcaoCode)
                .IsUnique();

            // Unique constraint on Aircraft TailNumber
            modelBuilder.Entity<Aircraft>()
                .HasIndex(a => a.TailNumber)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}