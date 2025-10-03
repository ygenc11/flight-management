import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, User } from "lucide-react";
import Modal from "./Modal";

const CrewManagement = ({ crew, setCrew, apiService }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    licenseNumber: "",
  });

  useEffect(() => {
    if (!isModalOpen) setEditing(null);
  }, [isModalOpen]);

  const openCreate = () => {
    setEditing(null);
    setFormData({ firstName: "", lastName: "", role: "", licenseNumber: "" });
    setIsModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setFormData(c);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await apiService.updateCrew(editing.id, formData);
        setCrew((prev) =>
          prev.map((x) =>
            x.id === editing.id ? { ...formData, id: editing.id } : x
          )
        );
      } else {
        const newCrew = await apiService.createCrew(formData);
        setCrew((prev) => [...prev, newCrew]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Error saving crew member: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this crew member?")) {
      try {
        await apiService.deleteCrew(id);
        setCrew((prev) => prev.filter((x) => x.id !== id));
      } catch (error) {
        alert("Error deleting crew member: " + error.message);
      }
    }
  };

  const badge = (role) => {
    const r = role.toLowerCase();
    if (r.includes("captain")) return "bg-purple-100 text-purple-800";
    if (r.includes("first")) return "bg-blue-100 text-blue-800";
    if (r.includes("attendant")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Crew Management</h2>
          <p className="text-gray-600">Manage crew and licenses</p>
        </div>
        <div>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                License
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {crew.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  {c.firstName} {c.lastName}
                </td>
                <td className={`px-6 py-4`}>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${badge(
                      c.role
                    )}`}
                  >
                    {c.role}
                  </span>
                </td>
                <td className="px-6 py-4">{c.licenseNumber}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-blue-600 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
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
        title={editing ? "Edit Crew" : "Add Crew"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <input
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">License Number</label>
            <input
              required
              value={formData.licenseNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  licenseNumber: e.target.value.toUpperCase(),
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
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

export default CrewManagement;
