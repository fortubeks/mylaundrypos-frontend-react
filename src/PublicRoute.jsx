import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children, logStatus = true }) => {
  const verified = useSelector((state) => state.user.verified);
  const auth = JSON.parse(localStorage.getItem("laundry::auth"));

  if (!logStatus && verified && auth?.token) {
    return <Navigate to="/dashboard/dashboard" />;
  }

  return children;
};

export default PublicRoute;
