import { Link } from "react-router-dom";
import { GuestsIcon, BookingsIcon } from "../../ui/Icons/Icons";
import styles from "./BookingItem.module.scss";

function dateOnly(iso) {
  if (!iso) return "";
  return String(iso).slice(0, 10);
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

  const from = dateOnly(booking?.dateFrom);
  const to = dateOnly(booking?.dateTo);

  const href = venueId ? `/venue/${venueId}` : "/venues";

  return (
    <Link
      to={href}
      className={styles.card}
      aria-label={`View booking for ${venueName}`}
    >
      <div className={styles.mediaWrap}>
        <img
          className={styles.media}
          src={img.url}
          alt={img.alt}
          loading="lazy"
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{venueName}</h3>

        <div className={styles.metaRow}>
          <p className={styles.dates}>
            <BookingsIcon className={styles.iconSmall} />
            <span>{from && to ? `${from} → ${to}` : "Dates unavailable"}</span>
          </p>

          <div className={styles.guests} aria-label={`${booking?.guests || 1} guests`}>
            <GuestsIcon className={styles.icon} />
            <span>{booking?.guests || 1}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}