import { Link } from "react-router-dom";
import styles from "./HomeBanner.module.scss";
import heroImage from "../../assets/images/hero.jpg";
import { ArrowRightLongIcon } from "../ui/Icons/Icons";

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
              Find your perfect stay
            </h2>

            <p className={styles.text}>
              Browse hundreds of unique places and experiences, and book your
              next stay easily.
            </p>

            <Link className={styles.button} to="/venues">
              <span>Explore</span>
              <ArrowRightLongIcon className={styles.arrowIcon} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}