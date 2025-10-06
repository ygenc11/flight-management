/**
 * Process flight data and calculate positions on timeline
 * @param {Array} items - Aircraft or crew items with flights
 * @param {Date} referenceDate - The reference date for timeline
 * @param {number} scrollOffset - Scroll offset (days, weeks, or months)
 * @param {string} viewMode - View mode (daily, weekly, monthly)
 * @returns {Array} Processed items with positioned flights
 */
export const processFlightData = (
  items,
  referenceDate,
  scrollOffset,
  viewMode
) => {
  const slotWidth =
    viewMode === "daily" ? 120 : viewMode === "weekly" ? 200 : 100;

  // Calculate timeline start date
  const timelineStart = new Date(referenceDate);
  timelineStart.setHours(0, 0, 0, 0);

  if (viewMode === "daily") {
    timelineStart.setDate(timelineStart.getDate() - 2 + scrollOffset);
  } else if (viewMode === "weekly") {
    timelineStart.setDate(timelineStart.getDate() - 14 + scrollOffset * 7);
  } else {
    timelineStart.setDate(1);
    timelineStart.setMonth(timelineStart.getMonth() - 2 + scrollOffset);
  }

  return items.map((item) => {
    // Filter and validate flights
    const validFlights = (item.flights || []).filter((flight) => {
      if (!flight || !flight.departureTime || !flight.arrivalTime) {
        console.warn("Invalid flight data:", flight);
        return false;
      }

      const departureDate = new Date(flight.departureTime);
      const arrivalDate = new Date(flight.arrivalTime);

      // Check if dates are valid
      if (isNaN(departureDate.getTime()) || isNaN(arrivalDate.getTime())) {
        console.warn("Invalid flight dates for", flight.flightNumber);
        return false;
      }

      // Check if arrival is after departure
      if (arrivalDate <= departureDate) {
        console.warn(
          `Invalid flight dates for ${flight.flightNumber}: arrival before or equal to departure`
        );
        return false;
      }

      return true;
    });

    const processedFlights = validFlights.map((flight) => {
      const departureDate = new Date(flight.departureTime);
      const arrivalDate = new Date(flight.arrivalTime);

      // Calculate offset from timeline start
      let startOffset;
      let width;

      if (viewMode === "daily") {
        // For daily view, calculate in hours
        const hoursFromStart =
          (departureDate - timelineStart) / (1000 * 60 * 60);
        const flightDurationHours =
          (arrivalDate - departureDate) / (1000 * 60 * 60);

        startOffset = hoursFromStart * slotWidth;
        width = Math.max(flightDurationHours * slotWidth, 20); // Minimum width
      } else if (viewMode === "weekly") {
        // For weekly view, calculate in days
        const daysFromStart =
          (departureDate - timelineStart) / (1000 * 60 * 60 * 24);
        const flightDurationDays =
          (arrivalDate - departureDate) / (1000 * 60 * 60 * 24);

        startOffset = daysFromStart * slotWidth;
        width = Math.max(flightDurationDays * slotWidth, 20); // Minimum width for visibility
      } else {
        // For monthly view, calculate in days
        const daysFromStart =
          (departureDate - timelineStart) / (1000 * 60 * 60 * 24);
        const flightDurationDays =
          (arrivalDate - departureDate) / (1000 * 60 * 60 * 24);

        startOffset = daysFromStart * slotWidth;
        width = Math.max(flightDurationDays * slotWidth, 15); // Minimum width for visibility
      }

      return {
        ...flight,
        startOffset: Math.round(startOffset),
        width: Math.round(width),
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

    return {
      ...item,
      flights: processedFlights,
    };
  });
};

/**
 * Load flight data from JSON
 * @returns {Promise<Object>} Flight data with aircraft and crew
 */
export const loadFlightData = async () => {
  try {
    const response = await fetch("/src/data/flightData.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading flight data:", error);
    return { aircraft: [], crew: [] };
  }
};
