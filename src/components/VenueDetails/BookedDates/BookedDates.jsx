// src/components/VenueDetails/BookedDates.jsx
import styles from "./BookedDates.module.scss";

export default function BookedDates({ ranges = [] }) {
  return (
    <section className={styles.card} aria-label="Unavailable dates">
      <h2 className={styles.h2}>Unavailable dates</h2>

      {ranges.length === 0 ? (
        <p className={styles.muted}>No bookings yet — looks available.</p>
      ) : (
        <details className={styles.details}>
          <summary className={styles.summary}>
            View booked periods ({ranges.length})
          </summary>

          <ul className={styles.list}>
            {ranges.slice(0, 25).map((r) => (
              <li key={r.id} className={styles.item}>
                {r.fromISO} → {r.toISO}
              </li>
            ))}
          </ul>

          {ranges.length > 25 && (
            <p className={styles.muted}>Showing first 25.</p>
          )}
        </details>
      )}
    </section>
  );
}