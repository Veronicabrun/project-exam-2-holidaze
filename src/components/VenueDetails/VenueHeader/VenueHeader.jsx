// src/components/VenueDetails/VenueHeader.jsx
import styles from "./VenueHeader.module.scss";

function safeText(value, fallback = "") {
  return value ? String(value) : fallback;
}

export default function VenueHeader({ venue }) {
  const imageUrl = venue?.media?.[0]?.url || "https://placehold.co/1200x700?text=Venue";
  const imageAlt = venue?.media?.[0]?.alt || venue?.name || "Venue image";

  const city = safeText(venue?.location?.city);
  const country = safeText(venue?.location?.country);
  const location = [city, country].filter(Boolean).join(", ");

  return (
    <header className={styles.header}>
      <div className={styles.mediaWrap}>
        <img className={styles.media} src={imageUrl} alt={imageAlt} />
      </div>

      <div className={styles.info}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>{venue.name}</h1>
          <div className={styles.price}>
            <span className={styles.amount}>${venue.price}</span>
            <span className={styles.per}>/ night</span>
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.pill}>👤 {venue.maxGuests} guests</span>
          {location ? <span className={styles.pill}>📍 {location}</span> : null}
          {venue?.owner?.name ? <span className={styles.pill}>🧑 Host: {venue.owner.name}</span> : null}
        </div>
      </div>
    </header>
  );
}