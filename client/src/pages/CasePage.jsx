// src/pages/CasePage.jsx
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import TimeGrid from "../components/case/TimeGrid";
import AircraftRow from "../components/case/AircraftRow";
import CrewRow from "../components/case/CrewRow";
import { CurrentTimeLabel } from "../components/case/CurrentTimeLine";
import apiService from "../services/apiService";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Plane,
  Users as UsersIcon,
  RefreshCw,
} from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

const CasePage = () => {
  const [showAircraft, setShowAircraft] = useState(true);
  const [showCrew, setShowCrew] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs.utc());
  const [currentUTCTime, setCurrentUTCTime] = useState(dayjs.utc());
  const scrollContainerRef = useRef(null);

  // Backend data states
  const [aircrafts, setAircrafts] = useState([]);
  const [crews, setCrews] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDate = selectedDate;

  // Transform backend DTO to frontend format
  const transformFlightData = (flightDto) => {
    return {
      id: flightDto.id,
      flightNumber: flightDto.flightNumber,
      departure: {
        airport: flightDto.departureAirport?.iataCode || "",
        name: flightDto.departureAirport?.name || "",
        time: flightDto.departureTime,
      },
      arrival: {
        airport: flightDto.arrivalAirport?.iataCode || "",
        name: flightDto.arrivalAirport?.name || "",
        time: flightDto.arrivalTime,
      },
      aircraftId: flightDto.aircraftId,
      captain: flightDto.crewMembers?.find(
        (c) =>
          c.role?.toLowerCase() === "pilot" ||
          c.role?.toLowerCase() === "captain"
      )?.id,
      firstOfficer: flightDto.crewMembers?.find(
        (c) =>
          c.role?.toLowerCase() === "copilot" ||
          c.role?.toLowerCase() === "first officer"
      )?.id,
      cabinCrew:
        flightDto.crewMembers
          ?.filter(
            (c) =>
              c.role?.toLowerCase() === "flightattendant" ||
              c.role?.toLowerCase() === "flight attendant"
          )
          .map((c) => c.id) || [],
      status: flightDto.status?.toLowerCase() || "scheduled",
      duration: dayjs(flightDto.arrivalTime).diff(
        dayjs(flightDto.departureTime),
        "minute"
      ),
      passengers: Math.floor(Math.random() * 100) + 150, // Backend'de bu alan yok, rastgele değer
    };
  };

  // Transform crew data
  const transformCrewData = (crewDto) => {
    return {
      id: crewDto.id,
      name: `${crewDto.firstName} ${crewDto.lastName}`,
      role:
        crewDto.role === "pilot"
          ? "Captain"
          : crewDto.role === "copilot"
          ? "First Officer"
          : crewDto.role === "flightattendant"
          ? "Flight Attendant"
          : crewDto.role,
      license: crewDto.licenseNumber,
    };
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [aircraftData, crewData, flightData] = await Promise.all([
          apiService.getAircraft(),
          apiService.getCrew(),
          apiService.getFlights(),
        ]);

        // Transform data to match frontend expectations
        const transformedCrews = crewData.map(transformCrewData);
        const transformedFlights = flightData.map(transformFlightData);

        setAircrafts(aircraftData); // Already transformed in apiService
        setCrews(transformedCrews);
        setFlights(transformedFlights);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data from server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update UTC time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUTCTime(dayjs.utc());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter flights by selected date
  // Show flight if it departs, arrives, or is in progress on the selected date
  const filteredFlights = flights.filter((flight) => {
    const selectedDayStart = selectedDate.startOf("day");
    const selectedDayEnd = selectedDate.endOf("day");
    const departureTime = dayjs.utc(flight.departure.time);
    const arrivalTime = dayjs.utc(flight.arrival.time);

    // Show flight if:
    // 1. It departs on this day, OR
    // 2. It arrives on this day, OR
    // 3. It's in progress during this day (departs before and arrives after)
    return (
      (departureTime.isAfter(selectedDayStart) &&
        departureTime.isBefore(selectedDayEnd)) ||
      (arrivalTime.isAfter(selectedDayStart) &&
        arrivalTime.isBefore(selectedDayEnd)) ||
      (departureTime.isBefore(selectedDayStart) &&
        arrivalTime.isAfter(selectedDayEnd))
    );
  });

  // Filter crews by role
  const captains = crews.filter(
    (c) =>
      c.role?.toLowerCase() === "captain" || c.role?.toLowerCase() === "pilot"
  );
  const firstOfficers = crews.filter(
    (c) =>
      c.role?.toLowerCase() === "first officer" ||
      c.role?.toLowerCase() === "copilot"
  );
  const flightAttendants = crews.filter(
    (c) =>
      c.role?.toLowerCase() === "flight attendant" ||
      c.role?.toLowerCase() === "flightattendant"
  );

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const [aircraftData, crewData, flightData] = await Promise.all([
        apiService.getAircraft(),
        apiService.getCrew(),
        apiService.getFlights(),
      ]);

      const transformedCrews = crewData.map(transformCrewData);
      const transformedFlights = flightData.map(transformFlightData);

      setAircrafts(aircraftData);
      setCrews(transformedCrews);
      setFlights(transformedFlights);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert("Export functionality would be implemented here");
  };

  const handlePrevDay = () => {
    setSelectedDate(selectedDate.subtract(1, "day"));
  };

  const handleNextDay = () => {
    setSelectedDate(selectedDate.add(1, "day"));
  };

  const handleToday = () => {
    setSelectedDate(dayjs.utc());
  };

  const isToday = () => {
    return (
      selectedDate.format("YYYY-MM-DD") === dayjs.utc().format("YYYY-MM-DD")
    );
  };

  // Loading state
  if (loading && aircrafts.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading flight data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Professional FlightScheduler Style */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Flight Scheduler</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {selectedDate.format("MMMM D, YYYY")}
              </span>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                UTC: {currentUTCTime.format("HH:mm:ss")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors text-sm font-medium"
            >
              {isToday() ? "Today" : selectedDate.format("MMM D")}
            </button>
            <button
              onClick={handleNextDay}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div ref={scrollContainerRef} className="h-full overflow-auto">
          <div className="inline-block min-w-full">
            {/* Aircraft Section */}
            <div className="bg-white">
              {/* Time Grid - En üstte */}
              <div className="sticky top-0 z-30">
                <TimeGrid selectedDate={selectedDate} />
              </div>

              {/* Aircraft Header - Time Grid'in altında */}
              <div className="flex bg-gray-100 border-b-2 border-gray-300 sticky top-[52px] z-40">
                <div className="w-48 px-4 py-3 font-bold text-sm text-gray-700 sticky left-0 bg-gray-100 border-r border-gray-300 z-50 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  AIRCRAFT ({aircrafts.length})
                </div>
                <div className="flex-1 relative">
                  <CurrentTimeLabel />
                </div>
              </div>

              <div className="relative">
                {aircrafts.map((aircraft) => (
                  <AircraftRow
                    key={aircraft.id}
                    aircraft={aircraft}
                    flights={filteredFlights}
                    selectedDate={selectedDate}
                  />
                ))}
              </div>
            </div>

            {/* Crew Section */}
            <div className="bg-white mt-4">
              {/* Crew Header - Sticky below Aircraft header */}
              <div className="flex bg-gray-100 border-b-2 border-gray-300 sticky top-[96px] z-40">
                <div className="w-48 px-4 py-3 font-bold text-sm text-gray-700 sticky left-0 bg-gray-100 border-r border-gray-300 z-50 flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-green-600" />
                  CREW ({crews.length})
                </div>
                <div className="flex-1" />
              </div>

              {/* Captains */}
              {captains.length > 0 && (
                <>
                  <div className="flex bg-gray-50 border-b border-gray-200">
                    <div className="w-48 px-6 py-2 sticky left-0 bg-gray-50 z-20 border-r border-gray-200">
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Captains ({captains.length})
                      </h3>
                    </div>
                    <div className="flex-1" />
                  </div>
                  {captains.map((crew) => (
                    <CrewRow
                      key={crew.id}
                      crew={crew}
                      flights={filteredFlights}
                      section="captain"
                      selectedDate={selectedDate}
                    />
                  ))}
                </>
              )}

              {/* First Officers */}
              {firstOfficers.length > 0 && (
                <>
                  <div className="flex bg-gray-50 border-b border-gray-200 mt-2">
                    <div className="w-48 px-6 py-2 sticky left-0 bg-gray-50 z-20 border-r border-gray-200">
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        First Officers ({firstOfficers.length})
                      </h3>
                    </div>
                    <div className="flex-1" />
                  </div>
                  {firstOfficers.map((crew) => (
                    <CrewRow
                      key={crew.id}
                      crew={crew}
                      flights={filteredFlights}
                      section="firstofficer"
                      selectedDate={selectedDate}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 text-center">
        <p className="text-xs text-gray-500">
          All times are displayed in UTC timezone • Hover over flight blocks for
          detailed information
        </p>
      </div>
    </div>
  );
};

export default CasePage;
