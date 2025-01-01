import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "motion/react";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    jobTitle: "",
    jobDetails: "",
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/inquiries`, formData);
      setSuccess("Your inquiry has been submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        country: "",
        jobTitle: "",
        jobDetails: "",
      });
      setError(null);
      // Show success toast
      toast.success("Inquiry submitted successfully!", {
        autoClose: 2000, // Toast will close automatically after 2 seconds
        top: "200px",
      });
    } catch (err) {
      setError("Failed to submit your inquiry. Please try again.");
      setSuccess(null);
      toast.error("Failed to Submit!", {
        autoClose: 2000, // Toast will close automatically after 2 seconds
      });
    }
  };

  return (
    <>
      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-gradient-to-br from-[#0E86D4] via-[#055C9D] to-[#0E86D4] text-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 container mx-auto px-6 py-16 gap-12">
          {/* Hero Section */}
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-8">
              Contact Us
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              We’d love to hear from you! Whether you have a question, need
              assistance, or want to explore our services, feel free to reach
              out using the form.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h11M9 21l-5-5m0 0l5-5m-5 5h16"
                  />
                </svg>
                <span>spradhan@ismt.edu.np</span>
              </div>
              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h11M9 21l-5-5m0 0l5-5m-5 5h16"
                  />
                </svg>
                <span>+977 984-3122985</span>
              </div>
              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h11M9 21l-5-5m0 0l5-5m-5 5h16"
                  />
                </svg>
                <span>Chitwan, Bharatpur - 6, 44211</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white bg-opacity-30 text-gray-800 rounded-3xl shadow-2xl p-10 mt-12 backdrop-blur-md">
            {success && (
              <p className="text-green-900 font-bold mb-4 text-xl">{success}</p>
            )}
            {error && (
              <p className="text-red-900 font-bold mb-4 text-xl">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Job Details
                </label>
                <textarea
                  name="jobDetails"
                  value={formData.jobDetails}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </motion.div>
      <ToastContainer /> {/* This renders the toast notifications */}
    </>
  );
};

export default ContactUs;
