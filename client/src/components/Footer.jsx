import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { SiPlanetscale } from "react-icons/si";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 w-fit cursor-pointer"
            >
              <SiPlanetscale className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                FlightManager
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              Modern aviation management platform for efficient flight
              operations and resource planning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/planner"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Flight Planner
                </a>
              </li>
              <li>
                <a
                  href="/map"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Flight Map
                </a>
              </li>
              <li>
                <a
                  href="/scheduler"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  Flight Scheduler
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href="#"
                className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-700" />
              </a>
              <a
                href="#"
                className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-700" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© {currentYear} FlightManager. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
