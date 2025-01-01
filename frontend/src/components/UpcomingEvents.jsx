import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";

const UpcomingEvents = ({ limit, pastLimit }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/events");
        console.log("API Response:", response.data); // Log the response data
        setEvents(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load events.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Add ellipsis if the text is truncated
    }
    return text;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const closeModal = () => setSelectedEvent(null);

  if (loading) {
    return (
      <p className="text-center text-xl text-gray-700 py-8">
        Loading events...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg py-8">{error}</p>;
  }

  if (!Array.isArray(events) || events.length === 0) {
    return (
      <p className="text-center text-xl text-gray-700 py-8">
        No events to display.
      </p>
    );
  }

  // Limit events if the `limit` prop is provided
  const displayedEvents = limit ? events.slice(0, limit) : events;
  const pastEvents = pastLimit ? events.slice(0, pastLimit) : events;

  return (
    <motion.div
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
      id="upcoming-events"
      className="py-16 bg-gradient-to-br from-[#68BBE3] via-[#055C9D] to-[#68BBE3] min-h-[90vh]"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-white text-center lg:mb-12 mb-12 lg:mt-12 mt-10">
          🎉 Upcoming Events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedEvents
            .filter((event) => new Date(event.date) >= new Date())
            .map((event, index) => (
              <motion.div
                key={event.id || index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.5,
                  easeInOut: ["easeIn", "easeOut"],
                  type: "tween",
                }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-[#68BBE3] rounded-lg shadow-lg transition-all duration-500 hover:translate-x-5 hover:scale-150 hover:shadow-2xl overflow-hidden cursor-pointer border-none"
                onClick={() => setSelectedEvent(event)}
              >
                <img
                  src={`http://localhost:3000${event.image}`}
                  alt={event.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-100 font-semibold">
                    {formatDate(event.date)}
                  </p>
                  <p className="text-md text-gray-100 font-semibold">
                    {event.location}
                  </p>
                </div>
                <div className="p-4 bg-[#055C9D] h-full">
                  <p className="text-white h-full">
                    {truncateText(event.description, 10)}{" "}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-white text-center lg:mt-32 mt-12 lg:mb-12 mb-10">
          Past Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {pastEvents
            .filter((event) => new Date(event.date) < new Date()) // Filter only past events
            .map((event, index) => (
              <motion.div
                key={event.id || index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.5,
                  easeInOut: ["easeIn", "easeOut"],
                  type: "tween",
                }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-[#68BBE3] rounded-lg shadow-lg transition-all duration-500 hover:translate-x-5 hover:scale-150 hover:shadow-2xl overflow-hidden cursor-pointer border-none"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-100 font-semibold">
                    {formatDate(event.date)}
                  </p>
                </div>
                <div className="p-4 bg-[#055C9D] h-full">
                  <p className="text-white h-full">
                    {truncateText(event.description, 10)}{" "}
                    {/* Limiting the description to 20 words */}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full overflow-hidden shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`http://localhost:3000${selectedEvent.image}`}
              alt={selectedEvent.title}
              className="w-full h-72 sm:h-96 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h2 className="text-3xl font-semibold text-gray-800">
                {selectedEvent.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {formatDate(selectedEvent.date)}
              </p>
              <p className="text-md text-gray-600 mt-2">
                {selectedEvent.location}
              </p>
              <p className="text-gray-700 mt-4 text-base leading-relaxed">
                {selectedEvent.description}
              </p>
              <button
                className="mt-6 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingEvents;
