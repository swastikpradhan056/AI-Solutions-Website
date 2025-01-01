import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AdminNav from "../components/AdminNav";
import useLogout from "../hook/useLogout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleLogout = useLogout();
  const navigate = useNavigate();

  const fetchInquiries = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/inquiries", {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      setInquiries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inquiries:", error);

      // Redirect to login if authentication fails
      if (error.response && error.response.status === 401) {
        navigate("/admin/");
      }
    }
  };

  const deleteInquiry = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/inquiries/${id}`, {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      setInquiries(inquiries.filter((inquiry) => inquiry._id !== id));
      toast.success("Inquiry Deleted Successfully!", {
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Error deleting inquiry!", {
        autoClose: 2000,
      });

      // Optional: Handle authentication errors with a redirect
      if (error.response && error.response.status === 401) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <>
      <AdminNav onLogout={handleLogout} />
      <div className="flex flex-row h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Inquiries</h1>
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
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Phone</th>
                    <th className="p-4 font-semibold">Company</th>
                    <th className="p-4 font-semibold">Job Title</th>
                    <th className="p-4 font-semibold">Job Details</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length > 0 ? (
                    inquiries.map((inquiry) => (
                      <tr
                        key={inquiry._id}
                        className="odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <td className="p-4 text-gray-800">{inquiry.name}</td>
                        <td className="p-4 text-blue-600 underline">
                          <a href={`mailto:${inquiry.email}`}>
                            {inquiry.email}
                          </a>
                        </td>
                        <td className="p-4 text-gray-800">{inquiry.phone}</td>
                        <td className="p-4 text-gray-800">{inquiry.company}</td>
                        <td className="p-4 text-gray-800">
                          {inquiry.jobTitle}
                        </td>
                        <td className="p-4 text-gray-600 truncate max-w-xs">
                          {inquiry.jobDetails}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteInquiry(inquiry._id)}
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
                        colSpan="7"
                        className="p-6 text-center text-gray-500 text-lg font-medium"
                      >
                        No inquiries available
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

export default Inquiries;
