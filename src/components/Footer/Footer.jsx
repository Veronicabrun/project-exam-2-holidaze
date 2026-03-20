import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>Holidaze</h2>
            <p className={styles.tagline}>
              Find and book your perfect holiday venue.
            </p>
          </div>

          <nav className={styles.links} aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/venues">Venues</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>© {year} Holidaze</p>
          <p>Project Exam · Noroff</p>
        </div>
      </div>
    </footer>
  );
}