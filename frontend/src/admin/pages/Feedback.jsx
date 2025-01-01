import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AdminNav from "../components/AdminNav";
import useLogout from "../hook/useLogout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const FeedbackAdmin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleLogout = useLogout();
  const navigate = useNavigate();

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/feedback", {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);

      // Redirect to login if authentication fails
      if (error.response && error.response.status === 401) {
        navigate("/admin/");
      }
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/feedback/${id}`, {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
      toast.success("Feedback Deleted Successfully!", {
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Error deleting feedback!", {
        autoClose: 2000,
      });

      // Optional: Handle authentication errors with a redirect
      if (error.response && error.response.status === 401) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <>
      <AdminNav onLogout={handleLogout} />
      <div className="flex flex-row h-screen bg-gray-50">
        <Sidebar />
        <div className="p-8 flex-1">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
            Customer Feedback
          </h1>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Rating</th>
                    <th className="p-4 font-semibold">Comment</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                      <tr
                        key={feedback._id}
                        className="odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <td className="p-4 text-gray-800">{feedback.name}</td>
                        <td className="p-4 text-gray-600">{feedback.rating}</td>
                        <td className="p-4 text-gray-600 truncate max-w-xs">
                          {feedback.comment}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteFeedback(feedback._id)}
                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-6 text-center text-gray-500 text-lg font-medium"
                      >
                        No feedback available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <ToastContainer /> {/* This renders the toast notifications */}
      </div>
    </>
  );
};

export default FeedbackAdmin;
