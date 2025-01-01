import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AdminNav from "../components/AdminNav";
import useLogout from "../hook/useLogout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PhotoGalleryAdmin = () => {
  const [photos, setPhotos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const handleLogout = useLogout();
  const navigate = useNavigate();

  const imageURL =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${API_URL}/photos`, {
        withCredentials: true,
      });
      setPhotos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching photos:", error);
      if (error.response && error.response.status === 401) {
        navigate("/admin/");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("eventDate", formData.eventDate);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingId) {
        await axios.put(`${API_URL}/photos/${editingId}`, formDataToSend, {
          withCredentials: true,
        });
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/photos`, formDataToSend, {
          withCredentials: true,
        });
      }

      setFormData({
        title: "",
        description: "",
        eventDate: "",
        image: null,
      });
      toast.success("Photo Gallery Updated!", {
        autoClose: 2000, // Toast will close automatically after 2 seconds
      });
      fetchPhotos();
    } catch (error) {
      console.error("Error saving photo:", error);
      toast.error("Error Updating!", {
        autoClose: 2000, // Toast will close automatically after 2 seconds
      });
    }
  };

  const handleEdit = (photo) => {
    setEditingId(photo._id);
    setFormData({
      title: photo.title,
      description: photo.description,
      eventDate: photo.eventDate,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/photos/${id}`, {
        withCredentials: true,
      });
      fetchPhotos();
      toast.success("Photo Deleted!", {
        autoClose: 2000, // Toast will close automatically after 2 seconds
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Error Deleting!", {
        autoClose: 2000, // Toast will close automatically after 2 seconds
      });
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <>
      <AdminNav onLogout={handleLogout} />
      <div className="flex flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <div className="p-6 w-full">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Photo Gallery
            </h1>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                <thead>
                  <tr>
                    <th className="border p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold">
                      Preview
                    </th>
                    <th className="border p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold">
                      Title
                    </th>
                    <th className="border p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold">
                      Description
                    </th>
                    <th className="border p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold">
                      Event Date
                    </th>
                    <th className="border p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {photos.length > 0 ? (
                    photos.map((photo) => (
                      <tr key={photo._id} className="hover:bg-gray-50">
                        <td className="border p-4">
                          {photo.imageUrl ? (
                            <img
                              src={`${imageURL}${photo.imageUrl}`}
                              alt={photo.title}
                              className="w-16 h-16 object-cover rounded-lg shadow-md"
                            />
                          ) : (
                            <span className="text-gray-500 italic">
                              No Image
                            </span>
                          )}
                        </td>
                        <td className="border p-4">{photo.title}</td>
                        <td className="border p-4">{photo.description}</td>
                        <td className="border p-4">{photo.eventDate}</td>
                        <td className="border p-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(photo)}
                              className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(photo._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="border p-6 text-center text-gray-500 italic"
                      >
                        No photos available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {editingId ? "Edit Photo" : "Upload a New Photo"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 mb-2 font-medium">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2 font-medium">
                    Description
                  </label>
                  <textarea
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2 font-medium">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2 font-medium">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full md:w-auto bg-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
              >
                {editingId ? "Update Photo" : "Upload Photo"}
              </button>
            </form>
          </div>
        </div>
        <ToastContainer /> {/* This renders the toast notifications */}
      </div>
    </>
  );
};

export default PhotoGalleryAdmin;
