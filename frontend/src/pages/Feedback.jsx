import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "motion/react";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api";

  // Fetch feedback on component mount
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${API_URL}/feedback`);
        setFeedbackList(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch feedback.");
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle star rating selection
  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  // Submit feedback form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/feedback`, formData);
      setFeedbackList((prev) => [...prev, response.data]);
      setFormData({ name: "", comment: "", rating: 0 });
      setSuccess("Feedback submitted successfully!");
      setTimeout(() => setSuccess(null), 3000);

      toast.success("Feedback submitted successfully!", {
        autoClose: 2000, // Toast will close automatically after 2 seconds
      });
    } catch (err) {
      setError("Failed to submit feedback.");
      setTimeout(() => setError(null), 3000);

      toast.error("Failed to submit feedback!", {
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
        className="min-h-screen bg-gradient-to-br from-[#68BBE3] via-[#055C9D] to-[#68BBE3] text-white"
      >
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-teal-500 to-blue-600 h-[50vh] flex items-center justify-center text-center">
          <div className="text-center text-white px-6">
            <h1 className="text-5xl font-extrabold text-white mb-4">
              We Value Your Feedback
            </h1>
            <p className="text-lg max-w-3xl mx-auto text-gray-300">
              Share your thoughts with us to help improve our services and
              create memorable experiences.
            </p>
          </div>
        </div>
        {/* Feedback Form */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white bg-opacity-30 text-gray-800 rounded-3xl shadow-2xl p-10 mt-12 backdrop-blur-md ">
            {success && (
              <p className="text-green-900 font-bold mb-4 text-xl">{success}</p>
            )}
            {error && (
              <p className="text-red-900 font-bold mb-4 text-xl">{error}</p>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="comment"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-3xl ${
                        star <= formData.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      } transition`}
                      onClick={() => handleRatingChange(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              >
                Submit Feedback
              </button>
            </form>
          </div>

          {/* Feedback List */}
          <div className="flex flex-col md:flex-row items-center mt-12 flex-wrap justify-center gap-4">
            {loading ? (
              <p className="text-center text-gray-400">Loading feedback...</p>
            ) : (
              feedbackList.map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-[#003060] rounded-lg shadow-lg p-6 transform transition hover:shadow-xl w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {feedback.name}
                  </h3>
                  <p className="text-yellow-500 text-xl">
                    {"★".repeat(feedback.rating) +
                      "☆".repeat(5 - feedback.rating)}
                  </p>
                  <p className="text-white mt-2">{feedback.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
      <ToastContainer /> {/* This renders the toast notifications */}
    </>
  );
};

export default Feedback;
