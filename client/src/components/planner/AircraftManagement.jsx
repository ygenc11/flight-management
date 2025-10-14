import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Plane, Search } from "lucide-react";
import Modal from "./Modal";

const AircraftManagement = ({ aircraft, setAircraft, apiService }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    model: "",
    tailNumber: "",
    capacity: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!isModalOpen) setEditing(null);
  }, [isModalOpen]);

  const openCreate = () => {
    setEditing(null);
    setFormData({ model: "", tailNumber: "", capacity: 0, isActive: true });
    setIsModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setFormData(a);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const aircraftData = {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
      };

      if (editing) {
        await apiService.updateAircraft(editing.id, aircraftData);
        setAircraft((prev) =>
          prev.map((x) =>
            x.id === editing.id ? { ...aircraftData, id: editing.id } : x
          )
        );
      } else {
        const newAircraft = await apiService.createAircraft(aircraftData);
        setAircraft((prev) => [...prev, newAircraft]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Error saving aircraft: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this aircraft?")) {
      try {
        await apiService.deleteAircraft(id);
        setAircraft((prev) => prev.filter((x) => x.id !== id));
      } catch (error) {
        alert("Error deleting aircraft: " + error.message);
      }
    }
  };

  const toggleStatus = (id) =>
    setAircraft((prev) =>
      prev.map((x) => (x.id === id ? { ...x, isActive: !x.isActive } : x))
    );

  const filteredAircraft = aircraft.filter(
    (a) =>
      a.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tailNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Aircraft Management</h2>
          <p className="text-gray-600">Manage fleet</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            Active: {aircraft.filter((a) => a.isActive).length}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-3 py-1.5 text-sm border rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            title="Add Aircraft"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tail Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {filteredAircraft.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center">
                  <Plane className="w-5 h-5 text-gray-400 mr-3" />
                  {a.model}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs">
                    {a.tailNumber}
                  </span>
                </td>
                <td className="px-6 py-4">{a.capacity}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(a.id)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      a.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {a.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEdit(a)}
                    className="text-blue-600 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Edit Aircraft" : "Add Aircraft"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Model</label>
            <input
              required
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Registration</label>
            <input
              required
              value={formData.registration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registration: e.target.value.toUpperCase(),
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Capacity</label>
            <input
              required
              type="number"
              min={1}
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <input
              id="active"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label htmlFor="active" className="ml-2 text-sm">
              Aircraft is active
            </label>
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

export default AircraftManagement;
