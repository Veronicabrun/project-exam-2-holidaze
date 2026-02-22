// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const isLoggedIn = Boolean(auth?.token);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}