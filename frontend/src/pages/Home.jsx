import React, { useState, useEffect } from "react";
import axios from "axios";
import UpcomingEvents from "../components/UpcomingEvents";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const Home = () => {
  const [solutions, setSolutions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const navigate = useNavigate();

  const imageURL =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api";

  const handleAbout = () => {
    navigate("/about");
  };

  useEffect(() => {
    // Fetch solutions
    const fetchSolutions = async () => {
      try {
        const response = await axios.get(`${API_URL}/software-solutions`);
        console.log(`API response:`, response.data);
        setSolutions(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching solutions:", error);
        setSolutions([]);
      } finally {
        setLoadingSolutions(false);
      }
    };

    // Fetch feedback
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${API_URL}/feedback`);
        console.log(`API response:`, response.data);

        setFeedback(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedback([]);
      } finally {
        setLoadingFeedback(false);
      }
    };

    fetchSolutions();
    fetchFeedback();
  }, []);
  const handleDesc = (id) => {
    navigate(`/solutions/${id}`);
  };
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Add ellipsis if the text is truncated
    }
    return text;
  };

  return (
    <motion.div
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col min-h-screen  text-white"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-[50vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Empowering Digital Employee Experience
        </h1>
        <p className="text-lg md:text-xl text-gray-200">
          AI Solutions leverages AI to rapidly address workplace challenges and
          foster innovation.
        </p>
        <button
          onClick={handleAbout}
          className="mt-6 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Learn More
        </button>
      </div>

      {/* Solutions Section */}
      <section
        id="solutions"
        className="py-16 bg-gradient-to-br from-[#68BBE3] via-[#055C9D] to-[#68BBE3]"
      >
        <motion.div
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-6"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Our Solutions
          </h2>
          {loadingSolutions ? (
            <p className="text-center text-gray-300">Loading solutions...</p>
          ) : (
            <motion.div
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {solutions.map((solution, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.5,
                    easeInOut: "linear",
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  key={solution.id || solution._id}
                  className="relative group bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => handleDesc(solution._id || solution.id)}
                >
                  <img
                    src={`${imageURL}${solution.image}`}
                    alt={solution.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white">
                      {solution.title}
                    </h3>
                    <p className="text-white h-full">
                      {truncateText(solution.description, 10)}{" "}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="feedback" className="py-16 bg-[#055C9D]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            What Our Customers Say
          </h2>
          {loadingFeedback ? (
            <p className="text-center text-gray-400">Loading feedback...</p>
          ) : (
            <motion.div
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-row items-center mt-12 flex-1 justify-center gap-4"
            >
              {feedback.slice(0, 3).map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.5,
                    easeInOut: "linear",
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  key={item.id || item._id}
                  className="bg-[#003060] rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 w-full"
                >
                  <h3 className="text-lg font-semibold text-teal-400">
                    {item.name}
                  </h3>
                  <p className="text-yellow-500 text-sm mb-2">
                    {"★".repeat(item.rating) + "☆".repeat(5 - item.rating)}
                  </p>
                  <p className="text-gray-300">{item.comment}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <UpcomingEvents limit={4} pastLimit={4} />
    </motion.div>
  );
};

export default Home;
