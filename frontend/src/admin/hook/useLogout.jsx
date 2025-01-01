import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Clear the admin token or any other data from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/admin/");
  };

  return logout;
};

export default useLogout;
