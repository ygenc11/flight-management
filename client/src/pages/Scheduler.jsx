// src/pages/Scheduler.jsx
import React from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Default stil, override edeceğiz
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC"); // Tüm tarihler UTC

import { aircrafts, crews, flights } from "../data/mockFlights";

const localizer = dayjsLocalizer(dayjs);

// Flight'ları resource'a göre map'le (RBC için event'ler)
const aircraftEvents = flights.map((flight) => ({
  ...flight,
  resourceId: flight.aircraftId,
}));

const crewEvents = flights.flatMap((flight) => [
  { ...flight, resourceId: flight.pilotId, title: `${flight.title} (Pilot)` },
  {
    ...flight,
    resourceId: flight.copilotId,
    title: `${flight.title} (Co-Pilot)`,
  },
]);

const Scheduler = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Daily Flight Scheduler (UTC)</h1>

      {/* Aircraft Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Aircraft Schedule</h2>
        <Calendar
          localizer={localizer}
          events={aircraftEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="day"
          views={["day"]}
          step={30} // 30 dk aralıklar
          timeslots={2} // Slot başına 2 timeslot (15 dk hassasiyet)
          min={dayjs.utc().startOf("day").toDate()} // 00:00 UTC
          max={dayjs.utc().endOf("day").toDate()} // 23:59 UTC
          resources={aircrafts.map((ac) => ({
            resourceId: ac.id,
            resourceTitle: ac.name,
          }))}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          className="bg-white rounded-lg shadow-md"
          style={{ height: 400 }} // Yükseklik ayarla
        />
      </section>

      {/* Crew Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Crew Schedule</h2>
        <Calendar
          localizer={localizer}
          events={crewEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="day"
          views={["day"]}
          step={30}
          timeslots={2}
          min={dayjs.utc().startOf("day").toDate()}
          max={dayjs.utc().endOf("day").toDate()}
          resources={crews.map((crew) => ({
            resourceId: crew.id,
            resourceTitle: `${crew.name} (${crew.type})`,
          }))}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          className="bg-white rounded-lg shadow-md"
          style={{ height: 400 }}
        />
      </section>
    </div>
  );
};

export default Scheduler;
