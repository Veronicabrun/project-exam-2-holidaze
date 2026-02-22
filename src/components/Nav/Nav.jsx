// src/components/Nav/Nav.jsx
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { logout as doLogout } from "../../utils/auth";
import useAuth from "../../hooks/useAuth";
import styles from "./Nav.module.scss";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const auth = useAuth();
  const isLoggedIn = Boolean(auth?.token);
  const avatarUrl = auth?.avatarUrl || "";
  const avatarAlt = auth?.avatarAlt || "User avatar";

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu on outside click / ESC
  useEffect(() => {
    if (!isMenuOpen) return;

    function onMouseDown(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setIsMenuOpen(false);
    }

    function onKeyDown(e) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
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

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Holidaze home">
          <span className={styles.logo}>Holidaze</span>
        </Link>

        <nav className={styles.navLinks} aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/venues"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
          >
            Explore
          </NavLink>

          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${styles.link} ${styles.loginLink} ${isActive ? styles.activeLogin : ""}`
              }
            >
              Login
            </NavLink>
          ) : (
            <div className={styles.userMenu} ref={menuRef}>
              <button
                type="button"
                onClick={toggleMenu}
                className={styles.userButton}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-label="Open user menu"
              >
                {avatarUrl ? (
                  <img className={styles.avatar} src={avatarUrl} alt={avatarAlt} />
                ) : (
                  <span className={styles.avatarFallback} aria-hidden="true">
                    👤
                  </span>
                )}
              </button>

              {isMenuOpen && (
                <div className={styles.dropdown} role="menu">
                  <button type="button" className={styles.dropdownItem} onClick={goToProfile}>
                    My profile
                  </button>

                  <div className={styles.divider} />

                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${styles.danger}`}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}