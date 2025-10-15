// src/components/case/CrewRow.jsx
import React from "react";
import FlightBlock from "./FlightBlock";
import { CurrentTimeLine } from "./CurrentTimeLine";
import { Users, Power, PowerOff } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const CrewRow = ({
  crew,
  flights,
  section = "captain",
  selectedDate,
  onToggleAvailability,
}) => {
  // Bu mürettebata ait uçuşları filtrele
  const crewFlights = flights.filter(
    (f) =>
      f.captain === crew.id ||
      f.firstOfficer === crew.id ||
      (f.cabinCrew && f.cabinCrew.includes(crew.id))
  );

  const pixelsPerHour = 60;

  const calculatePosition = (time) => {
    const flightTime = dayjs.utc(time);
    const startOfDay = selectedDate.startOf("day");
    const hoursSinceStart = flightTime.diff(startOfDay, "hour", true);
    // If flight starts before the day, show from 0
    return Math.max(0, hoursSinceStart * pixelsPerHour);
  };

  const calculateWidth = (start, end) => {
    const startOfDay = selectedDate.startOf("day");
    const endOfDay = selectedDate.endOf("day");
    const departureTime = dayjs.utc(start);
    const arrivalTime = dayjs.utc(end);

    // Adjust start and end times to fit within the selected day
    const effectiveStart = departureTime.isBefore(startOfDay)
      ? startOfDay
      : departureTime;
    const effectiveEnd = arrivalTime.isAfter(endOfDay) ? endOfDay : arrivalTime;

    const duration = effectiveEnd.diff(effectiveStart, "hour", true);
    return Math.max(0, duration * pixelsPerHour);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      Captain: "bg-purple-100 text-purple-800",
      "First Officer": "bg-blue-100 text-blue-800",
      "Flight Attendant": "bg-pink-100 text-pink-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors relative">
      {/* Crew Info */}
      <div
        className={`w-48 flex-shrink-0 sticky left-0 border-r border-gray-300 px-4 py-4 flex items-center justify-between z-50 ${
          !crew.isActive ? "bg-gray-100 opacity-75" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <Users
            className={`w-5 h-5 ${
              crew.isActive ? "text-green-600" : "text-gray-400"
            }`}
          />
          <div>
            <div
              className={`font-semibold text-sm ${
                crew.isActive ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {crew.name}
            </div>
            <div className="text-xs text-gray-500">{crew.role}</div>
          </div>
        </div>
        <button
          onClick={() =>
            onToggleAvailability &&
            onToggleAvailability(crew.id, !crew.isActive)
          }
          className={`ml-2 p-1 rounded hover:bg-gray-200 transition-colors ${
            crew.isActive ? "text-green-600" : "text-red-600"
          }`}
          title={crew.isActive ? "Mark as off duty" : "Mark as on duty"}
        >
          {crew.isActive ? (
            <Power className="w-4 h-4" />
          ) : (
            <PowerOff className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Timeline */}
      <div className="relative flex-1" style={{ height: "80px" }}>
        {/* Saat çizgileri */}
        {Array.from({ length: 24 }, (_, i) => {
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-r border-gray-100"
              style={{
                left: `${i * pixelsPerHour}px`,
                width: `${pixelsPerHour}px`,
                zIndex: 1,
              }}
            />
          );
        })}

        {/* Current Time Line */}
        <CurrentTimeLine selectedDate={selectedDate} />

        {/* Uçuşlar */}
        {crewFlights.map((flight) => {
          const left = calculatePosition(flight.departure.time);
          const width = calculateWidth(
            flight.departure.time,
            flight.arrival.time
          );

          // Crew'un rolünü belirle
          let crewRole = "";
          if (flight.captain === crew.id) crewRole = "Captain";
          else if (flight.firstOfficer === crew.id) crewRole = "First Officer";
          else if (flight.cabinCrew?.includes(crew.id)) crewRole = "FA";

          return (
            <FlightBlock
              key={flight.id}
              flight={flight}
              crewRole={crewRole}
              style={{
                left: `${left}px`,
                width: `${width}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CrewRow;
