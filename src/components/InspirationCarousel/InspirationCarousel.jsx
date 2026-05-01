import styles from "./InspirationCarousel.module.scss";

import hero1 from "../../assets/images/hero1.jpg";
import hero2 from "../../assets/images/hero2.jpg";
import hero3 from "../../assets/images/hero3.jpg";
import hero4 from "../../assets/images/hero4.jpg";
import hero5 from "../../assets/images/hero5.jpg";
import hero6 from "../../assets/images/hero6.jpg";
import hero7 from "../../assets/images/hero7.jpg";
import hero8 from "../../assets/images/hero8.jpg";
import hero9 from "../../assets/images/hero9.jpg";

const images = [
  {
    src: hero1,
    alt: "Gothic cathedral with palm trees and twin spires",
    size: "small",
  },
  {
    src: hero2,
    alt: "Orange tree with ripe fruit in a Mediterranean setting",
    size: "medium",
  },
  {
    src: hero3,
    alt: "Charming Mediterranean street with stone houses and potted plants",
    size: "medium",
  },
  {
    src: hero4,
    alt: "Mediterranean balcony with green shutters and potted plant",
    size: "large",
  },
  {
    src: hero5,
    alt: "Mediterranean coastal village with stone houses and turquoise water",
    size: "medium",
  },
  {
    src: hero6,
    alt: "Tropical beach with palm trees and sun loungers on white sand",
    size: "small",
  },
  {
    src: hero7,
    alt: "Tropical beach bungalow with palm trees and thatched roof",
    size: "large",
  },
  {
    src: hero8,
    alt: "Tropical bungalow with garden path surrounded by lush greenery",
    size: "medium",
  },
  {
    src: hero9,
    alt: "Luxury tropical villa with private pool and lush greenery",
    size: "small",
  },
];

export default function InspirationCarousel() {
  const loopImages = [...images, ...images];

  return (
    <section
      className={styles.section}
      aria-labelledby="inspiration-carousel-title"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="inspiration-carousel-title" className={styles.title}>
            Travel inspiration
          </h2>
          <p className={styles.text}>
            Explore places, moods and destinations from around the world.
          </p>
        </div>

        <div className={styles.viewport}>
          <div className={styles.track}>
            {loopImages.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className={`${styles.card} ${
                  image.size === "small"
                    ? styles.small
                    : image.size === "large"
                    ? styles.large
                    : styles.medium
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className={styles.image}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}