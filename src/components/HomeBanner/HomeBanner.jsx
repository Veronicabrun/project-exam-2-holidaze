import styles from "./HomeBanner.module.scss";
import heroImage from "../../assets/images/hero.jpg";

export default function HomeBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.banner}>
          <div className={styles.left}>
            <img
              className={styles.image}
              src={heroImage}
              alt="Travel inspiration"
            />
          </div>

          <div className={styles.right}>
            <h2 className={styles.title}>
              Find things to do for everything you like
            </h2>

            <p className={styles.text}>
              Browse hundreds of unique places and experiences, and book your
              next stay easily.
            </p>

            <a className={styles.button} href="/venues">
              Explore venues
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}