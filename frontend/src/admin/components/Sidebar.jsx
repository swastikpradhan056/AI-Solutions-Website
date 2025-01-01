import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Helper function to determine if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative">
      {/* Toggle button for mobile view */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-20 p-2 bg-gray-800 text-white rounded-md md:hidden"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white flex flex-col transform transition-transform duration-300 z-10 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-64`}
      >
        <div className="p-4 text-lg font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {[
              { path: "/admin/dashboard", label: "Dashboard" },
              { path: "/admin/inquiries", label: "Inquiries" },
              { path: "/admin/feedback", label: "Feedback" },
              { path: "/admin/solutions", label: "Solutions/Services" },
              { path: "/admin/gallery", label: "Photo Gallery" },
              { path: "/admin/events", label: "Upcoming Events" },
              { path: "/admin/about", label: "About Page" },
              { path: "/admin/admins", label: "Admins" },
            ].map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`block px-3 py-2 rounded ${
                    isActive(path)
                      ? "bg-gray-700 font-semibold"
                      : "hover:bg-gray-700"
                  }`}
                  aria-current={isActive(path) ? "page" : undefined}
                  onClick={() => setIsOpen(false)} // Close sidebar on link click for mobile
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Background overlay for mobile view */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
