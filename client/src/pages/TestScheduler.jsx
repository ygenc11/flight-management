import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plane,
  Users,
  X,
  Clock,
  MapPin,
} from "lucide-react";
import apiService from "../services/apiService";

// Helper function
const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Enhanced Current Time Indicator with Clock Display
const CurrentTimeIndicator = ({ viewMode, timelineStart, slotWidth }) => {
  const [position, setPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      setCurrentTime(now);

      if (!timelineStart) {
        setIsVisible(false);
        return;
      }

      const start = new Date(timelineStart);
      const hoursDiff = (now - start) / (1000 * 60 * 60);

      if (hoursDiff >= 0) {
        const calculatedPosition =
          viewMode === "daily"
            ? hoursDiff * slotWidth
            : (hoursDiff / 24) * slotWidth;
        setPosition(calculatedPosition);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 1000); // Update every second

    return () => clearInterval(interval);
  }, [viewMode, timelineStart, slotWidth]);

  if (!isVisible) return null;

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div
      className="absolute top-0 bottom-0 z-20 pointer-events-none"
      style={{ left: `${position}px` }}
    >
      {/* Red indicator line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-red-500">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full shadow-lg" />
        <div className="absolute top-0 left-0.5 w-full border-l-2 border-dashed border-red-500" />
      </div>

      {/* Time label */}
      <div className="absolute -top-8 left-0 transform -translate-x-1/2">
        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg whitespace-nowrap">
          {timeString}
        </div>
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500 mx-auto"></div>
      </div>
    </div>
  );
};

// Timeline Header Component
const TimelineHeader = ({ timeSlots, viewMode, slotWidth }) => {
  const formatTime = (date) => {
    if (viewMode === "daily") {
      const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      if (date.getHours() === 0) {
        const day = date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
        return `${day}\n${time}`;
      }
      return time;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex border-b border-gray-300 bg-white sticky top-0 z-20">
      {timeSlots.map((slot, idx) => {
        const isNewDay = slot.getHours() === 0;
        return (
          <div
            key={`${slot.getTime()}-${idx}`}
            className={`border-r text-center py-3 font-medium text-sm ${
              isNewDay
                ? "border-gray-400 bg-blue-50 text-gray-900 font-bold"
                : "border-gray-200 text-gray-700"
            }`}
            style={{ minWidth: `${slotWidth}px`, width: `${slotWidth}px` }}
          >
            <div className="whitespace-pre-line">{formatTime(slot)}</div>
          </div>
        );
      })}
    </div>
  );
};

// Flight Block Component
const FlightBlock = ({ flight, onClick }) => {
  if (!flight) return null;

  const getStatusColor = () => {
    switch (flight.status) {
      case "Cancelled":
        return "bg-red-500 border-red-700 hover:bg-red-600";
      case "Delayed":
        return "bg-orange-500 border-orange-700 hover:bg-orange-600";
      case "Arrived":
        return "bg-green-500 border-green-700 hover:bg-green-600";
      case "Departed":
        return "bg-purple-500 border-purple-700 hover:bg-purple-600";
      case "Planned":
        return "bg-blue-500 border-blue-700 hover:bg-blue-600";
      default:
        return "bg-gray-500 border-gray-700 hover:bg-gray-600";
    }
  };

  return (
    <div
      onClick={() => onClick(flight)}
      className={`absolute top-2 bottom-2 rounded-lg shadow-md cursor-pointer 
                 transition-all border-l-4 flex flex-col justify-center px-3 overflow-hidden
                 ${getStatusColor()}`}
      style={{
        left: `${flight.startOffset}px`,
        width: `${flight.width}px`,
      }}
    >
      <div className="text-white font-semibold text-xs truncate">
        {flight.flightNumber}
      </div>
      <div className="text-white/90 text-xs truncate">{flight.route}</div>
      <div className="text-white/80 text-xs mt-0.5">{flight.status}</div>
    </div>
  );
};

// Schedule Row Component
const ScheduleRow = ({
  item,
  type,
  timeSlots,
  viewMode,
  slotWidth,
  onFlightClick,
}) => {
  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="w-48 flex-shrink-0 sticky left-0 bg-white border-r border-gray-300 px-4 py-4 flex items-center gap-3 z-30">
        {type === "aircraft" ? (
          <Plane className="w-5 h-5 text-blue-600" />
        ) : (
          <Users className="w-5 h-5 text-green-600" />
        )}
        <div>
          <div className="font-semibold text-sm text-gray-900">{item.name}</div>
          <div className="text-xs text-gray-500">{item.subtitle}</div>
        </div>
      </div>

      <div className="relative flex-1">
        {timeSlots.map((slot, idx) => {
          const isNewDay = slot.getHours() === 0;
          return (
            <div
              key={`${slot.getTime()}-${idx}`}
              className={`absolute top-0 bottom-0 border-r ${
                isNewDay ? "border-gray-300" : "border-gray-100"
              }`}
              style={{
                left: `${idx * slotWidth}px`,
                width: `${slotWidth}px`,
              }}
            />
          );
        })}

        {(item.flights || [])
          .filter((f) => f && f.id)
          .map((flight) => (
            <FlightBlock
              key={flight.id}
              flight={flight}
              onClick={onFlightClick}
            />
          ))}
      </div>
    </div>
  );
};

