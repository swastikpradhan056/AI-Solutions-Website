import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      // Send POST request with credentials
      const response = await axios.post(
        `${API_URL}/admin/login`, // Ensure this is the correct endpoint
        { email, password },
        { withCredentials: true } // Include cookies in the request
      );

      // Extract admin info from response
      const { admin } = response.data;
      localStorage.setItem("adminDetails", JSON.stringify(admin)); // Store admin details in localStorage

      // Show success toast
      toast.success("Login successful!", {
        autoClose: 2000, // Toast will close automatically after 2 seconds
      });

      // Wait for the toast to disappear before navigating
      setTimeout(() => {
        navigate("/admin/dashboard"); // Navigate to dashboard after 2 seconds
      }, 2000); // 2-second delay to match toast display duration
    } catch (err) {
      // Show success toast
      toast.error("Login Failed!", {
        autoClose: 2000, // Toast will close automatically after 2 seconds
      });
      setError(err.response?.data?.message || "Login failed");
      console.error(
        "Error during login:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer /> {/* This renders the toast notifications */}
    </div>
  );
};

export default LoginPage;
