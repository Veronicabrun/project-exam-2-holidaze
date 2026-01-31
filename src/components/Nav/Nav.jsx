// src/components/Nav/Nav.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, logout as doLogout } from "../../utils/auth";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuthState] = useState(getAuth());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Oppdater auth når route endres (typisk etter login/logout navigate)
  useEffect(() => {
    const next = getAuth();
    console.log("Nav.jsx:20 Nav: route changed -> updating auth", next);
    setAuthState(next);

    // Lukk meny ved route change
    setIsMenuOpen(false);
  }, [location.pathname]);

  function toggleMenu() {
    setIsMenuOpen((current) => {
      console.log("Nav.jsx:42 Nav: toggle menu. current:", current);
      return !current;
    });
  }

  function goToProfile() {
    console.log("Nav.jsx:59 Nav: go to profile");
    setIsMenuOpen(false);
    navigate("/profile");
  }

  function handleLogout() {
    console.log("Nav.jsx:47 Nav: handleLogout clicked");
    doLogout();
    const after = getAuth();
    console.log("Nav.jsx:50 Nav: auth after logout:", after);

    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Link to="/">Home</Link>
      <Link to="/venues">Venues</Link>

      {/* Kun venue manager */}
      {auth.isLoggedIn && auth.venueManager && <Link to="/admin">Admin</Link>}

      <div style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
        {!auth.isLoggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <div style={{ position: "relative" }}>
            {/* Brukerikon-knapp */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span aria-hidden="true">👤</span>
              {auth.name || "User"}
            </button>

            {/* Dropdown */}
            {isMenuOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  border: "1px solid #ddd",
                  background: "white",
                  padding: "8px",
                  minWidth: "160px",
                  display: "grid",
                  gap: "8px",
                  zIndex: 10,
                }}
              >
                <button type="button" onClick={goToProfile}>
                  Profile
                </button>

                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}