import React, { useState, useEffect } from "react";
import Sidebar from "../components/planner/Sidebar";
import AirportManagement from "../components/planner/AirportManagement";
import AircraftManagement from "../components/planner/AircraftManagement";
import CrewManagement from "../components/planner/CrewManagement";
import FlightsManagement from "../components/planner/FlightsManagement";
import apiService from "../services/apiService";

export default function PlannerPage() {
  // Start with "airports", will be updated in useEffect if needed
  const [activeTab, setActiveTab] = useState("airports");
  const [currentUTCTime, setCurrentUTCTime] = useState(
    new Date().toUTCString()
  );

  // app-level state for all modules
  const [airports, setAirports] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [crew, setCrew] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch initial data from API
  async function fetchInitialData() {
    try {
      setLoading(true);
      const [airportsData, aircraftData, crewData, flightsData] =
        await Promise.all([
          apiService.getAirports(),
          apiService.getAircraft(),
          apiService.getCrew(),
          apiService.getFlights(),
        ]);

      setAirports(airportsData);
      setAircraft(aircraftData);
      setCrew(crewData);
      setFlights(flightsData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchInitialData();

    // Check if this is a page reload/refresh
    // If user refreshes, restore their tab from localStorage
    // If they navigated here (from navbar), keep default "airports"
    const wasPageReloaded = sessionStorage.getItem("plannerWasMounted");

    if (wasPageReloaded === "true") {
      // This is a page refresh, restore from localStorage
      const savedTab = localStorage.getItem("plannerActiveTab");
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }

    // Mark that component is now mounted
    sessionStorage.setItem("plannerWasMounted", "true");
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("plannerActiveTab", activeTab);
  }, [activeTab]);

  // Update UTC time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUTCTime(new Date().toUTCString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Track when component unmounts (navigating away from planner)
  useEffect(() => {
    return () => {
      // When unmounting, clear the "was mounted" flag
      // This ensures next mount will use default "airports" tab
      sessionStorage.removeItem("plannerWasMounted");
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading flight management data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">
              Planner / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>
            <p className="text-sm text-gray-500">
              Quick operations and management
            </p>
          </div>
          <div className="text-sm text-gray-600">UTC: {currentUTCTime}</div>
        </header>

        <section className="p-6">
          {activeTab === "airports" && (
            <AirportManagement
              airports={airports}
              setAirports={setAirports}
              apiService={apiService}
            />
          )}
          {activeTab === "aircraft" && (
            <AircraftManagement
              aircraft={aircraft}
              setAircraft={setAircraft}
              apiService={apiService}
            />
          )}
          {activeTab === "crew" && (
            <CrewManagement
              crew={crew}
              setCrew={setCrew}
              apiService={apiService}
            />
          )}
          {activeTab === "flights" && (
            <FlightsManagement
              flights={flights}
              setFlights={setFlights}
              aircraft={aircraft}
              airports={airports}
              crew={crew}
              apiService={apiService}
            />
          )}
        </section>
      </main>
    </div>
  );
}
