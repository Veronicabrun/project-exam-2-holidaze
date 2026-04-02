import styles from "./UpcomingBookings.module.scss";

function dateOnly(iso) {
  if (!iso) return "";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export default function UpcomingBookings({ bookings = [] }) {
  const sorted = bookings
    .slice()
    .filter((b) => dateOnly(b?.dateFrom) && dateOnly(b?.dateTo))
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