// Flight Detail Modal (simplified)
const FlightDetailModal = ({ flight, onClose }) => {
  if (!flight) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Plane className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {flight.flightNumber}
              </h2>
              <p className="text-sm text-gray-600">{flight.route}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Departure</div>
              <div className="text-lg font-bold">{flight.from}</div>
              <div className="text-sm">{flight.departure}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Arrival</div>
              <div className="text-lg font-bold">{flight.to}</div>
              <div className="text-sm">{flight.arrival}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main TestScheduler Component
const TestScheduler = () => {
  const [viewMode, setViewMode] = useState("daily");
  const [centerDate, setCenterDate] = useState(new Date());
  const [selectedFlight, setSelectedFlight] = useState(null);
  const scrollContainerRef = useRef(null);
  const isExtendingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Dynamic timeline boundaries
  const [timelineStart, setTimelineStart] = useState(() => {
    const start = getStartOfDay(new Date());
    start.setDate(start.getDate() - 3); // Start 3 days ago
    return start;
  });

  const [timelineEnd, setTimelineEnd] = useState(() => {
    const end = getStartOfDay(new Date());
    end.setDate(end.getDate() + 4); // End 4 days ahead
    return end;
  });

  // Backend data states
  const [aircraftData, setAircraftData] = useState([]);
  const [crewData, setCrewData] = useState([]);
  const [flightsData, setFlightsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const [aircraft, crew, flights] = await Promise.all([
        apiService.getAircraft(),
        apiService.getCrew(),
        apiService.getFlights(),
      ]);
      setAircraftData(aircraft);
      setCrewData(crew);
      setFlightsData(flights);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    loadInitialData();

    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    const refreshInterval = setInterval(fetchData, 30000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(refreshInterval);
    };
  }, []);

  // Configuration
  const slotWidth =
    viewMode === "daily" ? 120 : viewMode === "weekly" ? 200 : 100;
  const hoursPerSlot = viewMode === "daily" ? 1 : 24;

  // Generate time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    const start = new Date(timelineStart);
    const end = new Date(timelineEnd);

    if (viewMode === "daily") {
      let current = new Date(start);
      while (current < end) {
        slots.push(new Date(current));
        current.setHours(current.getHours() + 1);
      }
    } else {
      let current = new Date(start);
      while (current < end) {
        slots.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    }

    return slots;
  }, [timelineStart, timelineEnd, viewMode]);

  // Calculate total width
  const totalWidth = timeSlots.length * slotWidth;

  // Extension functions
  const extendBackward = () => {
    if (isExtendingRef.current) return;
    isExtendingRef.current = true;

    const daysToAdd = viewMode === "daily" ? 3 : viewMode === "weekly" ? 7 : 30;
    const newStart = new Date(timelineStart);
    newStart.setDate(newStart.getDate() - daysToAdd);

    const hoursAdded = viewMode === "daily" ? daysToAdd * 24 : daysToAdd;
    const widthAdded = hoursAdded * slotWidth;

    const currentScroll = scrollContainerRef.current?.scrollLeft || 0;

    console.log(
      `📅 Extending BACKWARD: Adding ${daysToAdd} days before ${timelineStart.toDateString()}`
    );

    setTimelineStart(newStart);

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = currentScroll + widthAdded;
      }
      isExtendingRef.current = false;
    }, 0);
  };

  const extendForward = () => {
    if (isExtendingRef.current) return;
    isExtendingRef.current = true;

    const daysToAdd = viewMode === "daily" ? 3 : viewMode === "weekly" ? 7 : 30;
    const newEnd = new Date(timelineEnd);
    newEnd.setDate(newEnd.getDate() + daysToAdd);

    console.log(
      `📅 Extending FORWARD: Adding ${daysToAdd} days after ${timelineEnd.toDateString()}`
    );

    setTimelineEnd(newEnd);

    setTimeout(() => {
      isExtendingRef.current = false;
    }, 0);
  };

  // Scroll handler with edge detection
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);

      // Edge detection (20% threshold)
      if (scrollLeft < totalWidth * 0.2) {
        console.log(
          `⬅️ Near start (${(scrollPercentage * 100).toFixed(
            1
          )}%) - extending backward`
        );
        extendBackward();
      }

      if (scrollLeft > scrollWidth - clientWidth - totalWidth * 0.2) {
        console.log(
          `➡️ Near end (${(scrollPercentage * 100).toFixed(
            1
          )}%) - extending forward`
        );
        extendForward();
      }

      // Update center date (debounced)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const centerPosition = scrollLeft + clientWidth / 2;
        const centerSlotIndex = Math.floor(centerPosition / slotWidth);

        if (timeSlots[centerSlotIndex]) {
          const newCenterDate = new Date(timeSlots[centerSlotIndex]);
          if (newCenterDate.toDateString() !== centerDate.toDateString()) {
            setCenterDate(newCenterDate);
          }
        }
      }, 300);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [totalWidth, timeSlots, centerDate, slotWidth]);

  // Initial scroll to current time
  useEffect(() => {
    if (scrollContainerRef.current && timeSlots.length > 0) {
      const now = new Date();
      const start = new Date(timelineStart);
      const hoursDiff = (now - start) / (1000 * 60 * 60);

      if (hoursDiff >= 0) {
        const targetPosition =
          viewMode === "daily"
            ? hoursDiff * slotWidth
            : (hoursDiff / 24) * slotWidth;

        // Center the current time in viewport
        const viewportCenter = scrollContainerRef.current.clientWidth / 2;
        scrollContainerRef.current.scrollLeft = targetPosition - viewportCenter;
      }
    }
  }, [timelineStart, viewMode, slotWidth, timeSlots.length]);

  // Process flight data
  const processFlights = (items) => {
    return items.map((item) => {
      const processedFlights = (item.flights || [])
        .filter((f) => f && f.departureTime && f.arrivalTime)
        .map((flight) => {
          const departureDate = new Date(flight.departureTime);
          const arrivalDate = new Date(flight.arrivalTime);
          const start = new Date(timelineStart);

          const hoursDiff = (departureDate - start) / (1000 * 60 * 60);
          const duration = (arrivalDate - departureDate) / (1000 * 60 * 60);

          const startOffset =
            viewMode === "daily"
              ? hoursDiff * slotWidth
              : (hoursDiff / 24) * slotWidth;

          const width =
            viewMode === "daily"
              ? duration * slotWidth
              : (duration / 24) * slotWidth;

          return {
            ...flight,
            startOffset: Math.round(startOffset),
            width: Math.max(Math.round(width), 20),
            departure: departureDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            arrival: arrivalDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          };
        });

      return { ...item, flights: processedFlights };
    });
  };

  // Transform backend data
  const transformedAircraftData = (aircraftData || []).map((aircraft) => ({
    id: aircraft.id,
    name: aircraft.model,
    subtitle: aircraft.tailNumber,
    flights: (flightsData || [])
      .filter(
        (f) =>
          f && f.aircraftId === aircraft.id && f.departureTime && f.arrivalTime
      )
      .map((f) => ({
        id: f.id,
        flightNumber: f.flightNumber,
        route: `${f.departureAirport?.iataCode || ""} → ${
          f.arrivalAirport?.iataCode || ""
        }`,
        from: f.departureAirport?.city || "",
        to: f.arrivalAirport?.city || "",
        departureTime: f.departureTime,
        arrivalTime: f.arrivalTime,
        status: f.status || "Planned",
      })),
  }));

  const transformedCrewData = (crewData || []).map((crew) => ({
    id: crew.id,
    name: `${crew.firstName} ${crew.lastName}`,
    subtitle: crew.role,
    flights: (flightsData || [])
      .filter(
        (f) =>
          f &&
          f.crewMembers?.some((c) => c.id === crew.id) &&
          f.departureTime &&
          f.arrivalTime
      )
      .map((f) => ({
        id: f.id,
        flightNumber: f.flightNumber,
        route: `${f.departureAirport?.iataCode || ""} → ${
          f.arrivalAirport?.iataCode || ""
        }`,
        from: f.departureAirport?.city || "",
        to: f.arrivalAirport?.city || "",
        departureTime: f.departureTime,
        arrivalTime: f.arrivalTime,
        status: f.status || "Planned",
      })),
  }));

  const aircraft = processFlights(transformedAircraftData);
  const crew = processFlights(transformedCrewData);

  const isToday = () => {
    const today = new Date();
    return centerDate.toDateString() === today.toDateString();
  };

  const jumpToToday = () => {
    const today = new Date();
    setCenterDate(today);

    if (scrollContainerRef.current) {
      const now = new Date();
      const start = new Date(timelineStart);
      const hoursDiff = (now - start) / (1000 * 60 * 60);

      if (hoursDiff >= 0) {
        const targetPosition =
          viewMode === "daily"
            ? hoursDiff * slotWidth
            : (hoursDiff / 24) * slotWidth;

        const viewportCenter = scrollContainerRef.current.clientWidth / 2;
        scrollContainerRef.current.scrollTo({
          left: targetPosition - viewportCenter,
          behavior: "smooth",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (scrollContainerRef.current) {
      const scrollAmount =
        viewMode === "daily"
          ? slotWidth * 24
          : viewMode === "weekly"
          ? slotWidth * 7
          : slotWidth * 30;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      const scrollAmount =
        viewMode === "daily"
          ? slotWidth * 24
          : viewMode === "weekly"
          ? slotWidth * 7
          : slotWidth * 30;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flight data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Test Scheduler (Infinite Scroll)
          </h1>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {centerDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["daily", "weekly", "monthly"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={jumpToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {isToday()
                ? "Today"
                : centerDate.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-hidden">
        <div ref={scrollContainerRef} className="h-full overflow-auto">
          <div className="inline-block min-w-full">
            <div className="sticky top-0 z-20 flex">
              <div className="w-48 flex-shrink-0 bg-white border-r border-b border-gray-300 sticky left-0 z-50" />
              <div className="flex-1 overflow-hidden">
                <TimelineHeader
                  timeSlots={timeSlots}
                  viewMode={viewMode}
                  slotWidth={slotWidth}
                />
              </div>
            </div>

            {/* Aircraft Section */}
            <div className="bg-white">
              <div className="flex bg-gray-100 border-b-2 border-gray-300">
                <div className="w-48 px-4 py-2 font-bold text-sm text-gray-700 sticky left-0 bg-gray-100 border-r border-gray-300 z-30">
                  AIRCRAFT
                </div>
                <div className="flex-1" />
              </div>

              <div className="relative">
                {aircraft.map((ac) => (
                  <ScheduleRow
                    key={ac.id}
                    item={ac}
                    type="aircraft"
                    timeSlots={timeSlots}
                    viewMode={viewMode}
                    slotWidth={slotWidth}
                    onFlightClick={setSelectedFlight}
                  />
                ))}
                <CurrentTimeIndicator
                  viewMode={viewMode}
                  timelineStart={timelineStart}
                  slotWidth={slotWidth}
                />
              </div>
            </div>

            {/* Crew Section */}
            <div className="bg-white mt-4">
              <div className="flex bg-gray-100 border-b-2 border-gray-300">
                <div className="w-48 px-4 py-2 font-bold text-sm text-gray-700 sticky left-0 bg-gray-100 border-r border-gray-300 z-30">
                  CREW
                </div>
                <div className="flex-1" />
              </div>

              <div className="relative">
                {crew.map((member) => (
                  <ScheduleRow
                    key={member.id}
                    item={member}
                    type="crew"
                    timeSlots={timeSlots}
                    viewMode={viewMode}
                    slotWidth={slotWidth}
                    onFlightClick={setSelectedFlight}
                  />
                ))}
                <CurrentTimeIndicator
                  viewMode={viewMode}
                  timelineStart={timelineStart}
                  slotWidth={slotWidth}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedFlight && (
        <FlightDetailModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </div>
  );
};

export default TestScheduler;
