import {
  GuestsIcon,
  LocationIcon,
  WifiIcon,
  PetsIcon,
  StarIcon,
} from "../../ui/Icons/Icons";
import styles from "./VenueHeader.module.scss";

function safeText(value, fallback = "") {
  return value ? String(value) : fallback;
}

export default function VenueHeader({ venue }) {
  const imageUrl =
    venue?.media?.[0]?.url || "https://placehold.co/1200x700?text=Venue";
  const imageAlt = venue?.media?.[0]?.alt || venue?.name || "Venue image";

  const city = safeText(venue?.location?.city);
  const country = safeText(venue?.location?.country);
  const location = [city, country].filter(Boolean).join(", ");

  const ownerName = venue?.owner?.name || "";
  const ownerAvatarUrl = venue?.owner?.avatar?.url || "";
  const ownerAvatarAlt = venue?.owner?.avatar?.alt || ownerName || "Host avatar";

  const rating = typeof venue?.rating === "number" ? venue.rating : 0;
  const hasWifi = Boolean(venue?.meta?.wifi);
  const hasPets = Boolean(venue?.meta?.pets);

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

        <div className={styles.ratingRow}>
          <StarIcon className={styles.ratingIcon} />
          <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
        </div>

        <div className={styles.meta}>
          <span className={styles.pill}>
            <GuestsIcon className={styles.icon} />
            <span>{venue.maxGuests} guests</span>
          </span>

          {location ? (
            <span className={styles.pill}>
              <LocationIcon className={styles.icon} />
              <span>{location}</span>
            </span>
          ) : null}

          {hasWifi ? (
            <span className={styles.pill}>
              <WifiIcon className={styles.icon} />
              <span>Wifi</span>
            </span>
          ) : null}

          {hasPets ? (
            <span className={styles.pill}>
              <PetsIcon className={styles.icon} />
              <span>Pets</span>
            </span>
          ) : null}

          {ownerName ? (
            <span className={styles.pill}>
              {ownerAvatarUrl ? (
                <img
                  className={styles.hostAvatar}
                  src={ownerAvatarUrl}
                  alt={ownerAvatarAlt}
                />
              ) : (
                <span className={styles.hostFallback} aria-hidden="true">
                  {ownerName.charAt(0).toUpperCase()}
                </span>
              )}

              <span>{ownerName}</span>
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}