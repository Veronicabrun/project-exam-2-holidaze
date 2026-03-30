import styles from "./Featured.module.scss";
import {
  SearchIcon,
  BookingsIcon,
  PlaneTripIcon,
} from "../ui/Icons/Icons";

const steps = [
  {
    title: "Find your stay",
    text: "Explore destinations and discover unique venues that match your style, budget and travel plans.",
    Icon: SearchIcon,
  },
  {
    title: "Book in seconds",
    text: "Choose your dates, check availability and complete your booking quickly with a simple flow.",
    Icon: BookingsIcon,
  },
  {
    title: "Travel and enjoy",
    text: "Pack your bags and enjoy your stay with a smooth booking experience from start to finish.",
    Icon: PlaneTripIcon,
  },
];

export default function Featured() {
  return (
    <section className={styles.section} aria-labelledby="featured-title">
      <div className={styles.inner}>
        <h2 id="featured-title" className={styles.title}>
          How Holidaze works
        </h2>

        <div className={styles.grid}>
          {steps.map(({ title, text, Icon }) => (
            <article key={title} className={styles.card}>
              <div className={styles.iconWrap} aria-hidden="true">
                <Icon className={styles.icon} />
              </div>

              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.text}>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}