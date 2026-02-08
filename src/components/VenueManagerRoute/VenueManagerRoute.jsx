// src/components/VenueManagerRoute/VenueManagerRoute.jsx
import { Navigate } from "react-router-dom";
import { getAuth } from "../../utils/auth";

export default function VenueManagerRoute({ children }) {
  const auth = getAuth();
  const isLoggedIn = Boolean(auth?.token);
  const venueManager = Boolean(auth?.venueManager);

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!venueManager) return <Navigate to="/profile" replace />;

  return children;
}