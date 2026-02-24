// src/components/Profile/BookingItem/BookingItem.jsx
import { Link } from "react-router-dom";
import styles from "./BookingItem.module.scss";

function dateOnly(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

function getVenueImage(venue) {
  const url = venue?.media?.[0]?.url;
  const alt = venue?.media?.[0]?.alt || venue?.name || "Venue";
  return {
    url: url || "https://placehold.co/900x600?text=Venue",
    alt,
  };
}

export default function BookingItem({ booking }) {
  const venue = booking?.venue;
  const venueId = venue?.id;
  const venueName = venue?.name || "Venue";

  const img = getVenueImage(venue);

  const from = booking?.dateFrom ? dateOnly(booking.dateFrom) : "";
  const to = booking?.dateTo ? dateOnly(booking.dateTo) : "";

  const href = venueId ? `/venue/${venueId}` : "/venues";

  return (
    <Link to={href} className={styles.card} aria-label={`View booking for ${venueName}`}>
      <div className={styles.mediaWrap}>
        <img className={styles.media} src={img.url} alt={img.alt} loading="lazy" />
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{venueName}</h3>
          <span className={styles.badge}>
            {booking?.guests || 1} guest{booking?.guests === 1 ? "" : "s"}
          </span>
        </div>

        <p className={styles.dates}>
          {from && to ? (
            <>
              {from} → {to}
            </>
          ) : (
            "Dates unavailable"
          )}
        </p>
      </div>
    </Link>
  );
}