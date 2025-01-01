import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../components/AdminNav";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useLogout from "../hook/useLogout";
import { useNavigate } from "react-router-dom";

const AboutAdmin = () => {
  const [about, setAbout] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const handleLogout = useLogout();
  const navigate = useNavigate();

  // Fetch about data from the server
  const fetchAbout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/about", {
        withCredentials: true,
      });
      setAbout(response.data || { title: "", content: "" });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching about content:", error);
      if (error.response && error.response.status === 401) {
        navigate("/admin/");
      }
    }
  };

  // Save updated about data to the server
  const handleSave = async () => {
    try {
      await axios.put("http://localhost:3000/api/about", about, {
        withCredentials: true,
      });
      toast.success("About Section Updated!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Error Updating About Section!", { autoClose: 2000 });
      console.error("Error updating about content:", error);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // Handle title and content updates separately
  const handleTitleChange = (e) => {
    setAbout((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (e) => {
    setAbout((prev) => ({ ...prev, content: e.target.value }));
  };

  return (
    <>
      <AdminNav onLogout={handleLogout} />
      <div className="flex flex-row h-screen bg-gray-100">
        <Sidebar />
        <div className="p-8 w-full">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
              Edit About Us Section
            </h1>
            {loading ? (
              <p className="text-gray-500 text-center">Loading...</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="about-title"
                    className="block text-lg font-medium text-gray-700 mb-2"
                  >
                    About Title
                  </label>
                  <input
                    id="about-title"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={about.title}
                    onChange={handleTitleChange}
                    placeholder="Enter the about title"
                  />
                </div>
                <div>
                  <label
                    htmlFor="about-content"
                    className="block text-lg font-medium text-gray-700 mb-2"
                  >
                    About Content
                  </label>
                  <textarea
                    id="about-content"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40"
                    value={about.content}
                    onChange={handleContentChange}
                    placeholder="Enter the about content"
                  />
                </div>
              </div>
            )}
            <button
              onClick={handleSave}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default AboutAdmin;
