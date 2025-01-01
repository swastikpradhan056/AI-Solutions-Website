import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";

const SolutionDetails = () => {
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/software-solutions/${id}`
        );
        setSolution(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching solution:", err);
        setError("Error fetching solution details");
        setLoading(false);
      }
    };

    fetchSolution();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-r from-teal-500 to-blue-600 text-white"
      >
        <div className="container mx-auto px-6 py-24 lg:flex lg:items-center">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-indigo-300">
              {solution.title}
            </h1>
            <p className="mt-6 text-lg text-gray-200 leading-relaxed">
              {solution.description}
            </p>
            <div className="mt-8">
              <Link
                to="/solutions"
                className="px-8 py-3 bg-cyan-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300"
              >
                Back to Solutions
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
            <img
              src={`http://localhost:3000${solution.image}`}
              alt={solution.title}
              className="w-full h-auto max-w-md rounded-2xl shadow-xl transform hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </motion.div>

      {/* Details Section */}
      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="mx-auto lg:px-32 md:px-16 px-6 py-16 bg-gradient-to-br from-[#68BBE3] via-[#055C9D] to-[#68BBE3]"
      >
        {/* Benefits */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solution.benefits?.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center bg-[#003060] text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tags */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">Tags</h2>
          <div className="flex flex-wrap gap-4">
            {solution.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-cyan-600 text-white text-sm rounded-full shadow-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className=" bg-gradient-to-r from-teal-500 to-blue-600 py-12"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-cyan-300">
            Discover More Solutions
          </h2>
          <p className="mt-4 text-gray-300">
            Ready to explore more innovative solutions tailored to your needs?
          </p>
          <div className="mt-8">
            <Link
              to="/solutions"
              className="px-8 py-3 bg-cyan-800 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-cyan-700 transition-all duration-300"
            >
              View All Solutions
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SolutionDetails;
