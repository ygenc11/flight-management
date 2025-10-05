import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Clock } from "lucide-react";
import Modal from "./Modal";
import { isoToLocalInput, localInputToIso } from "../../utils/dateHelpers";

const FlightsManagement = ({
  flights,
  setFlights,
  aircraft,
  airports,
  crew,
  apiService,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    flightNumber: "",
    departureTime: "",
    arrivalTime: "",
    aircraftId: "",
    departureAirportId: "",
    arrivalAirportId: "",
    crewMembers: [],
  });

  useEffect(() => {
    if (!isModalOpen) setEditing(null);
  }, [isModalOpen]);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      flightNumber: "",
      departureTime: "",
      arrivalTime: "",
      aircraftId: "",
      departureAirportId: "",
      arrivalAirportId: "",
      crewMembers: [],
    });
    setIsModalOpen(true);
  };

  const openEdit = (f) => {
    setEditing(f);
    setFormData({
      ...f,
      aircraftId: f.aircraftId,
      departureAirportId: f.departureAirportId,
      arrivalAirportId: f.arrivalAirportId,
      crewMembers: f.crewMembers.map((c) => c.id),
      departureTime: isoToLocalInput(f.departureTime),
      arrivalTime: isoToLocalInput(f.arrivalTime),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCrew = crew.filter((c) =>
        formData.crewMembers.includes(c.id)
      );
      const payload = {
        flightNumber: formData.flightNumber,
        aircraftId: parseInt(formData.aircraftId),
        departureAirportId: parseInt(formData.departureAirportId),
        arrivalAirportId: parseInt(formData.arrivalAirportId),
        departureTime: localInputToIso(formData.departureTime),
        arrivalTime: localInputToIso(formData.arrivalTime),
        crewMemberIds: formData.crewMembers, // Backend expects crew IDs array
      };

      if (editing) {
        const updatedFlight = await apiService.updateFlight(
          editing.id,
          payload
        );
        setFlights((prev) =>
          prev.map((x) => (x.id === editing.id ? updatedFlight : x))
        );
      } else {
        const newFlight = await apiService.createFlight(payload);
        setFlights((prev) => [...prev, newFlight]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Error saving flight: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this flight?")) {
      try {
        await apiService.deleteFlight(id);
        setFlights((prev) => prev.filter((x) => x.id !== id));
      } catch (error) {
        alert("Error deleting flight: " + error.message);
      }
    }
  };

  const lookupAirport = (id) =>
    airports.find((a) => a.id === id)?.iataCode || "-";
  const lookupAircraft = (id) => {
    const air = aircraft.find((a) => a.id === id);
    return air ? `${air.tailNumber} - ${air.model}` : "-";
  };

  // Group flights by status
  const planned = flights.filter(
    (f) => !f.status || f.status.toLowerCase() === "planned"
  );
  const delayed = flights.filter(
    (f) => f.status && f.status.toLowerCase() === "delayed"
  );
  const departed = flights.filter(
    (f) => f.status && f.status.toLowerCase() === "departed"
  );
  const arrived = flights.filter(
    (f) => f.status && f.status.toLowerCase() === "arrived"
  );
  const cancelled = flights.filter(
    (f) => f.status && f.status.toLowerCase() === "cancelled"
  );

  const renderFlightRow = (f) => (
    <tr key={f.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 font-medium">{f.flightNumber}</td>
      <td className="px-6 py-4 text-sm">
        <div className="font-medium">{lookupAirport(f.departureAirportId)}</div>
        <div className="text-gray-500">
          <Clock className="inline w-3 h-3 mr-1" />
          {new Date(f.departureTime).toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="font-medium">{lookupAirport(f.arrivalAirportId)}</div>
        <div className="text-gray-500">
          <Clock className="inline w-3 h-3 mr-1" />
          {new Date(f.arrivalTime).toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4">{lookupAircraft(f.aircraftId)}</td>
      <td className="px-6 py-4 text-sm">
        {(f.crewMembers || []).length > 0 ? (
          <div className="space-y-1">
            {f.crewMembers.map((c) => (
              <div key={c.id} className="text-gray-700">
                <span className="font-medium">
                  {c.firstName} {c.lastName}
                </span>
                <span className="text-xs text-gray-500 ml-1">({c.role})</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 italic">No crew assigned</span>
        )}
      </td>
      <td className="px-6 py-4">
        <button onClick={() => openEdit(f)} className="text-blue-600 mr-3">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(f.id)} className="text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Flights</h2>
          <p className="text-gray-600">Plan flights and assign crew/aircraft</p>
        </div>
        <div>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Flight
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Flight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Departure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Arrival
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aircraft
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Crew
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {/* Planned Flights Section */}
            {planned.length > 0 && (
              <>
                <tr className="bg-gray-100">
                  <td
                    colSpan="6"
                    className="px-6 py-2 text-sm font-semibold text-gray-700"
                  >
                    Planned ({planned.length})
                  </td>
                </tr>
                {planned.map(renderFlightRow)}
              </>
            )}

            {/* Departed Flights Section */}
            {departed.length > 0 && (
              <>
                <tr className="bg-gray-100">
                  <td
                    colSpan="6"
                    className="px-6 py-2 text-sm font-semibold text-gray-700"
                  >
                    Departed ({departed.length})
                  </td>
                </tr>
                {departed.map(renderFlightRow)}
              </>
            )}

            {/* Delayed Flights Section */}
            {delayed.length > 0 && (
              <>
                <tr className="bg-gray-100">
                  <td
                    colSpan="6"
                    className="px-6 py-2 text-sm font-semibold text-gray-700"
                  >
                    Delayed ({delayed.length})
                  </td>
                </tr>
                {delayed.map(renderFlightRow)}
              </>
            )}

            {/* Arrived Flights Section */}
            {arrived.length > 0 && (
              <>
                <tr className="bg-gray-100">
                  <td
                    colSpan="6"
                    className="px-6 py-2 text-sm font-semibold text-gray-700"
                  >
                    Arrived ({arrived.length})
                  </td>
                </tr>
                {arrived.map(renderFlightRow)}
              </>
            )}

            {/* Cancelled Flights Section */}
            {cancelled.length > 0 && (
              <>
                <tr className="bg-gray-100">
                  <td
                    colSpan="6"
                    className="px-6 py-2 text-sm font-semibold text-gray-700"
                  >
                    Cancelled ({cancelled.length})
                  </td>
                </tr>
                {cancelled.map(renderFlightRow)}
              </>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Edit Flight" : "Create Flight"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Flight Number</label>
            <input
              required
              value={formData.flightNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  flightNumber: e.target.value.toUpperCase(),
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Departure Time
              </label>
              <input
                required
                type="datetime-local"
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Arrival Time</label>
              <input
                required
                type="datetime-local"
                value={formData.arrivalTime}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalTime: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Aircraft</label>
              <select
                required
                value={formData.aircraftId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aircraftId: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select aircraft</option>
                {aircraft.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.tailNumber} - {a.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Departure Airport
              </label>
              <select
                required
                value={formData.departureAirportId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    departureAirportId: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.iataCode} - {a.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Arrival Airport
              </label>
              <select
                required
                value={formData.arrivalAirportId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    arrivalAirportId: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.iataCode} - {a.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Assign Crew</label>
            <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-auto border rounded-lg p-2">
              {crew.map((c) => (
                <label key={c.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.crewMembers.includes(c.id)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...formData.crewMembers, c.id]
                        : formData.crewMembers.filter((id) => id !== c.id);
                      setFormData({ ...formData, crewMembers: next });
                    }}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">
                    {c.firstName} {c.lastName} ({c.role})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FlightsManagement;
