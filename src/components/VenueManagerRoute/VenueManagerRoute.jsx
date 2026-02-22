// src/components/VenueManagerRoute/VenueManagerRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function VenueManagerRoute({ children }) {
  const auth = useAuth();

  const isLoggedIn = Boolean(auth?.token);
  const isVenueManager = Boolean(auth?.venueManager);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isVenueManager) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}