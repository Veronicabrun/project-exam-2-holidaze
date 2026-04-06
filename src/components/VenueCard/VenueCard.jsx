import { Link } from "react-router-dom";
import { GuestsIcon, LocationIcon } from "../ui/Icons/Icons";
import styles from "./VenueCard.module.scss";

function safeText(value, fallback = "") {
  return value ? String(value) : fallback;
}

export default function VenueCard({ venue }) {
  if (!venue) return null;

  const id = venue?.id;
  const name = safeText(venue?.name, "Venue");

  const imageUrl =
    venue?.media?.[0]?.url || "https://placehold.co/900x600?text=Venue";
  const imageAlt = venue?.media?.[0]?.alt || name;

  const country = safeText(venue?.location?.country, "Somewhere in the world");
  const maxGuests = venue?.maxGuests;
  const price = venue?.price;

  const href = id ? `/venue/${id}` : "/venues";

  return (
    <Link to={href} className={styles.card} aria-label={`View ${name}`}>
      <div className={styles.mediaWrap}>
        <img
          className={styles.media}
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
        />
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <h3 className={styles.title}>{name}</h3>

          <div className={styles.price}>
            {typeof price === "number" ? (
              <>
                <span className={styles.priceValue}>${price}</span>
                <span className={styles.priceSuffix}>/ night</span>
              </>
            ) : (
              <span className={styles.priceUnavailable}>Price unavailable</span>
            )}
          </div>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <GuestsIcon className={styles.metaIcon} />
            <span>
              {maxGuests ? `${maxGuests} guests` : "Guests unavailable"}
            </span>
          </span>

          <span className={styles.metaDivider}>•</span>

          <span className={styles.metaItem}>
            <LocationIcon className={styles.metaIcon} />
            <span>{country}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}