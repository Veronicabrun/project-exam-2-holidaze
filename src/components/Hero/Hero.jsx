import styles from "./Hero.module.scss";
import { SearchIcon } from "../ui/Icons/Icons";

export default function Hero({ query, onQueryChange }) {
  return (
    <section className={styles.hero} aria-label="Holidaze hero">
      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Holidaze</h1>
        <p className={styles.subtitle}>Find and book your perfect holiday</p>

        <div className={styles.searchWrap}>
          <label className={styles.srOnly} htmlFor="hero-search">
            Search venues
          </label>

          <div className={styles.searchBar}>
            <SearchIcon className={styles.searchIcon} />

            <input
              id="hero-search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by name, city, country..."
              className={styles.input}
              type="search"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <svg
        className={styles.divider}
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,20 C240,70 480,110 720,110 C960,110 1200,70 1440,20 L1440,140 L0,140 Z"
        />
      </svg>
    </section>
  );
}