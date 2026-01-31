// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getAuth } from "../../utils/auth";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = getAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}