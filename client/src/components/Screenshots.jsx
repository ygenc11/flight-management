import React from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Screenshots = () => {
  const screenshots = [
    {
      title: "Modern & User-Friendly Interface",
      description:
        "Intuitive dashboard designed for efficiency with clean navigation and powerful features.",
      image: "/home.png",
      link: "/",
      features: ["Clean Design", "Easy Navigation", "Powerful Tools"],
    },
    {
      title: "Flight Planner Dashboard",
      description:
        "Manage aircraft, crews, airports, and flights from a unified interface.",
      image: "/planner.png",
      link: "/planner",
      features: ["Aircraft Management", "Crew Scheduling", "Airport Database"],
    },
    {
      title: "Interactive Flight Map",
      description:
        "Track all flights in real-time on an interactive global map with live updates.",
      image: "/map.png",
      link: "/map",
      features: ["Real-time Tracking", "Route Visualization", "Flight Details"],
    },
    {
      title: "Scheduler",
      description:
        "Advanced timeline-based scheduling with drag-and-drop functionality.",
      image: "/case.png",
      link: "/scheduler",
      features: ["Timeline View", "Resource Allocation", "Conflict Detection"],
    },
  ];

  return (
    <section className="py-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            See FlightManager in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Explore our intuitive interface and powerful tools designed to
            streamline your flight operations
          </p>
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-blue-500"></div>
          </div>
        </div>

        {/* Grid Layout - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Screenshot Image */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={screenshot.image}
                  alt={screenshot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.classList.add(
                      "flex",
                      "items-center",
                      "justify-center"
                    );
                    e.target.parentElement.innerHTML = `
                      <div class="text-center p-8">
                        <div class="text-4xl mb-2">${
                          index === 0
                            ? "🏠"
                            : index === 1
                            ? "📊"
                            : index === 2
                            ? "🗺️"
                            : "📅"
                        }</div>
                        <p class="text-gray-500 text-sm">${screenshot.title}</p>
                      </div>
                    `;
                  }}
                />
              </div>

              {/* Info Panel */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {screenshot.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {screenshot.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {screenshot.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                    >
                      ✓ {feature}
                    </span>
                  ))}
                </div>

                {/* Try it now button */}
                <Link
                  to={screenshot.link}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-full justify-center"
                >
                  Try it now
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Screenshots;
