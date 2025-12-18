import React from "react";
import { Calendar, Map, Plane, BarChart3 } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Flight Scheduling",
      description:
        "Plan and optimize your fleet operations with intelligent scheduling algorithms. Manage aircraft assignments, crew rotations, and maintenance windows effortlessly.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Map,
      title: "Real-time Flight Tracking",
      description:
        "Monitor all flights on interactive maps with live updates. Track flight status, routes, and delays in real-time with beautiful visualizations.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Plane,
      title: "Fleet Management",
      description:
        "Manage aircraft, crews, and airports from a single unified dashboard. Add, update, and track all your aviation assets with ease.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Track KPIs and optimize routes with data-driven insights. Analyze flight patterns, delays, and operational efficiency metrics.",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Aviation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Everything you need to manage your flight operations efficiently and
            effectively
          </p>
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-blue-500"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Icon Container */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Border */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Ready to streamline your flight operations?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Explore All Features →
          </button>
        </div>

        {/* Section Divider */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default Features;
