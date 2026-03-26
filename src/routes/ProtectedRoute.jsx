import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "../utils/session";

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && session.role !== requiredRole) {
    return <Navigate to={session.role === "admin" ? "/admin" : "/player"} replace />;
  }

  return children;
}
