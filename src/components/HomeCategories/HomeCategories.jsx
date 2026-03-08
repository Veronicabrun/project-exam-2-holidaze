import { Link } from "react-router-dom";
import styles from "./HomeCategories.module.scss";

import baliImg from "../../assets/images/bali.jpg";
import spainImg from "../../assets/images/spain.jpg";
import italyImg from "../../assets/images/italy.jpg";
import japanImg from "../../assets/images/japan.jpg";

const categories = [
  {
    title: "Bali",
    country: "Bali",
    image: baliImg,
  },
  {
    title: "Spain",
    country: "Spain",
    image: spainImg,
  },
  {
    title: "Italy",
    country: "Italy",
    image: italyImg,
  },
  {
    title: "Japan",
    country: "Japan",
    image: japanImg,
  },
];

export default function HomeCategories() {
  return (
    <section className={styles.section} aria-labelledby="home-categories-title">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="home-categories-title" className={styles.title}>
            Explore by destination
          </h2>
        </div>

        <ul className={styles.grid} aria-label="Destination categories">
          {categories.map((item) => (
            <li key={item.title}>
              <Link
                to={`/venues?country=${encodeURIComponent(item.country)}`}
                className={styles.card}
                aria-label={`View venues in ${item.title}`}
              >
                <div className={styles.mediaWrap}>
                  <img
                    className={styles.media}
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />
                </div>

                <div className={styles.overlay}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}