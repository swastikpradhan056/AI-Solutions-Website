import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Helper function to determine if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar w-full bg-[#055C9D] border-b border-[#FFD700] fixed top-0 flex justify-center items-center z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand Name */}
        <div className="text-2xl font-bold">
          <Link to="/" className="text-white">
            AI Solutions
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          {[
            { path: "/", label: "Home" },
            { path: "/solutions", label: "Solutions" },
            { path: "/about", label: "About" },
            { path: "/contact-us", label: "Contact Us" },
            { path: "/photo-gallery", label: "Photo Gallery" },
            { path: "/feedback", label: "Feedback" },
            { path: "/upcoming-events", label: "Events" },
          ].map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`hover:text-gray-300 px-3 py-2 rounded-md ${
                  isActive(path)
                    ? "bg-[#003060] font-semibold text-white"
                    : "text-white"
                }`}
                aria-current={isActive(path) ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <ul className="md:hidden bg-gray-700 space-y-2 px-4 py-2 fixed right-4 top-12">
          {[
            { path: "/", label: "Home" },
            { path: "/solutions", label: "Solutions" },
            { path: "/about", label: "About" },
            { path: "/contact-us", label: "Contact Us" },
            { path: "/photo-gallery", label: "Photo Gallery" },
            { path: "/feedback", label: "Feedback" },
            { path: "/upcoming-events", label: "Upcoming Events" },
          ].map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-md ${
                  isActive(path)
                    ? "bg-gray-600 font-semibold"
                    : "text-gray-300 hover:text-gray-400"
                }`}
                aria-current={isActive(path) ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
