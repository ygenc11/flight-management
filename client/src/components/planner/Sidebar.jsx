import React from "react";
import {
  MapPin,
  Plane,
  Users,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "airports", label: "Airports", icon: MapPin },
    { id: "aircraft", label: "Aircraft", icon: Plane },
    { id: "crew", label: "Crew", icon: Users },
    { id: "flights", label: "Flights", icon: Calendar },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 h-screen shadow-xl flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Flight Planner</h1>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border-r-4 border-blue-400"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-400">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
