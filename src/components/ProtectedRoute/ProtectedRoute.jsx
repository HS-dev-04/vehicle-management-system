import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  console.log("isAuth", isAuthenticated);
  console.log("Children", children);
  const token = localStorage.getItem("authToken");

  if (!isAuthenticated || !token) {
    console.log("Auth completed",isAuthenticated)
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
