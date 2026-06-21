import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("laundry::auth"));

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
