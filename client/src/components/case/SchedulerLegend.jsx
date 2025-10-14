// src/components/case/SchedulerLegend.jsx
import React from "react";
import { getStatusColor } from "../../utils/flightUtils";

const SchedulerLegend = () => {
  const statuses = [
    { key: "Planned", label: "Planned" },
    { key: "Departed", label: "Departed" },
    { key: "Arrived", label: "Arrived" },
    { key: "Delayed", label: "Delayed" },
    { key: "Cancelled", label: "Cancelled" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Flight Status Legend
      </h3>
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <div key={status.key} className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded ${getStatusColor(status.key)}`}
            ></div>
            <span className="text-xs text-gray-600">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulerLegend;
