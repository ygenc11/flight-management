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

// Utility function to generate hours for a day
const generateTimeSlots = (startDate, viewMode) => {
  const slots = [];
  const start = new Date(startDate);

  if (viewMode === "daily") {
    // 3 günlük timeline: Dün + Bugün + Yarın (72 saat)
    const year = start.getFullYear();
    const month = start.getMonth();
    const date = start.getDate();

    // Dünden başla
    const previousDay = new Date(year, month, date - 1, 0, 0, 0, 0);

    for (let i = 0; i < 72; i++) {
      const slot = new Date(previousDay.getTime() + i * 60 * 60 * 1000);
      slots.push(slot);
    }
  } else if (viewMode === "weekly") {
    // Start from the beginning of the day
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      slots.push(new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
    }
  } else {
    // Start from the beginning of the day
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 30; i++) {
      slots.push(new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
    }
  }

  return slots;
};

// Current Time Indicator Component
const CurrentTimeIndicator = ({ viewMode, startDate }) => {
  const [position, setPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      let shouldShow = false;

      if (viewMode === "daily") {
        const startDay = new Date(start);
        const endDay = new Date(start);
        endDay.setDate(endDay.getDate() + 1);

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
  }, [viewMode, startDate]);

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
      const hours = date.getHours();
      // Gece yarısında tarih göster
      if (hours === 0) {
        return date.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "short",
        });
      }
      return date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
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
        const isDateHeader = viewMode === "daily" && slot.getHours() === 0;
        return (
          <div
            key={idx}
            className={`border-r border-gray-200 text-center py-3 font-medium text-sm ${
              isDateHeader
                ? "bg-blue-50 text-blue-700 font-bold"
                : "text-gray-700"
            }`}
            style={{ minWidth: `${slotWidth}px`, width: `${slotWidth}px` }}
          >
            {formatTime(slot)}
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

  const getStatusText = () => {
    switch (flight.status) {
      case "Cancelled":
        return "Cancelled";
      case "Delayed":
        return "Delayed";
      case "Arrived":
        return "Arrived";
      case "Departed":
        return "Departed";
      case "Planned":
        return "Planned";
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
        {timeSlots.map((_, idx) => (
          <div
            key={idx}
            className="absolute top-0 bottom-0 border-r border-gray-100"
            style={{
              left: `${idx * slotWidth}px`,
              width: `${slotWidth}px`,
            }}
          />
        ))}

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
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "Delayed":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Arrived":
        return "bg-green-100 text-green-800 border-green-300";
      case "Departed":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Planned":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Cancelled":
        return "Cancelled";
      case "Delayed":
        return "Delayed";
      case "Arrived":
        return "Arrived";
      case "Departed":
        return "Departed";
      case "Planned":
        return "Planned";
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
  const [viewMode, setViewMode] = useState("daily");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFlight, setSelectedFlight] = useState(null);
  const scrollContainerRef = useRef(null);

  const timeSlots = generateTimeSlots(currentDate, viewMode);
  const isInitialMount = useRef(true);
  const isScrolling = useRef(false);

  // Scroll başlangıcını ortaya (bugünün başına) ayarla - sadece ilk mount'ta
  useEffect(() => {
    if (
      scrollContainerRef.current &&
      viewMode === "daily" &&
      isInitialMount.current
    ) {
      // 24 saat * 120px = 2880px (bugünün başlangıcı)
      setTimeout(() => {
        scrollContainerRef.current.scrollLeft = 2880;
        isInitialMount.current = false;
      }, 0);
    }
  }, [viewMode]);

  // Scroll ile tarih değiştirme
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || viewMode !== "daily") return;

    let timeoutId;
    const handleScroll = () => {
      if (isScrolling.current) return;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const slotWidth = 120;
        const dayWidth = 24 * slotWidth; // 2880px

        // Sonraki günün 16. saatine gelince (1.67 gün) ertesi güne geç
        if (scrollLeft > dayWidth * 1.67) {
          isScrolling.current = true;
          // Mevcut pozisyondan bir gün çıkar (yeni timeline'da aynı saatte kalması için)
          const currentOffset = scrollLeft - dayWidth;
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() + 1);
          setCurrentDate(newDate);
          // Aynı saatte devam et
          setTimeout(() => {
            container.scrollLeft = currentOffset;
            setTimeout(() => {
              isScrolling.current = false;
            }, 100);
          }, 50);
        }
        // Önceki günün 8. saatine gelince (0.33 gün) önceki güne geç
        else if (scrollLeft < dayWidth * 0.33) {
          isScrolling.current = true;
          // Mevcut pozisyona bir gün ekle (yeni timeline'da aynı saatte kalması için)
          const currentOffset = scrollLeft + dayWidth;
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() - 1);
          setCurrentDate(newDate);
          // Aynı saatte devam et
          setTimeout(() => {
            container.scrollLeft = currentOffset;
            setTimeout(() => {
              isScrolling.current = false;
            }, 100);
          }, 50);
        }
      }, 200);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [currentDate, viewMode]);

  const aircraft = [
    {
      id: "ac1",
      name: "N12345",
      subtitle: "Boeing 737-800",
      flights: [
        {
          id: "f1",
          flightNumber: "FL101",
          route: "JFK → LAX",
          startOffset: 240,
          width: 480,
          status: "scheduled",
          departure: "10:00",
          arrival: "14:00",
          from: "John F. Kennedy International",
          to: "Los Angeles International",
          passengers: 156,
          crew: "Capt. Johnson, FO Williams",
        },
        {
          id: "f2",
          flightNumber: "FL102",
          route: "LAX → SFO",
          startOffset: 960,
          width: 240,
          status: "delayed",
          departure: "18:00",
          arrival: "20:00",
          from: "Los Angeles International",
          to: "San Francisco International",
          passengers: 142,
          crew: "Capt. Smith, FO Davis",
          delayReason: "30 dakika hava durumu gecikmesi",
        },
      ],
    },
    {
      id: "ac2",
      name: "N67890",
      subtitle: "Airbus A320",
      flights: [
        {
          id: "f3",
          flightNumber: "FL201",
          route: "ORD → MIA",
          startOffset: 360,
          width: 600,
          status: "cancelled",
          departure: "12:00",
          arrival: "17:00",
          from: "Chicago O'Hare International",
          to: "Miami International",
          passengers: 0,
          crew: "-",
          cancelReason: "Teknik arıza",
        },
      ],
    },
    {
      id: "ac3",
      name: "N11223",
      subtitle: "Boeing 787-9",
      flights: [],
    },
  ];

  const crew = [
    {
      id: "cr1",
      name: "Capt. Johnson",
      subtitle: "Type: 737, 787",
      flights: [
        {
          id: "c1",
          flightNumber: "FL101",
          route: "Görevde",
          startOffset: 240,
          width: 480,
          status: "scheduled",
          departure: "10:00",
          arrival: "14:00",
          from: "JFK",
          to: "LAX",
        },
      ],
    },
    {
      id: "cr2",
      name: "FO Smith",
      subtitle: "Type: A320",
      flights: [
        {
          id: "c2",
          flightNumber: "FL201",
          route: "İptal Edildi",
          startOffset: 360,
          width: 600,
          status: "cancelled",
          departure: "12:00",
          arrival: "17:00",
          from: "ORD",
          to: "MIA",
        },
      ],
    },
    {
      id: "cr3",
      name: "Capt. Williams",
      subtitle: "Type: 737",
      flights: [],
    },
  ];

  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "daily") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === "weekly") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "daily") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === "weekly") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
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
                onClick={() => setViewMode(mode)}
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
              onClick={() => setCurrentDate(new Date())}
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
