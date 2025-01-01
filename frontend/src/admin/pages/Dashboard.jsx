import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation to login on error
import Sidebar from "../components/Sidebar";
import AdminNav from "../components/AdminNav";
import useLogout from "../hook/useLogout";

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    inquiries: 0,
    feedback: 0,
    solutions: 0,
    events: 0,
    photos: 0,
    admins: 0,
  });
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate(); // For navigation in case of error
  const handleLogout = useLogout();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api";

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/statistics`, {
        withCredentials: true, // Ensures cookies are sent with the request
      });

      if (response.data) {
        // Fallback to default 0 if any value is missing
        setStatistics({
          inquiries: response.data.inquiries || 0,
          feedback: response.data.feedback || 0,
          solutions: response.data.solutions || 0,
          events: response.data.events || 0,
          photos: response.data.photos || 0,
          admins: response.data.admins || 0,
        });
      } else {
        setError("Invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);

      // Redirect to login if authentication fails
      if (error.response && error.response.status === 401) {
        navigate("/admin/");
      } else {
        setError("Failed to load statistics. Please try again later.");
        console.error("Failed to load statistics. Please try again later.");
      }
    }
  };

  const handleRoute = (stat) => {
    navigate(`${stat}`);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);
  return (
    <>
      <AdminNav onLogout={handleLogout} />
      <div className="flex flex-row h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
            Admin Dashboard
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                label: "Inquiries",
                value: statistics.inquiries,
                color: "bg-blue-500",
                route: "/admin/inquiries",
              },
              {
                label: "Feedback",
                value: statistics.feedback,
                color: "bg-green-500",
                route: "/admin/feedback",
              },
              {
                label: "Solutions",
                value: statistics.solutions,
                color: "bg-yellow-500",
                route: "/admin/solutions",
              },
              {
                label: "Events",
                value: statistics.events,
                color: "bg-red-500",
                route: "/admin/events",
              },
              {
                label: "Photos",
                value: statistics.photos,
                color: "bg-purple-500",
                route: "/admin/gallery",
              },
              {
                label: "Admins",
                value: statistics.admins,
                color: "bg-orange-500",
                route: "/admin/admins",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`${stat.color} text-white shadow-lg rounded-lg p-6 flex flex-col items-center transform transition hover:scale-105`}
                onClick={() => handleRoute(stat.route)}
              >
                <h2 className="text-lg font-semibold mb-2">{stat.label}</h2>
                <p className="text-4xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
