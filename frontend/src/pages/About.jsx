import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

const About = () => {
  const [showMore, setShowMore] = useState(false);
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to toggle "Learn More" content
  const toggleContent = () => {
    setShowMore((prev) => !prev);
  };

  // Fetch About data from the backend
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/about"); // Ensure the endpoint matches your backend
        if (!response.ok) {
          throw new Error("Failed to fetch about data.");
        }
        const data = await response.json();
        setAboutData(data); // Expecting backend to return an object with `title` and `content`
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Loading About Page...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#68BBE3] via-[#055C9D] to-[#68BBE3] text-white"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-500 to-blue-600 h-[50vh] flex items-center justify-center text-center">
        <div className="z-10 px-6">
          <h1 className="text-6xl font-extrabold text-white drop-shadow-md">
            {aboutData?.title || "About Us"}
          </h1>
          <p className="text-lg font-light text-white mt-4">
            Discover who we are and what we stand for.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Company Values Section */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-center text-teal-400">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed text-gray-300 text-center">
              {showMore
                ? aboutData?.content
                : `${aboutData?.content.slice(0, 500)}...`}
            </p>
            {aboutData?.content.length > 500 && (
              <div className="text-center">
                <button
                  onClick={toggleContent}
                  className="mt-4 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-lg rounded-lg shadow-md transition duration-300"
                >
                  {showMore ? "Show Less" : "Learn More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
