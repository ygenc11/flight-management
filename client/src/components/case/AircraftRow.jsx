// src/components/case/AircraftRow.jsx
import React from "react";
import FlightBlock from "./FlightBlock";
import { CurrentTimeLine } from "./CurrentTimeLine";
import { Plane, Power, PowerOff } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const AircraftRow = ({
  aircraft,
  flights,
  selectedDate,
  onFlightDrop,
  scrollContainerRef,
  onToggleAvailability,
}) => {
  // Bu uçağa ait uçuşları filtrele
  const aircraftFlights = flights.filter((f) => f.aircraftId === aircraft.id);

  // Saat başına piksel hesaplama (24 saat için)
  const pixelsPerHour = 60; // Her saat 60px

  // State for drag over effect
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [dropPreview, setDropPreview] = React.useState(null);

  // Drop zone handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);

    // Show preview of where it will drop
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const scrollLeft = scrollContainerRef?.current?.scrollLeft || 0;

    // CRITICAL: Mouse X relative to timeline element itself
    const mouseXInTimeline = e.clientX - rect.left;

    // CRITICAL: Add scroll offset to get true position
    const trueX = mouseXInTimeline + scrollLeft;

    // Convert pixels directly to minutes (60px = 60min = 1 hour)
    const totalMinutes = trueX;

    // Snap to 15-minute intervals
    const snappedMinutes = Math.round(totalMinutes / 15) * 15;

    // Clamp to day bounds
    const clampedMinutes = Math.max(0, Math.min(1435, snappedMinutes)); // 1435 = 23:55

    // Convert back to pixels for display
    const snappedX = clampedMinutes;

    setDropPreview({
      x: snappedX,
      time: selectedDate
        .startOf("day")
        .add(clampedMinutes, "minutes")
        .format("HH:mm"),
    });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setDropPreview(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const flightData = JSON.parse(e.dataTransfer.getData("application/json"));

    // Get the timeline element and its bounding box
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();

    // Get scroll position directly from the ref
    const scrollLeft = scrollContainerRef?.current?.scrollLeft || 0;

    // Mouse X in timeline + scroll = true position
    const mouseXInTimeline = e.clientX - rect.left;
    const trueX = mouseXInTimeline + scrollLeft;

    // Since 60px = 60min (1px = 1min), trueX IS the total minutes
    const totalMinutes = trueX;

    // Snap to 15-minute intervals
    const snappedMinutes = Math.round(totalMinutes / 15) * 15;

    // Clamp to valid range: 0 to (1440 - flight duration)
    const clampedMinutes = Math.max(
      0,
      Math.min(1440 - flightData.duration, snappedMinutes)
    );

    // Calculate new departure and arrival times
    const newDepartureTime = selectedDate
      .startOf("day")
      .add(clampedMinutes, "minutes");
    const newArrivalTime = newDepartureTime.add(flightData.duration, "minutes");

    // Call parent handler
    if (onFlightDrop) {
      onFlightDrop(
        flightData.flightId,
        aircraft.id,
        newDepartureTime.toISOString(),
        newArrivalTime.toISOString()
      );
    }

    // Reset drag over state
    setIsDragOver(false);
    setDropPreview(null);
  };

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
    <div
      className={`flex border-b border-gray-200 hover:bg-gray-50 transition-colors relative ${
        !aircraft.isActive ? "bg-gray-100 opacity-60" : ""
      }`}
    >
      {/* Aircraft Info */}
      <div className="w-48 flex-shrink-0 sticky left-0 bg-white border-r border-gray-300 px-4 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3 flex-1">
          <Plane
            className={`w-5 h-5 ${
              aircraft.isActive ? "text-blue-600" : "text-gray-400"
            }`}
          />
          <div>
            <div
              className={`font-semibold text-sm ${
                aircraft.isActive ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {aircraft.registration}
            </div>
            <div className="text-xs text-gray-500">{aircraft.type}</div>
          </div>
        </div>
        <button
          onClick={() =>
            onToggleAvailability &&
            onToggleAvailability(aircraft.id, !aircraft.isActive)
          }
          className={`ml-2 p-1 rounded hover:bg-gray-200 transition-colors ${
            aircraft.isActive ? "text-green-600" : "text-red-600"
          }`}
          title={
            aircraft.isActive ? "Mark as unavailable" : "Mark as available"
          }
        >
          {aircraft.isActive ? (
            <Power className="w-4 h-4" />
          ) : (
            <PowerOff className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Timeline */}
      <div
        className={`relative flex-1 transition-colors ${
          isDragOver ? "bg-blue-50" : ""
        }`}
        style={{ height: "80px", minWidth: "1440px" }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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

        {/* Drop Preview Indicator */}
        {dropPreview && (
          <div
            className="absolute top-0 bottom-0 border-l-2 border-green-500 pointer-events-none"
            style={{ left: `${dropPreview.x}px`, zIndex: 90 }}
          >
            <div className="absolute -top-6 left-0 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {dropPreview.time}
            </div>
          </div>
        )}

        {/* Current Time Line */}
        <CurrentTimeLine selectedDate={selectedDate} />

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
