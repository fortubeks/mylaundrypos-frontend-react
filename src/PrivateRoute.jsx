import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // const userInfo = useSelector((state) => state.user.userInfo);

  const verified = useSelector((state) => state.user.verified);
  const auth = JSON.parse(localStorage.getItem("laundry::auth"));

  // let type;

  if (!verified || !auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
