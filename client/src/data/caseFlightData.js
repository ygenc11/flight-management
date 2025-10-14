// src/data/caseFlightData.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const today = dayjs.utc().startOf("day");

export const aircrafts = [
  {
    id: "AC001",
    registration: "TC-JRO",
    type: "Boeing 737-800",
    capacity: 189,
    status: "active",
  },
  {
    id: "AC002",
    registration: "TC-JRU",
    type: "Airbus A320",
    capacity: 180,
    status: "active",
  },
  {
    id: "AC003",
    registration: "TC-LGR",
    type: "Boeing 777-300ER",
    capacity: 349,
    status: "active",
  },
  {
    id: "AC004",
    registration: "TC-LKB",
    type: "Airbus A321neo",
    capacity: 220,
    status: "active",
  },
  {
    id: "AC005",
    registration: "TC-JYA",
    type: "Boeing 737-900ER",
    capacity: 215,
    status: "active",
  },
];

export const crews = [
  {
    id: "P001",
    name: "Ahmet Yılmaz",
    role: "Captain",
    license: "ATPL",
    experience: 12000,
  },
  {
    id: "P002",
    name: "Mehmet Demir",
    role: "Captain",
    license: "ATPL",
    experience: 8500,
  },
  {
    id: "P003",
    name: "Ayşe Kaya",
    role: "Captain",
    license: "ATPL",
    experience: 9200,
  },
  {
    id: "FO001",
    name: "Can Öztürk",
    role: "First Officer",
    license: "CPL",
    experience: 3200,
  },
  {
    id: "FO002",
    name: "Zeynep Şahin",
    role: "First Officer",
    license: "CPL",
    experience: 2800,
  },
  {
    id: "FO003",
    name: "Emre Arslan",
    role: "First Officer",
    license: "CPL",
    experience: 4100,
  },
  {
    id: "FO004",
    name: "Selin Çelik",
    role: "First Officer",
    license: "CPL",
    experience: 3600,
  },
  {
    id: "FA001",
    name: "Deniz Aydın",
    role: "Flight Attendant",
    license: "FA",
    experience: 2400,
  },
  {
    id: "FA002",
    name: "Esra Yıldız",
    role: "Flight Attendant",
    license: "FA",
    experience: 1800,
  },
];

export const flights = [
  {
    id: "TK001",
    flightNumber: "TK1984",
    departure: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(6).minute(30).toDate(),
    },
    arrival: {
      airport: "JFK",
      name: "New York JFK",
      time: today.hour(10).minute(45).toDate(),
    },
    aircraftId: "AC003",
    captain: "P001",
    firstOfficer: "FO001",
    cabinCrew: ["FA001", "FA002"],
    status: "scheduled",
    duration: 255, // minutes
    passengers: 287,
  },
  {
    id: "TK002",
    flightNumber: "TK1985",
    departure: {
      airport: "JFK",
      name: "New York JFK",
      time: today.hour(13).minute(0).toDate(),
    },
    arrival: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(22).minute(30).toDate(),
    },
    aircraftId: "AC003",
    captain: "P001",
    firstOfficer: "FO001",
    cabinCrew: ["FA001", "FA002"],
    status: "scheduled",
    duration: 570, // minutes
    passengers: 312,
  },
  {
    id: "TK003",
    flightNumber: "TK728",
    departure: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(8).minute(15).toDate(),
    },
    arrival: {
      airport: "LHR",
      name: "London Heathrow",
      time: today.hour(11).minute(30).toDate(),
    },
    aircraftId: "AC001",
    captain: "P002",
    firstOfficer: "FO002",
    cabinCrew: ["FA001"],
    status: "scheduled",
    duration: 195, // minutes
    passengers: 165,
  },
  {
    id: "TK004",
    flightNumber: "TK729",
    departure: {
      airport: "LHR",
      name: "London Heathrow",
      time: today.hour(14).minute(0).toDate(),
    },
    arrival: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(19).minute(45).toDate(),
    },
    aircraftId: "AC001",
    captain: "P002",
    firstOfficer: "FO002",
    cabinCrew: ["FA001"],
    status: "scheduled",
    duration: 225, // minutes
    passengers: 178,
  },
  {
    id: "TK005",
    flightNumber: "TK1816",
    departure: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(7).minute(45).toDate(),
    },
    arrival: {
      airport: "DXB",
      name: "Dubai International",
      time: today.hour(13).minute(15).toDate(),
    },
    aircraftId: "AC002",
    captain: "P003",
    firstOfficer: "FO003",
    cabinCrew: ["FA002"],
    status: "scheduled",
    duration: 210, // minutes
    passengers: 156,
  },
  {
    id: "TK006",
    flightNumber: "TK1817",
    departure: {
      airport: "DXB",
      name: "Dubai International",
      time: today.hour(16).minute(0).toDate(),
    },
    arrival: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(19).minute(30).toDate(),
    },
    aircraftId: "AC002",
    captain: "P003",
    firstOfficer: "FO003",
    cabinCrew: ["FA002"],
    status: "scheduled",
    duration: 210, // minutes
    passengers: 171,
  },
  {
    id: "TK007",
    flightNumber: "TK404",
    departure: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(9).minute(30).toDate(),
    },
    arrival: {
      airport: "FRA",
      name: "Frankfurt Airport",
      time: today.hour(12).minute(15).toDate(),
    },
    aircraftId: "AC004",
    captain: "P001",
    firstOfficer: "FO004",
    cabinCrew: ["FA001"],
    status: "scheduled",
    duration: 165, // minutes
    passengers: 198,
  },
  {
    id: "TK008",
    flightNumber: "TK405",
    departure: {
      airport: "FRA",
      name: "Frankfurt Airport",
      time: today.hour(15).minute(30).toDate(),
    },
    arrival: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(20).minute(0).toDate(),
    },
    aircraftId: "AC004",
    captain: "P001",
    firstOfficer: "FO004",
    cabinCrew: ["FA001"],
    status: "scheduled",
    duration: 150, // minutes
    passengers: 205,
  },
  {
    id: "TK009",
    flightNumber: "TK52",
    departure: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(10).minute(0).toDate(),
    },
    arrival: {
      airport: "AMS",
      name: "Amsterdam Schiphol",
      time: today.hour(13).minute(0).toDate(),
    },
    aircraftId: "AC005",
    captain: "P002",
    firstOfficer: "FO002",
    cabinCrew: ["FA002"],
    status: "scheduled",
    duration: 180, // minutes
    passengers: 189,
  },
  {
    id: "TK010",
    flightNumber: "TK53",
    departure: {
      airport: "AMS",
      name: "Amsterdam Schiphol",
      time: today.hour(16).minute(15).toDate(),
    },
    arrival: {
      airport: "IST",
      name: "Istanbul Airport",
      time: today.hour(21).minute(30).toDate(),
    },
    aircraftId: "AC005",
    captain: "P002",
    firstOfficer: "FO002",
    cabinCrew: ["FA002"],
    status: "scheduled",
    duration: 195, // minutes
    passengers: 201,
  },
];

// Helper function to get flight status color
export const getStatusColor = (status) => {
  const colors = {
    scheduled: "bg-blue-500",
    boarding: "bg-yellow-500",
    departed: "bg-green-500",
    arrived: "bg-gray-500",
    delayed: "bg-red-500",
    cancelled: "bg-red-700",
  };
  return colors[status] || "bg-gray-400";
};

// Helper function to format flight duration
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
