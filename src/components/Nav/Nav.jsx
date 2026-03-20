import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { logout as doLogout } from "../../utils/auth";
import useAuth from "../../hooks/useAuth";
import styles from "./Nav.module.scss";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  const auth = useAuth();
  const isLoggedIn = Boolean(auth?.token);
  const avatarUrl = auth?.avatarUrl || "";
  const avatarAlt = auth?.avatarAlt || "User avatar";

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isProfilePage = location.pathname === "/profile";

  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onMouseDown(e) {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    if (isUserMenuOpen) {
      window.addEventListener("mousedown", onMouseDown);
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function toggleUserMenu() {
    setIsUserMenuOpen((prev) => !prev);
  }

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function goToProfile() {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/profile");
  }

  function handleLogout() {
    doLogout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.brand} aria-label="Holidaze home">
            <span className={styles.logo}>Holidaze</span>
          </Link>

          <nav className={styles.navDesktop} aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/venues"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              Explore
            </NavLink>

            {!isLoggedIn ? (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${styles.link} ${styles.loginLink} ${
                    isActive ? styles.activeLogin : ""
                  }`
                }
              >
                Login
              </NavLink>
            ) : (
              <div className={styles.userMenu} ref={userMenuRef}>
                <button
                  type="button"
                  onClick={toggleUserMenu}
                  className={styles.userButton}
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Open user menu"
                >
                  {avatarUrl ? (
                    <img
                      className={styles.avatar}
                      src={avatarUrl}
                      alt={avatarAlt}
                    />
                  ) : (
                    <span className={styles.avatarFallback} aria-hidden="true">
                      👤
                    </span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className={styles.dropdown} role="menu">
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={goToProfile}
                    >
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

          <button
            type="button"
            className={styles.mobileToggle}
            onClick={openMobileMenu}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburgerTop} />
            <span className={styles.hamburgerMiddle} />
            <span className={styles.hamburgerBottom} />
          </button>
        </div>
      </header>

      <div
        className={`${styles.mobileOverlay} ${
          isMobileMenuOpen ? styles.mobileOverlayOpen : ""
        }`}
        onClick={closeMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />

      <aside
        className={`${styles.mobilePanel} ${
          isMobileMenuOpen ? styles.mobilePanelOpen : ""
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.mobilePanelHeader}>
          <Link
            to="/"
            className={styles.mobileBrand}
            aria-label="Holidaze home"
            onClick={closeMobileMenu}
          >
            <span className={styles.mobileLogo}>Holidaze</span>
          </Link>

          <button
            type="button"
            className={styles.mobileClose}
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.mobileActive : ""}`
            }
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/venues"
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.mobileActive : ""}`
            }
            onClick={closeMobileMenu}
          >
            Explore
          </NavLink>

          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileActive : ""}`
              }
              onClick={closeMobileMenu}
            >
              Login
            </NavLink>
          ) : (
            <>
              <button
                type="button"
                className={`${styles.mobileButton} ${
                  isProfilePage ? styles.mobileActive : ""
                }`}
                onClick={goToProfile}
              >
                My profile
              </button>

              <button
                type="button"
                className={`${styles.mobileButton} ${styles.mobileDanger}`}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}