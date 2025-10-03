import React, { useState, useRef, useEffect } from "react";
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
import flightDataJson from "../data/flightData.json";
import { processFlightData } from "../utils/flightDataProcessor";

// Current Time Indicator Component
const CurrentTimeIndicator = ({ viewMode, startDate, scrollDays = 0 }) => {
  const [position, setPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      let shouldShow = false;

      if (viewMode === "daily") {
        // For extended view: 2 days before current date
        const startDay = new Date(start);
        startDay.setDate(startDay.getDate() - 2 + scrollDays);
        const endDay = new Date(startDay);
        endDay.setDate(endDay.getDate() + 5); // 5 days total

        if (now >= startDay && now < endDay) {
          const hoursDiff = (now - startDay) / (1000 * 60 * 60);
          setPosition(hoursDiff * 120);
          shouldShow = true;
        }
      } else if (viewMode === "weekly") {
        const startWeek = new Date(start);
        const endWeek = new Date(start);
        endWeek.setDate(endWeek.getDate() + 7);

        if (now >= startWeek && now < endWeek) {
          const daysDiff = (now - startWeek) / (1000 * 60 * 60 * 24);
          setPosition(daysDiff * 200);
          shouldShow = true;
        }
      } else {
        const startMonth = new Date(start);
        const endMonth = new Date(start);
        endMonth.setDate(endMonth.getDate() + 30);

        if (now >= startMonth && now < endMonth) {
          const daysDiff = (now - startMonth) / (1000 * 60 * 60 * 24);
          setPosition(daysDiff * 100);
          shouldShow = true;
        }
      }

      setIsVisible(shouldShow);
    };

    updatePosition();
    const interval = setInterval(updatePosition, 60000);

    return () => clearInterval(interval);
  }, [viewMode, startDate, scrollDays]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
      style={{ left: `${position}px` }}
    >
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full" />
      <div
        className="absolute top-0 left-0.5 w-full border-l-2 border-dashed border-red-500"
        style={{ height: "100%" }}
      />
    </div>
  );
};

