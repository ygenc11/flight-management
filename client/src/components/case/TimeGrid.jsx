// src/components/case/TimeGrid.jsx
import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const TimeGrid = ({ selectedDate }) => {
  // 24 saatlik dilimler oluştur (UTC)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex border-b border-gray-300 bg-white sticky top-0 z-20">
      {/* Sol boşluk (resource isimleri için) */}
      <div className="w-48 flex-shrink-0 sticky left-0 bg-white border-r border-gray-300 z-30" />

      {/* Saat başlıkları */}
      <div className="flex flex-1">
        {hours.map((hour) => (
          <div
            key={hour}
            className="border-r text-center py-3 font-medium text-sm border-gray-200 text-gray-700"
            style={{ minWidth: "60px", width: "60px" }}
          >
            {hour === 0 ? (
              <div>
                <div className="font-bold text-blue-600">
                  {selectedDate.format("DD MMM")}
                </div>
                <div>{String(hour).padStart(2, "0")}:00</div>
              </div>
            ) : (
              String(hour).padStart(2, "0") + ":00"
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeGrid;
