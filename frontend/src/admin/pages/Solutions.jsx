import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AdminNav from "../components/AdminNav";
import useLogout from "../hook/useLogout";
import { useNavigate } from "react-router-dom";

const SolutionsAdmin = () => {
  const [solutions, setSolutions] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null); // Track editing state
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

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${API_URL}/software-solutions`, {
        withCredentials: true,
      });
      setSolutions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching solutions:", error);
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

      // Convert benefits to comma-separated string and append
      if (Array.isArray(formData.benefits)) {
        formDataToSend.append("benefits", formData.benefits.join(","));
      } else if (formData.benefits) {
        formDataToSend.append("benefits", formData.benefits);
      }

      // Convert tags to comma-separated string and append
      if (Array.isArray(formData.tags)) {
        formDataToSend.append("tags", formData.tags.join(","));
      } else if (formData.tags) {
        formDataToSend.append("tags", formData.tags);
      }

      // Append image if it exists
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Log for debugging
      console.log([...formDataToSend.entries()]);

      if (editingId) {
        // Edit logic
        await axios.put(
          `${API_URL}/software-solutions/${editingId}`,
          formDataToSend,
          {
            withCredentials: true,
          }
        );
        setEditingId(null); // Clear editing state
      } else {
        // Add logic
        await axios.post(`${API_URL}/software-solutions`, formDataToSend, {
          withCredentials: true,
        });
      }

      // Reset form data, including benefits and tags
      setFormData({
        title: "",
        description: "",
        benefits: [],
        tags: [],
        image: null,
      });

      // Optionally refetch solutions if needed
      fetchSolutions();
    } catch (error) {
      console.error("Error saving solution:", error);
      // Optionally handle the error state here (e.g., show an alert or error message)
    }
  };

  const handleEdit = (solution) => {
    setEditingId(solution._id);
    setFormData({
      title: solution.title,
      description: solution.description,
      benefits: solution.benefits,
      tags: solution.tags,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/software-solutions/${id}`, {
        withCredentials: true,
      });
      fetchSolutions();
    } catch (error) {
      console.error("Error deleting solution:", error);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  return (
    <>
      <AdminNav onLogout={handleLogout} />
      <div className="flex flex-row h-screen bg-gray-50">
        <Sidebar />
        <div className="p-8 flex-1">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
            Solutions/Services
          </h1>
          {/* Table Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Benefits</th>
                  <th className="p-4 font-semibold">Tags</th>
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {solutions.length > 0 ? (
                  solutions.map((solution) => (
                    <tr
                      key={solution._id}
                      className="odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <td className="p-4 text-gray-800">{solution.title}</td>
                      <td className="p-4 text-gray-600 truncate max-w-xs">
                        {solution.description}
                      </td>
                      <td className="p-4 text-gray-600">
                        {solution.benefits?.join(", ") || "N/A"}
                      </td>
                      <td className="p-4 text-gray-600">
                        {solution.tags?.join(", ") || "N/A"}
                      </td>
                      <td className="p-4">
                        {solution.image ? (
                          <img
                            src={`${imageURL}${solution.image}`}
                            alt={solution.title}
                            className="w-16 h-16 object-cover rounded-md border"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(solution)}
                            className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(solution._id)}
                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
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
                      colSpan="6"
                      className="p-6 text-center text-gray-500 text-lg font-medium"
                    >
                      No solutions available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Form Section */}
          <div className="bg-white shadow-md rounded-lg p-8 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingId ? "Edit Solution" : "Add New Solution"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Benefits (comma-separated)"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="mt-6 bg-blue-500 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                {editingId ? "Update Solution" : "Add Solution"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SolutionsAdmin;
