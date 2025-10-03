import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Globe } from "lucide-react";
import Modal from "./Modal";

const AirportManagement = ({ airports, setAirports, apiService }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    iataCode: "",
    icaoCode: "",
    countryCode: "",
    city: "",
    country: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isModalOpen) {
      setEditingAirport(null);
      setFormData({
        name: "",
        iataCode: "",
        icaoCode: "",
        countryCode: "",
        city: "",
        country: "",
      });
    }
  }, [isModalOpen]);

  const filtered = airports.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.iataCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => {
    setEditingAirport(null);
    setFormData({
      name: "",
      iataCode: "",
      icaoCode: "",
      countryCode: "",
      city: "",
      country: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (a) => {
    setEditingAirport(a);
    setFormData(a);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAirport) {
        await apiService.updateAirport(editingAirport.id, formData);
        setAirports((prev) =>
          prev.map((x) =>
            x.id === editingAirport.id
              ? { ...formData, id: editingAirport.id }
              : x
          )
        );
      } else {
        const newAirport = await apiService.createAirport(formData);
        setAirports((prev) => [...prev, newAirport]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Error saving airport: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this airport?")) {
      try {
        await apiService.deleteAirport(id);
        setAirports((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        alert("Error deleting airport: " + error.message);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Airport Management
          </h2>
          <p className="text-gray-600">Manage airports in your network</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search airports..."
              className="pl-10 pr-4 py-2 border rounded-lg w-72"
            />
          </div>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                IATA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ICAO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center">
                  <Globe className="w-5 h-5 text-gray-400 mr-3" />
                  {a.name}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                    {a.iataCode}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {a.icaoCode}
                </td>
                <td className="px-6 py-4">{a.city}</td>
                <td className="px-6 py-4">{a.country}</td>
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
        title={editingAirport ? "Edit Airport" : "Add Airport"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Airport Name
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                IATA
              </label>
              <input
                required
                maxLength={3}
                value={formData.iataCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    iataCode: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ICAO
              </label>
              <input
                required
                maxLength={4}
                value={formData.icaoCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    icaoCode: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country Code
              </label>
              <input
                required
                maxLength={2}
                value={formData.countryCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    countryCode: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              required
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
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
              {editingAirport ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AirportManagement;
