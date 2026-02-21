// src/components/VenueDetails/UpcomingBookings.jsx
import styles from "./UpcomingBookings.module.scss";

function dateOnly(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

export default function UpcomingBookings({ bookings = [] }) {
  const sorted = bookings
    .slice()
    .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

  return (
    <section className={styles.card} aria-label="Upcoming bookings">
      <h2 className={styles.h2}>Upcoming bookings</h2>

      {sorted.length === 0 ? (
        <p className={styles.muted}>No upcoming bookings yet.</p>
      ) : (
        <ul className={styles.list}>
          {sorted.slice(0, 20).map((b) => (
            <li key={b.id} className={styles.item}>
              <div className={styles.name}>
                {b.customer?.name || "Customer"}
              </div>
              <div className={styles.meta}>
                Check in: {dateOnly(b.dateFrom)} · Checkout: {dateOnly(b.dateTo)}
              </div>
              <div className={styles.meta}>Guests: {b.guests}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}