// Timeline Header Component
const TimelineHeader = ({ timeSlots, viewMode }) => {
  const formatTime = (date) => {
    if (viewMode === "daily") {
      const time = date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      // Show date at midnight
      if (date.getHours() === 0) {
        const day = date.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "short",
        });
        return `${day}\n${time}`;
      }
      return time;
    } else {
      return date.toLocaleDateString("tr-TR", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const slotWidth =
    viewMode === "daily" ? 120 : viewMode === "weekly" ? 200 : 100;

  return (
    <div className="flex border-b border-gray-300 bg-white sticky top-0 z-20">
      {timeSlots.map((slot, idx) => {
        const isNewDay = slot.getHours() === 0;
        return (
          <div
            key={idx}
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
const FlightBlock = ({ flight, onDragStart, onClick }) => {
  const getStatusColor = () => {
    switch (flight.status) {
      case "cancelled":
        return "bg-red-500 border-red-700 hover:bg-red-600";
      case "delayed":
        return "bg-orange-500 border-orange-700 hover:bg-orange-600";
      case "completed":
        return "bg-green-500 border-green-700 hover:bg-green-600";
      case "scheduled":
        return "bg-blue-500 border-blue-700 hover:bg-blue-600";
      default:
        return "bg-gray-500 border-gray-700 hover:bg-gray-600";
    }
  };

  const getStatusText = () => {
    switch (flight.status) {
      case "cancelled":
        return "İptal";
      case "delayed":
        return "Gecikme";
      case "completed":
        return "Tamamlandı";
      case "scheduled":
        return "Planlandı";
      default:
        return "";
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, flight)}
      onClick={() => onClick(flight)}
      className={`absolute top-2 bottom-2 rounded-lg shadow-md cursor-pointer 
                 transition-all border-l-4 flex flex-col justify-center px-3 overflow-hidden group
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
      <div className="text-white/80 text-xs mt-0.5">{getStatusText()}</div>
      <div
        className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-8 cursor-ew-resize 
                    opacity-0 group-hover:opacity-100 bg-white/30 rounded"
      />
    </div>
  );
};

// Schedule Row Component
const ScheduleRow = ({
  item,
  type,
  timeSlots,
  viewMode,
  onFlightDrop,
  onFlightClick,
}) => {
  const slotWidth =
    viewMode === "daily" ? 120 : viewMode === "weekly" ? 200 : 100;

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onFlightDrop(item.id, e);
  };

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div
        className="w-48 flex-shrink-0 sticky left-0 bg-white border-r border-gray-300 
                    px-4 py-4 flex items-center gap-3 z-30"
      >
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

      <div
        className="relative flex-1"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {timeSlots.map((slot, idx) => {
          const isNewDay = slot.getHours() === 0;
          return (
            <div
              key={idx}
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

        {item.flights?.map((flight) => (
          <FlightBlock
            key={flight.id}
            flight={flight}
            onDragStart={() => {}}
            onClick={onFlightClick}
          />
        ))}
      </div>
    </div>
  );
};

// Flight Detail Modal
const FlightDetailModal = ({ flight, onClose }) => {
  if (!flight) return null;

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "delayed":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "cancelled":
        return "İptal Edildi";
      case "delayed":
        return "Gecikme";
      case "completed":
        return "Tamamlandı";
      case "scheduled":
        return "Planlandı";
      default:
        return "";
    }
  };

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

        <div className="p-6 space-y-6">
          <div>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadgeColor(
                flight.status
              )}`}
            >
              {getStatusText(flight.status)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Kalkış</span>
              </div>
              <div className="pl-6">
                <div className="text-lg font-bold text-gray-900">
                  {flight.departure}
                </div>
                <div className="text-sm text-gray-600">{flight.from}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Varış</span>
              </div>
              <div className="pl-6">
                <div className="text-lg font-bold text-gray-900">
                  {flight.arrival}
                </div>
                <div className="text-sm text-gray-600">{flight.to}</div>
              </div>
            </div>
          </div>

          {flight.passengers !== undefined && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Yolcu Sayısı</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {flight.passengers}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Mürettebat</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {flight.crew}
                  </div>
                </div>
              </div>
            </div>
          )}

          {flight.delayReason && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-orange-900">
                    Gecikme Sebebi
                  </div>
                  <div className="text-sm text-orange-800 mt-1">
                    {flight.delayReason}
                  </div>
                </div>
              </div>
            </div>
          )}

          {flight.cancelReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <X className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-red-900">İptal Sebebi</div>
                  <div className="text-sm text-red-800 mt-1">
                    {flight.cancelReason}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Scheduler Component
const FlightScheduler = () => {
  // Load viewMode from localStorage or default to "daily"
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem("flightSchedulerViewMode");
    return saved || "daily";
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFlight, setSelectedFlight] = useState(null);
  const scrollContainerRef = useRef(null);
  const [scrollDays, setScrollDays] = useState(0); // Track how many days we've scrolled
  const [scrollWeeks, setScrollWeeks] = useState(0); // Track how many weeks we've scrolled
  const [scrollMonths, setScrollMonths] = useState(0); // Track how many months we've scrolled

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("flightSchedulerViewMode", viewMode);
  }, [viewMode]);

  // Generate extended timeline (5 days: 2 before, current, 2 after)
  const generateExtendedTimeSlots = () => {
    const slots = [];

    if (viewMode === "daily") {
      // Always use today as reference, not currentDate
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Timeline starts 2 days before today + scrollDays offset
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 2 + scrollDays);

      // Generate 5 days * 24 hours = 120 hours
      for (let i = 0; i < 120; i++) {
        const slot = new Date(startDate);
        slot.setHours(i);
        slots.push(slot);
      }
    } else if (viewMode === "weekly") {
      // Generate 5 weeks: 2 before, current, 2 after (35 days total)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 14 + scrollWeeks * 7); // Start 2 weeks before

      for (let i = 0; i < 35; i++) {
        // 5 weeks * 7 days
        slots.push(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000));
      }
    } else {
      // Generate 5 months: 2 before, current, 2 after
      const today = new Date();
      today.setDate(1); // Start from first day of month
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(today);
      startDate.setMonth(startDate.getMonth() - 2 + scrollMonths);

      // Calculate total days in 5 months
      let totalDays = 0;
      for (let m = 0; m < 5; m++) {
        const tempDate = new Date(startDate);
        tempDate.setMonth(tempDate.getMonth() + m);
        const daysInMonth = new Date(
          tempDate.getFullYear(),
          tempDate.getMonth() + 1,
          0
        ).getDate();
        totalDays += daysInMonth;
      }

      for (let i = 0; i < totalDays; i++) {
        slots.push(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000));
      }
    }

    return slots;
  };

  const timeSlots = generateExtendedTimeSlots();

  // Handle scroll to detect when to load more days/weeks/months
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollTimeout = null;
    let isAdjusting = false;

    const handleScroll = () => {
      if (isAdjusting) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      if (viewMode === "daily") {
        const slotWidth = 120;
        const dayWidth = slotWidth * 24; // 24 hours

        // If scrolled near the start (within 0.5 day), load previous day
        if (scrollLeft < dayWidth * 0.5) {
          isAdjusting = true;
          setScrollDays((prev) => prev - 1);
          requestAnimationFrame(() => {
            scrollContainer.scrollLeft = scrollLeft + dayWidth;
            isAdjusting = false;
          });
          return;
        }

        // If scrolled near the end (within 0.5 day), load next day
        if (scrollLeft + clientWidth > scrollWidth - dayWidth * 0.5) {
          isAdjusting = true;
          setScrollDays((prev) => prev + 1);
          requestAnimationFrame(() => {
            scrollContainer.scrollLeft = scrollLeft - dayWidth;
            isAdjusting = false;
          });
          return;
        }

        // Debounce the date update to avoid too many re-renders
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
          // Calculate which day is at the center of the viewport
          const centerPosition = scrollLeft + clientWidth / 2;
          const centerHour = centerPosition / slotWidth;
          const centerDay = Math.floor(centerHour / 24);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const centerDate = new Date(today);
          centerDate.setDate(today.getDate() - 2 + scrollDays + centerDay);

          if (centerDate.toDateString() !== currentDate.toDateString()) {
            setCurrentDate(centerDate);
          }
        }, 200);
      } else if (viewMode === "weekly") {
        const slotWidth = 200;
        const weekWidth = slotWidth * 7; // 7 days

        // If scrolled near the start, load previous week
        if (scrollLeft < weekWidth * 0.5) {
          isAdjusting = true;
          setScrollWeeks((prev) => prev - 1);
          requestAnimationFrame(() => {
            scrollContainer.scrollLeft = scrollLeft + weekWidth;
            isAdjusting = false;
          });
          return;
        }

        // If scrolled near the end, load next week
        if (scrollLeft + clientWidth > scrollWidth - weekWidth * 0.5) {
          isAdjusting = true;
          setScrollWeeks((prev) => prev + 1);
          requestAnimationFrame(() => {
            scrollContainer.scrollLeft = scrollLeft - weekWidth;
            isAdjusting = false;
          });
          return;
        }

        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
          const centerPosition = scrollLeft + clientWidth / 2;
          const centerDay = Math.floor(centerPosition / slotWidth);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const centerDate = new Date(today);
          centerDate.setDate(
            today.getDate() - 14 + scrollWeeks * 7 + centerDay
          );

          if (centerDate.toDateString() !== currentDate.toDateString()) {
            setCurrentDate(centerDate);
          }
        }, 200);
      } else {
        // monthly
        const slotWidth = 100;
        const monthWidth = slotWidth * 30; // Approximate

        // If scrolled near the start, load previous month
        if (scrollLeft < monthWidth * 0.5) {
          isAdjusting = true;
          setScrollMonths((prev) => prev - 1);
          requestAnimationFrame(() => {
            scrollContainer.scrollLeft = scrollLeft + monthWidth;
            isAdjusting = false;
          });
          return;
        }

        // If scrolled near the end, load next month
        if (scrollLeft + clientWidth > scrollWidth - monthWidth * 0.5) {
          isAdjusting = true;
          setScrollMonths((prev) => prev + 1);
          requestAnimationFrame(() => {
            scrollContainer.scrollLeft = scrollLeft - monthWidth;
            isAdjusting = false;
          });
          return;
        }

        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
          const centerPosition = scrollLeft + clientWidth / 2;
          const centerDay = Math.floor(centerPosition / slotWidth);

          const today = new Date();
          today.setDate(1);
          today.setHours(0, 0, 0, 0);

          const centerDate = new Date(today);
          centerDate.setMonth(today.getMonth() - 2 + scrollMonths);
          centerDate.setDate(centerDate.getDate() + centerDay);

          if (centerDate.toDateString() !== currentDate.toDateString()) {
            setCurrentDate(centerDate);
          }
        }, 200);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollDays, scrollWeeks, scrollMonths, viewMode, currentDate]);

  // Center the view on initial load and when view mode changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Reset all scroll offsets
      setScrollDays(0);
      setScrollWeeks(0);
      setScrollMonths(0);
      setCurrentDate(new Date());

      setTimeout(() => {
        if (scrollContainerRef.current) {
          if (viewMode === "daily") {
            const dayWidth = 120 * 24;
            scrollContainerRef.current.scrollLeft = dayWidth * 2; // Center on day 3
          } else if (viewMode === "weekly") {
            const weekWidth = 200 * 7;
            scrollContainerRef.current.scrollLeft = weekWidth * 2; // Center on week 3
          } else {
            // monthly
            // Calculate scroll position to center on current month
            const today = new Date();
            today.setDate(1);
            const startDate = new Date(today);
            startDate.setMonth(startDate.getMonth() - 2);

            let daysToScroll = 0;
            for (let m = 0; m < 2; m++) {
              const tempDate = new Date(startDate);
              tempDate.setMonth(tempDate.getMonth() + m);
              daysToScroll += new Date(
                tempDate.getFullYear(),
                tempDate.getMonth() + 1,
                0
              ).getDate();
            }

            scrollContainerRef.current.scrollLeft = daysToScroll * 100;
          }
        }
      }, 0);
    }
  }, [viewMode]);

  // Process flight data based on current view and scroll position
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const aircraft = processFlightData(
    flightDataJson.aircraft,
    today,
    viewMode === "daily"
      ? scrollDays
      : viewMode === "weekly"
      ? scrollWeeks
      : scrollMonths,
    viewMode
  );

  const crew = processFlightData(
    flightDataJson.crew,
    today,
    viewMode === "daily"
      ? scrollDays
      : viewMode === "weekly"
      ? scrollWeeks
      : scrollMonths,
    viewMode
  );

  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  const handlePrevious = () => {
    if (scrollContainerRef.current) {
      if (viewMode === "daily") {
        const dayWidth = 120 * 24;
        scrollContainerRef.current.scrollBy({
          left: -dayWidth,
          behavior: "smooth",
        });
      } else if (viewMode === "weekly") {
        const weekWidth = 200 * 7;
        scrollContainerRef.current.scrollBy({
          left: -weekWidth,
          behavior: "smooth",
        });
      } else {
        // Scroll back approximately one month
        const monthWidth = 100 * 30;
        scrollContainerRef.current.scrollBy({
          left: -monthWidth,
          behavior: "smooth",
        });
      }
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      if (viewMode === "daily") {
        const dayWidth = 120 * 24;
        scrollContainerRef.current.scrollBy({
          left: dayWidth,
          behavior: "smooth",
        });
      } else if (viewMode === "weekly") {
        const weekWidth = 200 * 7;
        scrollContainerRef.current.scrollBy({
          left: weekWidth,
          behavior: "smooth",
        });
      } else {
        // Scroll forward approximately one month
        const monthWidth = 100 * 30;
        scrollContainerRef.current.scrollBy({
          left: monthWidth,
          behavior: "smooth",
        });
      }
    }
  };

  const handleFlightDrop = (itemId, e) => {
    console.log("Flight dropped on:", itemId);
  };

  const handleFlightClick = (flight) => {
    setSelectedFlight(flight);
  };

  const closeModal = () => {
    setSelectedFlight(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Flight Scheduler</h1>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {currentDate.toLocaleDateString("tr-TR", {
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
                onClick={() => {
                  setViewMode(mode);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {mode === "daily"
                  ? "Günlük"
                  : mode === "weekly"
                  ? "Haftalık"
                  : "Aylık"}
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
              onClick={() => {
                const today = new Date();
                setCurrentDate(today);
                setScrollDays(0);
                setScrollWeeks(0);
                setScrollMonths(0);

                if (scrollContainerRef.current) {
                  if (viewMode === "daily") {
                    const dayWidth = 120 * 24;
                    scrollContainerRef.current.scrollTo({
                      left: dayWidth * 2,
                      behavior: "smooth",
                    });
                  } else if (viewMode === "weekly") {
                    const weekWidth = 200 * 7;
                    scrollContainerRef.current.scrollTo({
                      left: weekWidth * 2,
                      behavior: "smooth",
                    });
                  } else {
                    // Calculate scroll position for current month
                    const todayDate = new Date();
                    todayDate.setDate(1);
                    const startDate = new Date(todayDate);
                    startDate.setMonth(startDate.getMonth() - 2);

                    let daysToScroll = 0;
                    for (let m = 0; m < 2; m++) {
                      const tempDate = new Date(startDate);
                      tempDate.setMonth(tempDate.getMonth() + m);
                      daysToScroll += new Date(
                        tempDate.getFullYear(),
                        tempDate.getMonth() + 1,
                        0
                      ).getDate();
                    }

                    scrollContainerRef.current.scrollTo({
                      left: daysToScroll * 100,
                      behavior: "smooth",
                    });
                  }
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors text-sm font-medium"
            >
              {isToday()
                ? "Bugün"
                : currentDate.toLocaleDateString("tr-TR", {
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

      <div className="flex-1 overflow-hidden">
        <div ref={scrollContainerRef} className="h-full overflow-auto">
          <div className="inline-block min-w-full">
            <div className="sticky top-0 z-20 flex">
              <div className="w-48 flex-shrink-0 bg-white border-r border-b border-gray-300 sticky left-0 z-50" />
              <div className="flex-1 overflow-hidden">
                <TimelineHeader timeSlots={timeSlots} viewMode={viewMode} />
              </div>
            </div>

            <div className="bg-white">
              <div className="flex bg-gray-100 border-b-2 border-gray-300">
                <div
                  className="w-48 px-4 py-2 font-bold text-sm text-gray-700 sticky left-0 
                              bg-gray-100 border-r border-gray-300 z-30"
                >
                  UÇAKLAR
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
                    onFlightDrop={handleFlightDrop}
                    onFlightClick={handleFlightClick}
                  />
                ))}
                <CurrentTimeIndicator
                  viewMode={viewMode}
                  startDate={currentDate}
                  scrollDays={scrollDays}
                />
              </div>
            </div>

            <div className="bg-white mt-4">
              <div className="flex bg-gray-100 border-b-2 border-gray-300">
                <div
                  className="w-48 px-4 py-2 font-bold text-sm text-gray-700 sticky left-0 
                              bg-gray-100 border-r border-gray-300 z-30"
                >
                  MÜRETTEBAT
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
                    onFlightDrop={handleFlightDrop}
                    onFlightClick={handleFlightClick}
                  />
                ))}
                <CurrentTimeIndicator
                  viewMode={viewMode}
                  startDate={currentDate}
                  scrollDays={scrollDays}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedFlight && (
        <FlightDetailModal flight={selectedFlight} onClose={closeModal} />
      )}
    </div>
  );
};

export default FlightScheduler;
