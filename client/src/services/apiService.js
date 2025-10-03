// -------------------------
// API Base URL Configuration
// -------------------------
const API_BASE_URL = "http://localhost:5202/api"; // ASP.NET Core API base URL

// -------------------------
// API Service Functions
// -------------------------
const apiService = {
  // Airport API calls
  async getAirports() {
    try {
      const response = await fetch(`${API_BASE_URL}/airport`);
      if (!response.ok) throw new Error("Failed to fetch airports");
      return await response.json();
    } catch (error) {
      console.error("Error fetching airports:", error);
      return [];
    }
  },

  async createAirport(airportData) {
    try {
      const response = await fetch(`${API_BASE_URL}/airport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(airportData),
      });
      if (!response.ok) throw new Error("Failed to create airport");
      return await response.json();
    } catch (error) {
      console.error("Error creating airport:", error);
      throw error;
    }
  },

  async updateAirport(id, airportData) {
    try {
      const response = await fetch(`${API_BASE_URL}/airport/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(airportData),
      });
      if (!response.ok) throw new Error("Failed to update airport");
    } catch (error) {
      console.error("Error updating airport:", error);
      throw error;
    }
  },

  async deleteAirport(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/airport/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete airport");
    } catch (error) {
      console.error("Error deleting airport:", error);
      throw error;
    }
  },

  // Aircraft API calls
  async getAircraft() {
    try {
      const response = await fetch(`${API_BASE_URL}/aircraft`);
      if (!response.ok) throw new Error("Failed to fetch aircraft");
      const data = await response.json();
      // Transform DTO to match UI expectations
      return data.map((aircraft) => ({
        ...aircraft,
        registration: aircraft.tailNumber, // DTO uses tailNumber, UI expects registration
        capacity: aircraft.seatsCapacity, // DTO uses seatsCapacity, UI expects capacity
      }));
    } catch (error) {
      console.error("Error fetching aircraft:", error);
      return [];
    }
  },

  async createAircraft(aircraftData) {
    try {
      // Transform UI data to DTO format
      const dtoData = {
        model: aircraftData.model,
        tailNumber: aircraftData.registration || aircraftData.tailNumber,
        seatsCapacity: aircraftData.capacity || aircraftData.seatsCapacity,
      };

      const response = await fetch(`${API_BASE_URL}/aircraft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dtoData),
      });
      if (!response.ok) throw new Error("Failed to create aircraft");
      return await response.json();
    } catch (error) {
      console.error("Error creating aircraft:", error);
      throw error;
    }
  },

  async updateAircraft(id, aircraftData) {
    try {
      // Transform UI data to DTO format
      const dtoData = {
        model: aircraftData.model,
        tailNumber: aircraftData.registration || aircraftData.tailNumber,
        seatsCapacity: aircraftData.capacity || aircraftData.seatsCapacity,
      };

      const response = await fetch(`${API_BASE_URL}/aircraft/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dtoData),
      });
      if (!response.ok) throw new Error("Failed to update aircraft");
    } catch (error) {
      console.error("Error updating aircraft:", error);
      throw error;
    }
  },

  async deleteAircraft(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/aircraft/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete aircraft");
    } catch (error) {
      console.error("Error deleting aircraft:", error);
      throw error;
    }
  },

  // Crew API calls
  async getCrew() {
    try {
      const response = await fetch(`${API_BASE_URL}/crew`);
      if (!response.ok) throw new Error("Failed to fetch crew");
      return await response.json();
    } catch (error) {
      console.error("Error fetching crew:", error);
      return [];
    }
  },

  async createCrew(crewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/crew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crewData),
      });
      if (!response.ok) throw new Error("Failed to create crew member");
      return await response.json();
    } catch (error) {
      console.error("Error creating crew member:", error);
      throw error;
    }
  },

  async updateCrew(id, crewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/crew/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crewData),
      });
      if (!response.ok) throw new Error("Failed to update crew member");
    } catch (error) {
      console.error("Error updating crew member:", error);
      throw error;
    }
  },

  async deleteCrew(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/crew/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete crew member");
    } catch (error) {
      console.error("Error deleting crew member:", error);
      throw error;
    }
  },

  // Flight API calls
  async getFlights() {
    try {
      const response = await fetch(`${API_BASE_URL}/flight`);
      if (!response.ok) throw new Error("Failed to fetch flights");
      return await response.json();
    } catch (error) {
      console.error("Error fetching flights:", error);
      return [];
    }
  },

  async createFlight(flightData) {
    try {
      const response = await fetch(`${API_BASE_URL}/flight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flightData),
      });
      if (!response.ok) throw new Error("Failed to create flight");
      return await response.json();
    } catch (error) {
      console.error("Error creating flight:", error);
      throw error;
    }
  },

  async updateFlight(id, flightData) {
    try {
      const response = await fetch(`${API_BASE_URL}/flight/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flightData),
      });
      if (!response.ok) throw new Error("Failed to update flight");
    } catch (error) {
      console.error("Error updating flight:", error);
      throw error;
    }
  },

  async deleteFlight(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/flight/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete flight");
    } catch (error) {
      console.error("Error deleting flight:", error);
      throw error;
    }
  },
};

export default apiService;
