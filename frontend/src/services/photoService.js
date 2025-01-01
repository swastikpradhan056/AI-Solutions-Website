import axios from "axios";

// "http://localhost:3000/api/photos";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

// Configure axios to include cookies in every request
axios.defaults.withCredentials = true;

// Fetch photos (uses token from cookie)
export const fetchPhotos = async () => {
  try {
    const response = await axios.get(`${API_URL}/photos`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching photos:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add photo (uses token from cookie)
export const addPhoto = async (photoData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Specify the content type
      },
    };
    const response = await axios.post(API_URL, photoData, config);
    return response.data;
  } catch (error) {
    console.error("Error adding photo:", error.response?.data || error.message);
    throw error;
  }
};
