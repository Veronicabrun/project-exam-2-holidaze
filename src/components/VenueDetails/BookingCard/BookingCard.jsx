// src/components/VenueDetails/BookingCard/BookingCard.jsx
import { Link } from "react-router-dom";
import styles from "./BookingCard.module.scss";

function nightsBetween(dateFrom, dateTo) {
  if (!dateFrom || !dateTo) return 0;
  const start = new Date(`${String(dateFrom).slice(0, 10)}T00:00:00.000Z`);
  const end = new Date(`${String(dateTo).slice(0, 10)}T00:00:00.000Z`);
  const diff = end.getTime() - start.getTime();
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export default function BookingCard({
  price,
  maxGuests,
  isLoggedIn,
  isOwner,
  dateFrom,
  dateTo,
  guests,
  onDateFromChange,
  onDateToChange,
  onGuestsChange,
  dateValidation,
  bookingLoading,
  bookingError,
  onSubmit,
}) {
  const today = new Date().toISOString().slice(0, 10);

  const nights = dateValidation?.ok ? nightsBetween(dateFrom, dateTo) : 0;
  const total = nights > 0 ? Number(price) * nights : 0;

  const disabled = !isLoggedIn || isOwner || bookingLoading || !dateValidation?.ok;

  function decGuests() {
    const next = Math.max(1, Number(guests) - 1);
    onGuestsChange(String(next));
  }

  function incGuests() {
    const next = Math.min(Number(maxGuests || 1), Number(guests) + 1);
    onGuestsChange(String(next));
  }

  return (
    <section className={styles.card} aria-label="Booking card">
      <div className={styles.priceRow}>
        <div className={styles.price}>
          <span className={styles.amount}>${price}</span>
          <span className={styles.per}>/ night</span>
        </div>

        {nights > 0 && (
          <div className={styles.nights}>
            {nights} night{nights === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {!isLoggedIn && (
        <div className={styles.notice}>
          You must be logged in to book. <Link to="/login">Go to login</Link>
        </div>
      )}

      {isLoggedIn && isOwner && (
        <div className={styles.noticeInfo}>
          You manage this venue, so you can’t book it yourself.
        </div>
      )}

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="booking-from">
              Check in
            </label>
            <input
              id="booking-from"
              type="date"
              value={dateFrom}
              min={today}
              onChange={(e) => onDateFromChange(e.target.value)}
              disabled={!isLoggedIn || isOwner}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="booking-to">
              Check out
            </label>
            <input
              id="booking-to"
              type="date"
              value={dateTo}
              min={dateFrom || today}
              onChange={(e) => onDateToChange(e.target.value)}
              disabled={!isLoggedIn || isOwner}
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="booking-guests">
            Travelers
          </label>

          <div className={styles.stepper}>
            <button
              type="button"
              onClick={decGuests}
              className={styles.stepBtn}
              disabled={!isLoggedIn || isOwner || Number(guests) <= 1}
              aria-label="Decrease guests"
            >
              −
            </button>

            <input
              id="booking-guests"
              type="number"
              min="1"
              max={maxGuests}
              value={guests}
              onChange={(e) => onGuestsChange(e.target.value)}
              disabled={!isLoggedIn || isOwner}
              className={styles.stepInput}
              required
            />

            <button
              type="button"
              onClick={incGuests}
              className={styles.stepBtn}
              disabled={!isLoggedIn || isOwner || Number(guests) >= Number(maxGuests || 1)}
              aria-label="Increase guests"
            >
              +
            </button>
          </div>

          <div className={styles.hint}>Max guests: {maxGuests}</div>
        </div>

        {!dateValidation?.ok && dateFrom && dateTo && (
          <p className={styles.fieldError} role="alert">
            {dateValidation.message}
          </p>
        )}

        {bookingError && (
          <p className={styles.fieldError} role="alert">
            {bookingError}
          </p>
        )}

        <button type="submit" className={styles.btn} disabled={disabled}>
          {bookingLoading ? "Booking..." : "Book"}
        </button>

        <div className={styles.total}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{total > 0 ? `$${total}` : "—"}</span>
          </div>

          <div className={styles.totalSub}>
            {nights > 0
              ? `$${price} × ${nights} night${nights === 1 ? "" : "s"}`
              : "Select dates to see total"}
          </div>
        </div>
      </form>
    </section>
  );
}