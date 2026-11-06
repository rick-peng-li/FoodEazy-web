import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/auth";

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  if (user && !user.verify) {
    return <Navigate to="/verify" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;
