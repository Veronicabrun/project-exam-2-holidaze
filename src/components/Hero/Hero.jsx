import styles from "./Hero.module.scss";
import heroImage from "../../assets/images/hero.jpg";

export default function Hero({ query, onQueryChange }) {
  return (
    <section
      className={styles.hero}
      aria-label="Holidaze hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Holidaze</h1>
        <p className={styles.subtitle}>Find and book your perfect holiday</p>

        <div className={styles.searchWrap}>
          <label className={styles.srOnly} htmlFor="hero-search">
            Search venues
          </label>

          <div className={styles.searchBar}>
            <input
              id="hero-search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by name, city, country..."
              className={styles.input}
              type="search"
              autoComplete="off"
            />

            <button type="button" className={styles.button} aria-label="Search">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}