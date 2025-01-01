import React, { useEffect, useState } from "react";
import axios from "axios";
import useLogout from "../hook/useLogout";
import AdminNav from "../components/AdminNav";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const handleLogout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/admin");
        console.log("API response:", response.data); // Log the response for debugging
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.admins || [];
        setAdmins(data); // Update state with the array of admins
      } catch (error) {
        // Redirect to login if authentication fails
        if (error.response && error.response.status === 401) {
          navigate("/admin/");
        }
        console.error("Error fetching admins:", error);
        setAdmins([]); // Ensure admins state is always an array
      }
    };

    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/admin", newAdmin, {
        withCredentials: true,
      });
      setNewAdmin({ name: "", email: "", password: "" });
      alert("Admin added successfully");
      window.location.reload(); // Reload to fetch updated list
    } catch (error) {
      console.error("Error adding admin:", error);
      alert(error.response?.data?.message || "Failed to add admin");
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/${id}`, {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      alert("Admin deleted successfully");
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id)); // Update state without reloading
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert(error.response?.data?.message || "Failed to delete admin");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3000/api/admin/password", passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      alert("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <>
      <AdminNav onLogout={handleLogout} />
      <div className="flex flex-row h-screen bg-gray-100">
        <Sidebar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
            {/* Dashboard Header */}
            <h1 className="text-3xl font-extrabold text-gray-800 mb-10">
              Current Admins
            </h1>

            {/* Admin Table */}
            <div className="mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="border border-gray-300 px-4 py-3 text-gray-600 font-medium">
                        Name
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-gray-600 font-medium">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-gray-600 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(admins) && admins.length > 0 ? (
                      admins.map((admin) => (
                        <tr key={admin._id} className="hover:bg-gray-100">
                          <td className="border border-gray-300 px-4 py-3 text-gray-800">
                            {admin.name}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-800">
                            {admin.email}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <button
                              onClick={() => handleDeleteAdmin(admin._id)}
                              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-6 text-gray-500 italic"
                        >
                          No admins found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add New Admin */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Add New Admin
              </h2>
              <form
                onSubmit={handleAddAdmin}
                className="bg-gray-50 shadow-sm rounded-lg p-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newAdmin.name}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, name: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
                  />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                  className="w-full border rounded-lg p-3 text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Add Admin
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Change Password
              </h2>
              <form
                onSubmit={handleChangePassword}
                className="bg-gray-50 shadow-sm rounded-lg p-6 space-y-4"
              >
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admins;
