import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactElement;
  adminOnly?: boolean;
};

const ProtectedRoute = ({ children, adminOnly }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthContext();
  const { user } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

