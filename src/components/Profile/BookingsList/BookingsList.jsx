import BookingItem from "../BookingItem/BookingItem";
import styles from "./BookingsList.module.scss";

function dateOnlyISO(value) {
  return new Date(value).toISOString().slice(0, 10);
}

export default function BookingsList({
  bookings,
  emptyText = "No bookings yet.",
}) {
  const list = Array.isArray(bookings) ? bookings : [];

  const today = dateOnlyISO(new Date());

  const upcoming = list
    .filter((b) => dateOnlyISO(b.dateTo) >= today)
    .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

  const past = list
    .filter((b) => dateOnlyISO(b.dateTo) < today)
    .sort((a, b) => new Date(b.dateFrom) - new Date(a.dateFrom));

  if (upcoming.length === 0 && past.length === 0) {
    return <p className={styles.empty}>{emptyText}</p>;
  }

  return (
    <div className={styles.wrapper}>
      {upcoming.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.heading}>Upcoming bookings</h3>
          <ul className={styles.grid} aria-label="Upcoming bookings">
            {upcoming.map((b) => (
              <li key={b.id} className={styles.item}>
                <BookingItem booking={b} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section className={`${styles.section} ${styles.pastSection}`}>
          <h3 className={styles.heading}>Past bookings</h3>
          <ul className={styles.grid} aria-label="Past bookings">
            {past.map((b) => (
              <li key={b.id} className={`${styles.item} ${styles.pastItem}`}>
                <BookingItem booking={b} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}