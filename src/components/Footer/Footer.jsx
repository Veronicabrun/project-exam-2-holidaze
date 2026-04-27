import { Link } from "react-router-dom";
import {
  EmailIcon,
  PhoneIcon,
  InstagramIcon,
  FacebookIcon,
} from "../ui/Icons/Icons";
import styles from "./Footer.module.scss";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <nav className={styles.links} aria-label="Footer navigation">
            <h3 className={styles.sectionTitle}>Links</h3>
            <Link to="/">Home</Link>
            <Link to="/venues">Venues</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact us</h3>

            <a href="mailto:hello@holidaze.com" className={styles.infoLink}>
              <EmailIcon className={styles.icon} />
              <span>hello@holidaze.com</span>
            </a>

            <a href="tel:+4712345678" className={styles.infoLink}>
              <PhoneIcon className={styles.icon} />
              <span>+47 12 34 56 78</span>
            </a>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Follow us</h3>

            <div className={styles.socials}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={styles.socialLink}
              >
                <InstagramIcon className={styles.socialIcon} />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={styles.socialLink}
              >
                <FacebookIcon className={styles.socialIcon} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} Holidaze</p>
          <p>Project Exam · Noroff</p>
        </div>
      </div>
    </footer>
  );
}