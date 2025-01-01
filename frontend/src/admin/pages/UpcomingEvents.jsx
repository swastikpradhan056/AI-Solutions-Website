import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AdminNav from "../components/AdminNav";
import useLogout from "../hook/useLogout";
import { useNavigate } from "react-router-dom";

const UpcomingEventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const handleLogout = useLogout();
  const navigate = useNavigate();

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/events");
      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        console.error("Data fetched is not an array");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorMessage("Error fetching events. Please try again.");
      if (error.response && error.response.status === 401) {
        navigate("/admin/");
      }
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Add ellipsis if the text is truncated
    }
    return text;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("location", formData.location);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (currentEvent) {
        await axios.put(
          `http://localhost:3000/api/events/${currentEvent._id}`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:3000/api/events", data, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error submitting event:", error);
      setErrorMessage("Failed to submit the event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      setErrorMessage("Failed to delete the event. Please try again.");
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
      image: null,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      image: null,
    });
    setCurrentEvent(null);
    setModalOpen(false);
  };

  return (
    <>
      <AdminNav onLogout={handleLogout} />
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Upcoming Events
          </h1>

          {/* Event Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 md:p-6 rounded-lg shadow-lg space-y-4 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-700">
              Add New Event
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
                required
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event Description"
                required
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event Location"
                required
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Processing..." : "Add Event"}
            </button>
          </form>

          {/* Event List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(events) && events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                >
                  {event.image && (
                    <img
                      src={`http://localhost:3000${event.image}`}
                      alt={event.title}
                      className="w-full h-56 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-700 mb-1">
                    {truncateText(event.description, 20)}{" "}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Date:</strong>{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <strong>Location:</strong> {event.location}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No events available.</p>
            )}
          </div>

          {/* Modal */}
          {modalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Event Title"
                    required
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Event Description"
                    required
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Event Location"
                    required
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCloseModal}
                      type="button"
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UpcomingEventsAdmin;
