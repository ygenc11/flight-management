// src/data/mockFlights.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // UTC için
dayjs.extend(utc);

const today = dayjs.utc().startOf("day"); // Bugünün UTC başlangıcı

export const aircrafts = [
  { id: "AC1", name: "Aircraft 1" },
  { id: "AC2", name: "Aircraft 2" },
  { id: "AC3", name: "Aircraft 3" },
];

export const crews = [
  { id: "P1", name: "Pilot John", type: "pilot" },
  { id: "P2", name: "Pilot Alice", type: "pilot" },
  { id: "CP1", name: "Co-Pilot Bob", type: "copilot" },
  { id: "CP2", name: "Co-Pilot Eve", type: "copilot" },
];

export const flights = [
  {
    id: 1,
    title: "Flight 101",
    start: today.add(2, "hour").toDate(), // UTC 02:00
    end: today.add(5, "hour").toDate(), // UTC 05:00
    aircraftId: "AC1",
    pilotId: "P1",
    copilotId: "CP1",
  },
  {
    id: 2,
    title: "Flight 102",
    start: today.add(6, "hour").toDate(), // UTC 06:00
    end: today.add(9, "hour").toDate(), // UTC 09:00
    aircraftId: "AC2",
    pilotId: "P2",
    copilotId: "CP2",
  },
  {
    id: 3,
    title: "Flight 103",
    start: today.add(10, "hour").toDate(), // UTC 10:00
    end: today.add(12, "hour").toDate(), // UTC 12:00
    aircraftId: "AC1",
    pilotId: "P1",
    copilotId: "CP1",
  },
  // Daha fazla ekleyebilirsin
];
