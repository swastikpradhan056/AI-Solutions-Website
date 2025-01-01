import React, { useEffect, useState } from "react";
import { fetchPhotos } from "../services/photoService";
import { motion } from "motion/react";

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const imageURL =
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
  // const API_URL =
  //   import.meta.env.MODE === "development"
  //     ? "http://localhost:3000/api"
  //     : "/api";

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const data = await fetchPhotos();
        setPhotos(data);
      } catch (error) {
        setError("Failed to fetch photos. Please try again later.");
        console.error("Failed to fetch photos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPhotos();
  }, []);

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "..."; // Add ellipsis if the text is truncated
    }
    return text;
  };

  const closeModal = () => setSelectedPhoto(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-2xl font-bold text-white animate-pulse">
          Loading Photos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div className="text-red-500 text-lg font-semibold">{error}</div>
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
        <div className="text-center text-white px-6 md:px-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white ">
            Welcome to Our Photo Gallery
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Discover a collection of our cherished moments, beautifully captured
            for you to explore.
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-4xl font-bold text-center text-teal-400 mb-8">
          Explore Our Gallery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.5,
                easeInOut: "linear",
              }}
              viewport={{ once: true, amount: 0.3 }}
              key={photo._id}
              className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={`${imageURL}${photo.imageUrl}`}
                alt={photo.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold">{photo.title}</h3>
                <p className="text-sm text-gray-300">
                  {truncateText(photo.description, 10)}{" "}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  <span className="font-medium text-gray-300">Event Date:</span>{" "}
                  {new Date(photo.eventDate).toLocaleDateString("en-CA")}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl lg:w-[680px] w-full bg-white rounded-lg overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${imageURL}${selectedPhoto.imageUrl}`}
              alt={selectedPhoto.title}
              className="w-full h-auto"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedPhoto.title}
              </h2>
              <p className="mt-4 text-gray-700">{selectedPhoto.description}</p>
              <p className="mt-2 text-gray-600">
                <span className="font-medium">Event Date:</span>{" "}
                {new Date(selectedPhoto.eventDate).toLocaleDateString("en-CA")}
              </p>
              <button
                className="mt-6 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition duration-300"
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

export default PhotoGallery;
