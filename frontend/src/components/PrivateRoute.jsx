import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null to handle loading state

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/check`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false); // Authentication failed or error
        console.error(error);
        console.log(error);
      }
    };

    checkAuth();
  }, []); // Empty dependency array to run only once on mount

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Render a loading state while checking authentication
  }

  return isAuthenticated ? children : <Navigate to="/admin/" />;
};
export default PrivateRoute;
