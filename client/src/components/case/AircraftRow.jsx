// src/components/case/AircraftRow.jsx
import React from "react";
import FlightBlock from "./FlightBlock";
import { Plane } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const AircraftRow = ({ aircraft, flights, selectedDate }) => {
  // Bu uçağa ait uçuşları filtrele
  const aircraftFlights = flights.filter((f) => f.aircraftId === aircraft.id);

  // Saat başına piksel hesaplama (24 saat için)
  const pixelsPerHour = 60; // Her saat 60px

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

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Aircraft Info */}
      <div className="w-48 flex-shrink-0 sticky left-0 bg-white border-r border-gray-300 px-4 py-4 flex items-center gap-3 z-10">
        <Plane className="w-5 h-5 text-blue-600" />
        <div>
          <div className="font-semibold text-sm text-gray-900">
            {aircraft.registration}
          </div>
          <div className="text-xs text-gray-500">{aircraft.type}</div>
        </div>
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
              }}
            />
          );
        })}

        {/* Uçuşlar */}
        {aircraftFlights.map((flight) => {
          const left = calculatePosition(flight.departure.time);
          const width = calculateWidth(
            flight.departure.time,
            flight.arrival.time
          );

          return (
            <FlightBlock
              key={flight.id}
              flight={flight}
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

export default AircraftRow;
