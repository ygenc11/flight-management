import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Screenshots = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const screenshots = [
    {
      title: "Flight Planner Dashboard",
      description:
        "Manage aircraft, crews, airports, and flights from a unified interface. Add, edit, and organize all your aviation resources efficiently.",
      image: "/planner.png",
      link: "/planner",
      features: ["Aircraft Management", "Crew Scheduling", "Airport Database"],
    },
    {
      title: "Interactive Flight Map",
      description:
        "Track all flights in real-time on an interactive global map. Visualize routes, monitor status, and access detailed flight information instantly.",
      image: "/map.png",
      link: "/map",
      features: ["Real-time Tracking", "Route Visualization", "Flight Details"],
    },
    {
      title: "Case Scheduler",
      description:
        "Advanced timeline-based scheduling with drag-and-drop functionality. Optimize aircraft and crew assignments with visual conflict detection.",
      image: "/case.png",
      link: "/scheduler",
      features: ["Timeline View", "Resource Allocation", "Conflict Detection"],
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + screenshots.length) % screenshots.length
    );
  };

  return (
    <section className="py-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-6">
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

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Screenshot Display */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Screenshot Image */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={screenshots[currentSlide].image}
                alt={screenshots[currentSlide].title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback gradient if image not found
                  e.target.style.display = "none";
                  e.target.parentElement.classList.add(
                    "flex",
                    "items-center",
                    "justify-center"
                  );
                  e.target.parentElement.innerHTML = `
                    <div class="text-center p-12">
                      <div class="text-6xl mb-4">${
                        currentSlide === 0
                          ? "📊"
                          : currentSlide === 1
                          ? "🗺️"
                          : "📅"
                      }</div>
                      <p class="text-gray-500 text-lg">${
                        screenshots[currentSlide].title
                      }</p>
                      <p class="text-gray-400 text-sm mt-2">Screenshot coming soon</p>
                    </div>
                  `;
                }}
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Info Panel */}
            <div className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {screenshots[currentSlide].title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {screenshots[currentSlide].description}
                  </p>
                </div>
                <Link
                  to={screenshots[currentSlide].link}
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  Try it now
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Features List */}
              <div className="flex flex-wrap gap-2 mt-4">
                {screenshots[currentSlide].features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-12 h-3 bg-blue-600"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Navigation (Optional - Desktop only) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-12">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                index === currentSlide
                  ? "ring-4 ring-blue-500 scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-4xl mb-2">
                    {index === 0 ? "📊" : index === 1 ? "🗺️" : "📅"}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {screenshot.title}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Screenshots;
