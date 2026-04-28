import { useMemo } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./BookingCard.module.scss";

function nightsBetween(dateFrom, dateTo) {
  if (!dateFrom || !dateTo) return 0;

  const start = new Date(`${String(dateFrom).slice(0, 10)}T00:00:00.000Z`);
  const end = new Date(`${String(dateTo).slice(0, 10)}T00:00:00.000Z`);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff <= 0) return 0;

  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function parseDateOnly(value) {
  if (!value) return null;

  const date =
    value instanceof Date
      ? new Date(
          Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
        )
      : new Date(`${String(value).slice(0, 10)}T00:00:00.000Z`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateOnly(value) {
  const date = parseDateOnly(value);
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getDisabledDates(bookings = []) {
  const dates = [];

  for (const booking of bookings) {
    const start = parseDateOnly(booking?.dateFrom);
    const end = parseDateOnly(booking?.dateTo);

    if (!start || !end || end <= start) continue;

    let current = new Date(start);

    while (current < end) {
      dates.push(new Date(current));
      current = addDays(current, 1);
    }
  }

  return dates;
}

export default function BookingCard({
  price,
  maxGuests,
  isLoggedIn,
  isOwner,
  bookings = [],
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
  const today = useMemo(() => parseDateOnly(new Date()), []);
  const startDate = parseDateOnly(dateFrom);
  const endDate = parseDateOnly(dateTo);

  const disabledDates = useMemo(() => getDisabledDates(bookings), [bookings]);

  const nights = dateValidation?.ok ? nightsBetween(dateFrom, dateTo) : 0;
  const total = nights > 0 ? Number(price) * nights : 0;

  const disabled =
    !isLoggedIn || isOwner || bookingLoading || !dateValidation?.ok;

  function decGuests() {
    const next = Math.max(1, Number(guests) - 1);
    onGuestsChange(String(next));
  }

  function incGuests() {
    const next = Math.min(Number(maxGuests || 1), Number(guests) + 1);
    onGuestsChange(String(next));
  }

  function handleRangeChange(dates) {
    const [start, end] = dates;

    onDateFromChange(start ? formatDateOnly(start) : "");
    onDateToChange(end ? formatDateOnly(end) : "");
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
          You are the manager of this venue, so booking is disabled.
        </div>
      )}

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="booking-range">
            Select stay
          </label>

          <DatePicker
            id="booking-range"
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleRangeChange}
            minDate={today}
            excludeDates={disabledDates}
            disabled={!isLoggedIn || isOwner}
            className={styles.input}
            placeholderText="Select check-in and check-out"
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </div>

        <div className={styles.datePreview}>
          <div className={styles.previewBox}>
            <span className={styles.previewLabel}>Check in</span>
            <span className={styles.previewValue}>{dateFrom || "—"}</span>
          </div>

          <div className={styles.previewBox}>
            <span className={styles.previewLabel}>Check out</span>
            <span className={styles.previewValue}>{dateTo || "—"}</span>
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
              disabled={
                !isLoggedIn ||
                isOwner ||
                Number(guests) >= Number(maxGuests || 1)
              }
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
            <span className={styles.totalValue}>
              {total > 0 ? `$${total}` : "—"}
            </span>
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