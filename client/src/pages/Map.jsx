import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TbBuildingAirport } from "react-icons/tb";
import ReactDOMServer from "react-dom/server";
import { flights } from "../mock/flightsMockData";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for departure and arrival
const departureIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const arrivalIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Great circle (haversine) interpolation
function interpolateGreatCircle(lat1, lon1, lat2, lon2, numPoints = 64) {
  // All angles in radians
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;
  lat1 = toRad(lat1);
  lon1 = toRad(lon1);
  lat2 = toRad(lat2);
  lon2 = toRad(lon2);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
      )
    );
  if (d === 0) return [[toDeg(lat1), toDeg(lon1)]];

  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x =
      A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y =
      A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    points.push([toDeg(lat), toDeg(lon)]);
  }
  return points;
}

const FlightMap = () => {
  const mapRef = React.useRef(null);
  const [selectedAirport, setSelectedAirport] = React.useState(null);
  const [showFlightsList, setShowFlightsList] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Move zoom controls to topright when map is ready
  React.useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      // Remove default zoom control
      map.zoomControl.remove();
      // Add new zoom control at topright
      L.control.zoom({ position: "topright" }).addTo(map);
    }
  }, []);

  // Group flights by airport
  const getAirportFlights = (iata) => {
    const departures = flights.filter((f) => f.departure.iata === iata);
    const arrivals = flights.filter((f) => f.arrival.iata === iata);
    return { departures, arrivals };
  };

  // Get unique airports
  const airports = React.useMemo(() => {
    const airportMap = new Map();
    flights.forEach((flight) => {
      if (!airportMap.has(flight.departure.iata)) {
        airportMap.set(flight.departure.iata, {
          iata: flight.departure.iata,
          name: flight.departure.name,
          city: flight.departure.city,
          country: flight.departure.country,
          lat: flight.departure.lat,
          lng: flight.departure.lng,
        });
      }
      if (!airportMap.has(flight.arrival.iata)) {
        airportMap.set(flight.arrival.iata, {
          iata: flight.arrival.iata,
          name: flight.arrival.name,
          city: flight.arrival.city,
          country: flight.arrival.country,
          lat: flight.arrival.lat,
          lng: flight.arrival.lng,
        });
      }
    });
    return Array.from(airportMap.values());
  }, [flights]);

  // Calculate center position (average of all coordinates)
  const center = [45.0, 15.0]; // Centered roughly on Europe/Mediterranean

  // Formatted UTC strings for header
  const utcTime = currentTime.toUTCString().slice(17, 25); // HH:MM:SS
  const utcDate = currentTime.toUTCString().slice(0, 16); // Day, DD Mon YYYY

  return (
    <div className="fixed top-[70px] left-0 right-0 bottom-0 w-full overflow-hidden flex flex-col">
      {/* Map Container - Full height */}
      <div className="relative w-full h-full flex-shrink-0">
        {/* Info texts above map - no background, no div, just absolutely positioned text */}
        <h1
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            zIndex: 10000,
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          Flights Map
        </h1>
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 24,
            zIndex: 10000,
            fontSize: "1rem",
            color: "#334155",
            lineHeight: 1.3,
          }}
        >
          <div>Tracking {flights.length} active flights worldwide</div>
          <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: 2 }}>
            UTC: {utcTime} | {utcDate}
          </div>
        </div>

        <MapContainer
          center={center}
          zoom={4}
          className="w-full h-full"
          scrollWheelZoom={true}
          zoomControl={false}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render flight routes */}
          {flights.map((flight, index) => {
            const { departure, arrival, flightNumber } = flight;
            // Great circle points
            const arcPoints = interpolateGreatCircle(
              departure.lat,
              departure.lng,
              arrival.lat,
              arrival.lng,
              64
            );

            return (
              <React.Fragment key={index}>
                {/* Flight route polyline */}
                <Polyline
                  positions={arcPoints}
                  color="#374151"
                  weight={1.5}
                  opacity={0.7}
                  dashArray={null}
                >
                  <Popup>
                    <div className="p-2">
                      <p className="font-semibold text-sm text-slate-800">
                        Flight {flightNumber}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {departure.iata} ({departure.time}) → {arrival.iata} (
                        {arrival.time})
                      </p>
                    </div>
                  </Popup>
                </Polyline>
              </React.Fragment>
            );
          })}

          {/* Render airport markers with grouped flights */}
          {airports.map((airport) => {
            const { departures, arrivals } = getAirportFlights(airport.iata);
            const totalFlights = departures.length + arrivals.length;

            // Custom icon with TbBuildingAirport
            const iconHtml = ReactDOMServer.renderToString(
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                }}
              >
                <TbBuildingAirport
                  size={28}
                  color="#374151"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                />
              </div>
            );

            const airportIcon = new L.DivIcon({
              className: "custom-airport-marker",
              html: iconHtml,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16],
            });

            return (
              <Marker
                key={airport.iata}
                position={[airport.lat, airport.lng]}
                icon={airportIcon}
                eventHandlers={{
                  click: () => setSelectedAirport(airport.iata),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[220px]">
                    {/* Airport Header */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <TbBuildingAirport
                          size={20}
                          className="text-blue-600"
                        />
                        <h3 className="text-base font-bold text-slate-800">
                          {airport.iata}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {airport.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {airport.city}, {airport.country}
                      </p>
                    </div>

                    {/* Quick Stats - Compact */}
                    <div className="flex gap-2 mb-2">
                      <div className="flex-1 bg-green-50 px-2 py-1 rounded text-center">
                        <p className="text-[9px] text-green-700 font-medium">
                          Departures
                        </p>
                        <p className="text-sm font-bold text-green-800">
                          {departures.length}
                        </p>
                      </div>
                      <div className="flex-1 bg-red-50 px-2 py-1 rounded text-center">
                        <p className="text-[9px] text-red-700 font-medium">
                          Arrivals
                        </p>
                        <p className="text-sm font-bold text-red-800">
                          {arrivals.length}
                        </p>
                      </div>
                    </div>

                    {/* View Flights Button - Compact */}
                    <button
                      onClick={() => {
                        setSelectedAirport(airport.iata);
                        setShowFlightsList(true);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <span>View Flights</span>
                      <span className="text-xs opacity-75">
                        ({totalFlights})
                      </span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Professional Flights List Panel - Slide from right */}
      {showFlightsList && (
        <div className="absolute top-0 right-0 bottom-0 w-[450px] bg-white shadow-2xl z-[2000] flex flex-col">
          {/* List Header */}
          <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Flight Schedule</h2>
              <p className="text-xs text-slate-300">
                {selectedAirport
                  ? `Showing flights for ${selectedAirport}`
                  : `All flights (${flights.length})`}
              </p>
            </div>
            <button
              onClick={() => setShowFlightsList(false)}
              className="text-white hover:bg-slate-700 p-2 rounded transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setSelectedAirport(null)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                !selectedAirport
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Flights ({flights.length})
            </button>
          </div>

          {/* Flights List - OpenFlights style */}
          <div className="flex-1 overflow-y-auto">
            {selectedAirport ? (
              // Filtered by selected airport
              (() => {
                const { departures, arrivals } =
                  getAirportFlights(selectedAirport);
                const allFlights = [
                  ...departures.map((f) => ({ ...f, type: "departure" })),
                  ...arrivals.map((f) => ({ ...f, type: "arrival" })),
                ].sort((a, b) => {
                  const timeA =
                    a.type === "departure" ? a.departure.time : a.arrival.time;
                  const timeB =
                    b.type === "departure" ? b.departure.time : b.arrival.time;
                  return timeA.localeCompare(timeB);
                });

                return allFlights.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {allFlights.map((flight, idx) => (
                      <div
                        key={idx}
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded ${
                                flight.type === "departure"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {flight.type === "departure" ? "DEP" : "ARR"}
                            </span>
                            <span className="font-bold text-slate-800">
                              {flight.flightNumber}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-slate-700">
                            {flight.type === "departure"
                              ? flight.departure.time
                              : flight.arrival.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-slate-700">
                            {flight.departure.iata}
                          </span>
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                          <span className="font-semibold text-slate-700">
                            {flight.arrival.iata}
                          </span>
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {flight.departure.city} → {flight.arrival.city}
                        </div>

                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                          <span>Aircraft: {flight.aircraft}</span>
                          <span>•</span>
                          <span>Status: {flight.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-3 opacity-30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p>No flights for this airport</p>
                    </div>
                  </div>
                );
              })()
            ) : (
              // All flights
              <div className="divide-y divide-slate-100">
                {flights.map((flight, idx) => (
                  <div
                    key={idx}
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedAirport(flight.departure.iata)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-bold text-slate-800">
                        {flight.flightNumber}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {flight.departure.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-1">
                      <span className="font-semibold text-slate-700">
                        {flight.departure.iata}
                      </span>
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                      <span className="font-semibold text-slate-700">
                        {flight.arrival.iata}
                      </span>
                      <span className="text-xs text-slate-500 ml-auto">
                        {flight.arrival.time}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mb-2">
                      {flight.departure.city} → {flight.arrival.city}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>Aircraft: {flight.aircraft}</span>
                      <span>•</span>
                      <span>Status: {flight.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* List Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Showing{" "}
                {selectedAirport
                  ? (() => {
                      const { departures, arrivals } =
                        getAirportFlights(selectedAirport);
                      return departures.length + arrivals.length;
                    })()
                  : flights.length}{" "}
                flights
              </span>
              <span className="text-slate-400">Last updated: just now</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightMap;
