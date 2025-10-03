import React, { useState, useEffect } from "react";
import Sidebar from "../components/planner/Sidebar";
import AirportManagement from "../components/planner/AirportManagement";
import AircraftManagement from "../components/planner/AircraftManagement";
import CrewManagement from "../components/planner/CrewManagement";
import FlightsManagement from "../components/planner/FlightsManagement";
import apiService from "../services/apiService";

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState("airports");

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
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">
              Planner / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h3>
            <p className="text-sm text-gray-500">
              Quick operations and management
            </p>
          </div>
          <div className="text-sm text-gray-600">
            UTC {new Date().toUTCString()}
          </div>
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
