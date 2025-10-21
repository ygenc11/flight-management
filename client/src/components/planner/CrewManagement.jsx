import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, User, Search } from "lucide-react";
import Modal from "./Modal";
import Pagination from "./Pagination";

const CrewManagement = ({
  crew,
  setCrew,
  apiService,
  isActive,
  isFromNavbar,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
    // If coming from navbar, always start at page 1
    if (isFromNavbar) {
      console.log("🔵 Crew: Fresh navigation from navbar - starting page 1");
      return 1;
    }
    // Otherwise (F5 refresh), restore from localStorage
    const saved = localStorage.getItem("crewManagementPage");
    const page = saved ? parseInt(saved, 10) : 1;
    console.log("🔵 Crew: Loading page from localStorage:", page);
    return page;
  });
  const itemsPerPage = 8;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    licenseNumber: "",
  });

  useEffect(() => {
    if (!isModalOpen) setEditing(null);
  }, [isModalOpen]);

  // Save current page to localStorage
  useEffect(() => {
    console.log("🟢 Crew: Saving page to localStorage:", currentPage);
    localStorage.setItem("crewManagementPage", currentPage.toString());
  }, [currentPage]);

  // Reset to page 1 when tab becomes active (but not on first mount)
  const prevActiveRef = React.useRef(isActive);
  useEffect(() => {
    // Only reset if tab was inactive and now became active (tab switch)
    if (isActive && !prevActiveRef.current) {
      console.log("🔄 Crew: Tab switched - resetting to page 1");
      setCurrentPage(1);
    }
    prevActiveRef.current = isActive;
  }, [isActive]);

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

  const toggleStatus = async (id) => {
    const crewMember = crew.find((c) => c.id === id);
    if (!crewMember) return;

    const newIsActive = !crewMember.isActive;

    // Optimistic update
    setCrew((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: newIsActive } : c))
    );

    try {
      // Backend update
      await apiService.updateCrew(id, {
        ...crewMember,
        isActive: newIsActive,
      });
    } catch (error) {
      // Rollback on error
      setCrew((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !newIsActive } : c))
      );
      alert("Failed to update crew status: " + error.message);
    }
  };

  const badge = (role) => {
    const r = role.toLowerCase();
    if (r.includes("captain")) return "bg-gray-100 text-gray-700";
    if (r.includes("first")) return "bg-gray-100 text-gray-700";
    if (r.includes("attendant")) return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  // Filter crew by search term
  const filteredCrew = crew.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group crew by role
  const pilots = filteredCrew.filter(
    (c) =>
      c.role.toLowerCase().includes("pilot") &&
      !c.role.toLowerCase().includes("co")
  );
  const coPilots = filteredCrew.filter((c) =>
    c.role.toLowerCase().includes("copilot")
  );
  const attendants = filteredCrew.filter((c) =>
    c.role.toLowerCase().includes("attendant")
  );

  // Pagination
  const totalPages = Math.ceil(filteredCrew.length / itemsPerPage);
  const validCurrentPage = Math.min(currentPage, totalPages || 1);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedCrew = filteredCrew.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm) {
      console.log("🔴 Crew: Search changed, resetting to page 1");
      setCurrentPage(1);
      localStorage.setItem("crewManagementPage", "1");
    }
  }, [searchTerm]);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Crew Management</h2>
          <p className="text-gray-600">Manage crew and licenses</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">
            Active: {crew.filter((c) => c.isActive).length}
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
            title="Add Crew Member"
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                License
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
            {paginatedCrew.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  {c.firstName} {c.lastName}
                </td>
                <td className="px-6 py-4">
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
                    onClick={() => toggleStatus(c.id)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      c.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
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
        <Pagination
          currentPage={validCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCrew.length}
          itemsPerPage={itemsPerPage}
        />
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
