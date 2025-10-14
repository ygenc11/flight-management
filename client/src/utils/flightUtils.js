// src/utils/flightUtils.js
// Utility functions for flight-related operations

/**
 * Get Tailwind CSS color class based on flight status
 * @param {string} status - Flight status (Planned, Departed, Arrived, Delayed, Cancelled)
 * @returns {string} Tailwind CSS background color class
 */
export const getStatusColor = (status) => {
  const colors = {
    Planned: "bg-blue-500",
    Departed: "bg-purple-500",
    Arrived: "bg-green-500",
    Delayed: "bg-orange-500",
    Cancelled: "bg-red-500",
  };
  return colors[status] || "bg-gray-400";
};

/**
 * Format flight duration from minutes to hours and minutes
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "2h 30m")
 */
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
