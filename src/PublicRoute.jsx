import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children, logStatus = true }) => {
  const auth = JSON.parse(localStorage.getItem("laundry::auth"));

  if (!logStatus && auth?.token) {
    return <Navigate to="/dashboard/dashboard" />;
  }

  return children;
};

export default PublicRoute;
