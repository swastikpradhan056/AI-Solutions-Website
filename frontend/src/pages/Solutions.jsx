import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FaSearch } from "react-icons/fa";

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [filteredSolutions, setFilteredSolutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const imageURL =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api";

  // Fetch solutions from backend on component mount
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await axios.get(`${API_URL}/software-solutions`);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.solutions || [];
        setSolutions(data);
        setFilteredSolutions(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch solutions.");
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  // Filter solutions based on the tags
  const filterSolutions = () => {
    const query = searchQuery.toLowerCase();
    const filtered = solutions.filter((solution) =>
      solution.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredSolutions(filtered);
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const handleDesc = (id) => {
    navigate(`/solutions/${id}`);
  };

  // Loading state
  if (loading) {
    return <p className="text-center py-8">Loading solutions...</p>;
  }

  // Error state
  if (error) {
    return <p className="text-center text-red-500 py-8">{error}</p>;
  }

  // Render solutions
  return (
    <motion.div
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#68BBE3] via-[#055C9D] to-[#68BBE3]"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-500 to-blue-600 h-[50vh] flex items-center justify-center text-center">
        <div className="z-10 px-6">
          <h1 className="text-6xl font-extrabold text-white drop-shadow-md">
            Our Solutions
          </h1>
          <p className="text-lg font-light text-white mt-4">
            Discover a wide range of AI-driven solutions tailored to meet your
            business needs. Click on any solution to learn more.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg px-4 py-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search solutions by tags..."
            className="w-full px-4 py-2 focus:outline-none focus:ring-0 focus:ring-teal-500 rounded-lg text-gray-800"
          />
          <button
            onClick={filterSolutions}
            className="bg-[#68BBE3] hover:bg-[#055C9D] text-white px-4 py-2 rounded-lg flex items-center justify-center "
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="container mx-auto px-4 py-16 lg:min-h-[51vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {filteredSolutions.length > 0 ? (
            filteredSolutions.map((solution, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: index * 0.3,
                  delay: index * 0.5,
                  easeInOut: "linear",
                }}
                viewport={{ once: true, amount: 0.3 }}
                key={solution._id}
                className="bg-white/20 rounded-lg shadow-md transform transition hover:scale-105 hover:shadow-lg p-6 cursor-pointer"
                onClick={() => handleDesc(solution._id)}
              >
                <img
                  src={`${imageURL}${solution.image}`}
                  alt={solution.title}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {solution.title}
                </h3>
                <p className="text-white h-full">
                  {truncateText(solution.description, 20)}{" "}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center">
              <p className="text-center text-white text-lg font-bold w-full ">
                No solutions found.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Solutions;
