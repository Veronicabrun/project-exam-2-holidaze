import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, logout as doLogout } from "../../utils/auth";

const DEBUG_NAV = true;
function log(...args) {
  if (DEBUG_NAV) console.log(...args);
}

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuthState] = useState(getAuth());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = Boolean(auth?.token);

  useEffect(() => {
    const next = getAuth();
    log("Nav: route change -> sync auth", { path: location.pathname, auth: next });
    setAuthState(next);
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onAuthChange() {
      const next = getAuth();
      log("Nav: authchange -> sync auth", next);
      setAuthState(next);
    }

    window.addEventListener("authchange", onAuthChange);
    return () => window.removeEventListener("authchange", onAuthChange);
  }, []);

  function toggleMenu() {
    setIsMenuOpen((current) => !current);
  }

  function goToProfile() {
    setIsMenuOpen(false);
    navigate("/profile");
  }

  function handleLogout() {
    doLogout();
    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  }

  const avatarUrl = auth?.avatarUrl || null;
  const avatarAlt = auth?.avatarAlt || "User avatar";

  return (
    <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Link to="/">Home</Link>
      <Link to="/venues">Venues</Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
        {!isLoggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={toggleMenu}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                cursor: "pointer",
                border: "1px solid #ddd",
                padding: "6px 10px",
                borderRadius: "999px",
                background: "white",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={avatarAlt}
                  width="28"
                  height="28"
                  style={{ borderRadius: "999px", objectFit: "cover", display: "block" }}
                />
              ) : (
                <span aria-hidden="true">👤</span>
              )}

              <span>{auth?.name || "User"}</span>
            </button>

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
                  borderRadius: 10,
                }}
              >
                <button type="button" onClick={goToProfile}>
                  {auth?.venueManager ? "Admin" : "Profile"}
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