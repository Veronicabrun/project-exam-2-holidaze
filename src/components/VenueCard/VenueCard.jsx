import { Link } from "react-router-dom";
import styles from "./VenueCard.module.scss";

function safeText(value, fallback = "") {
  return value ? String(value) : fallback;
}

export default function VenueCard({ venue }) {
  const imageUrl = venue?.media?.[0]?.url || "https://placehold.co/900x600?text=Venue";
  const imageAlt = venue?.media?.[0]?.alt || venue?.name || "Venue";

  const city = safeText(venue?.location?.city);
  const country = safeText(venue?.location?.country);
  const location = [city, country].filter(Boolean).join(", ");

  return (
    <Link to={`/venue/${venue.id}`} className={styles.card} aria-label={`View ${venue.name}`}>
      <div className={styles.mediaWrap}>
        <img className={styles.media} src={imageUrl} alt={imageAlt} loading="lazy" />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{venue.name}</h3>
        <p className={styles.meta}>{location || "Somewhere in the world"}</p>

        <div className={styles.footer}>
          <span className={styles.small}>👤 {venue.maxGuests} guests</span>
          <span className={styles.price}>${venue.price} / night</span>
        </div>
      </div>
    </Link>
  );
}