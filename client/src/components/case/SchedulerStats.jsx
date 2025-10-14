// src/components/case/SchedulerStats.jsx
import React from "react";
import { Plane, Users, Clock, Calendar } from "lucide-react";

const SchedulerStats = ({ aircrafts, crews, flights }) => {
  const totalFlights = flights.length;
  const activeAircrafts = aircrafts.filter((a) => a.status === "active").length;
  const totalCrews = crews.length;

  // Toplam uçuş süresi hesapla
  const totalFlightMinutes = flights.reduce((sum, flight) => {
    const duration =
      new Date(flight.arrival.time) - new Date(flight.departure.time);
    return sum + duration / (1000 * 60);
  }, 0);
  const totalHours = Math.floor(totalFlightMinutes / 60);

  const stats = [
    {
      icon: Plane,
      label: "Active Aircraft",
      value: activeAircrafts,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Calendar,
      label: "Scheduled Flights",
      value: totalFlights,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Users,
      label: "Crew Members",
      value: totalCrews,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Clock,
      label: "Total Flight Hours",
      value: `${totalHours}h`,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
        >
          <div className={`p-3 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchedulerStats;
