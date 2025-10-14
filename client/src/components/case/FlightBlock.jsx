// src/components/case/FlightBlock.jsx
import React, { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getStatusColor } from "../../data/caseFlightData";

dayjs.extend(utc);

const FlightBlock = ({ flight, style, crewRole }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    vertical: "top", // 'top' or 'bottom'
    horizontal: "center", // 'left', 'center', or 'right'
  });
  const blockRef = React.useRef(null);

  const departureTime = dayjs.utc(flight.departure.time).format("HH:mm");
  const arrivalTime = dayjs.utc(flight.arrival.time).format("HH:mm");
  const duration = dayjs
    .utc(flight.arrival.time)
    .diff(dayjs.utc(flight.departure.time), "minute");
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  const handleMouseEnter = () => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const tooltipWidth = 280; // min-w-[280px]

      // Vertical position: top 200px = show below, otherwise above
      const vertical = rect.top < 200 ? "bottom" : "top";

      // Horizontal position
      let horizontal = "center";
      const blockCenterX = rect.left + rect.width / 2;
      const spaceOnLeft = blockCenterX - tooltipWidth / 2;
      const spaceOnRight = viewportWidth - (blockCenterX + tooltipWidth / 2);

      // If tooltip would overflow left edge, align to left
      if (spaceOnLeft < 50) {
        horizontal = "left";
      }
      // If tooltip would overflow right edge, align to right
      else if (spaceOnRight < 50) {
        horizontal = "right";
      }

      console.log("Tooltip positioning:", {
        flight: flight.flightNumber,
        vertical,
        horizontal,
        spaceOnLeft,
        spaceOnRight,
        rect: { left: rect.left, right: rect.right, top: rect.top },
      });

      setTooltipPosition({ vertical, horizontal });
    }
    setShowTooltip(true);
  };

  return (
    <div
      ref={blockRef}
      className="absolute top-2 bottom-2 rounded-lg shadow-md cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
      style={{
        ...style,
        zIndex: showTooltip ? 10000 : 20,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Flight Block */}
      <div
        className={`h-full rounded-lg ${getStatusColor(
          flight.status
        )} bg-opacity-90 backdrop-blur-sm border-2 border-white overflow-hidden`}
      >
        <div className="px-2 py-1 h-full flex flex-col justify-between text-white">
          <div>
            <div className="font-bold text-xs truncate">
              {flight.flightNumber}
            </div>
            <div className="text-xs truncate">
              {flight.departure.airport} → {flight.arrival.airport}
            </div>
          </div>
          <div className="text-xs font-semibold">
            {departureTime} - {arrivalTime}
            {crewRole && (
              <span className="ml-1 text-xs opacity-75">({crewRole})</span>
            )}
          </div>
        </div>
      </div>

      {/* Tooltip - Smart positioning */}
      {showTooltip && (
        <div
          className={`absolute pointer-events-none ${
            tooltipPosition.vertical === "bottom"
              ? "top-full mt-2"
              : "bottom-full mb-2"
          } ${
            tooltipPosition.horizontal === "left"
              ? "left-0"
              : tooltipPosition.horizontal === "right"
              ? "right-0"
              : "left-1/2 -translate-x-1/2"
          }`}
          style={{ zIndex: 9999 }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg shadow-2xl p-3 min-w-[280px] border border-gray-700">
            <div className="font-bold text-sm mb-2 border-b border-gray-700 pb-2">
              {flight.flightNumber}
              <span
                className={`ml-2 px-2 py-0.5 rounded text-xs ${getStatusColor(
                  flight.status
                )}`}
              >
                {flight.status}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Route:</span>
                <span className="font-semibold">
                  {flight.departure.airport} → {flight.arrival.airport}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Departure:</span>
                <span>
                  {dayjs.utc(flight.departure.time).format("HH:mm UTC")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Arrival:</span>
                <span>
                  {dayjs.utc(flight.arrival.time).format("HH:mm UTC")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span>
                  {hours}h {minutes}m
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Passengers:</span>
                <span>{flight.passengers}</span>
              </div>

              {crewRole && (
                <div className="flex justify-between border-t border-gray-700 pt-1.5 mt-1.5">
                  <span className="text-gray-400">Your Role:</span>
                  <span className="font-semibold text-blue-400">
                    {crewRole}
                  </span>
                </div>
              )}
            </div>

            {/* Arrow */}
            <div
              className={`absolute ${
                tooltipPosition.vertical === "bottom"
                  ? "bottom-full"
                  : "top-full"
              } ${
                tooltipPosition.horizontal === "left"
                  ? "left-4"
                  : tooltipPosition.horizontal === "right"
                  ? "right-4"
                  : "left-1/2 -translate-x-1/2"
              }`}
            >
              <div
                className={`border-8 border-transparent ${
                  tooltipPosition.vertical === "bottom"
                    ? "border-b-gray-900"
                    : "border-t-gray-900"
                }`}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightBlock;
