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
    const processedFlights = item.flights.map((flight) => {
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
        width = flightDurationHours * slotWidth;
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
        departure: departureDate.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        arrival: arrivalDate.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
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
