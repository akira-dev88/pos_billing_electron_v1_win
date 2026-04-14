import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: any) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/pos" />;
  }

  return children;
}