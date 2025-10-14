// src/components/case/CurrentTimeLine.jsx
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// Red time indicator line for all sections
export const CurrentTimeLine = () => {
  const [currentTime, setCurrentTime] = useState(dayjs.utc());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs.utc());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const pixelsPerHour = 60;
  const hoursSinceMidnight = currentTime.hour() + currentTime.minute() / 60;
  const leftPosition = hoursSinceMidnight * pixelsPerHour;

  return (
    <div
      className="absolute top-0 bottom-0 z-20 pointer-events-none"
      style={{ left: `${leftPosition}px` }}
    >
      {/* Main red line with glow */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-400 to-red-600 shadow-lg shadow-red-500/50" />

      {/* Diamond marker at top */}
      <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 border-2 border-red-300 rotate-45 shadow-lg" />

      {/* Diamond marker at bottom */}
      <div className="absolute -bottom-1 -left-1.5 w-3 h-3 bg-red-500 border-2 border-red-300 rotate-45 shadow-lg" />
    </div>
  );
};

// Time Badge Component - Sticky header için ayrı component
export const CurrentTimeLabel = () => {
  const [currentTime, setCurrentTime] = useState(dayjs.utc());
  const pixelsPerHour = 60;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs.utc());
    }, 1000); // Her saniye güncelle

    return () => clearInterval(interval);
  }, []);

  const calculatePosition = () => {
    const startOfDay = dayjs.utc().startOf("day");
    const hoursSinceStart = currentTime.diff(startOfDay, "hour", true);
    return hoursSinceStart * pixelsPerHour;
  };

  const position = calculatePosition();
  const timeString = currentTime.format("HH:mm:ss");

  return (
    <div
      className="absolute top-0 z-40 pointer-events-none"
      style={{ left: `${position}px` }}
    >
      <div className="relative">
        {/* Time Badge */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full -mt-2 pointer-events-auto">
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap flex items-center gap-1.5 border border-red-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            {timeString} UTC
          </div>
          {/* Badge arrow */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-red-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeLine;
