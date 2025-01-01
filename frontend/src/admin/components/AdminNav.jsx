import React from "react";
import { FaSignOutAlt } from "react-icons/fa";

const AdminNav = ({ onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow-md flex justify-between items-center">
      {/* Company Name */}
      <div className="text-lg font-bold">AI Solutions</div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
      >
        <FaSignOutAlt className="text-lg" />
        Logout
      </button>
    </nav>
  );
};

export default AdminNav;
