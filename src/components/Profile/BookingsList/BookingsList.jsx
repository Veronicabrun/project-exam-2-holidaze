// src/components/Profile/BookingsList/BookingsList.jsx
import BookingItem from "../BookingItem/BookingItem";
import styles from "./BookingsList.module.scss";

export default function BookingsList({ bookings, emptyText = "No bookings yet." }) {
  const list = Array.isArray(bookings) ? bookings : [];

  const sorted = list
    .slice()
    .sort((a, b) => new Date(b.created) - new Date(a.created));

  if (sorted.length === 0) {
    return <p className={styles.empty}>{emptyText}</p>;
  }

  return (
    <ul className={styles.grid} aria-label="Bookings list">
      {sorted.map((b) => (
        <li key={b.id} className={styles.item}>
          <BookingItem booking={b} />
        </li>
      ))}
    </ul>
  );
}