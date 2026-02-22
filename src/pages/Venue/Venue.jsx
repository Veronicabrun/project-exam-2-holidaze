// src/pages/Venue/Venue.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVenue } from "../../services/venues";
import { createBooking } from "../../services/bookings";
import { isDateRangeAvailable, toDateOnly, rangesOverlap } from "../../services/availability";

import useAuth from "../../hooks/useAuth";

import VenueHeader from "../../components/VenueDetails/VenueHeader/VenueHeader";
import BookingCard from "../../components/VenueDetails/BookingCard/BookingCard";
import BookedDates from "../../components/VenueDetails/BookedDates/BookedDates";
import UpcomingBookings from "../../components/VenueDetails/UpcomingBookings/UpcomingBookings";

import Toast from "../../components/ui/Toast/Toast";
import styles from "./Venue.module.scss";

function toDateOnlyISO(isoString) {
  return new Date(isoString).toISOString().slice(0, 10);
}

export default function Venue() {
  const { id } = useParams();

  const auth = useAuth();
  const isLoggedIn = Boolean(auth?.token);

  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Booking state
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);

  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    variant: "success",
    id: 0,
  });

  function showToast({ message, variant = "success" }) {
    setToast((t) => ({
      id: t.id + 1,
      open: true,
      message,
      variant,
    }));
  }

  function closeToast() {
    setToast((t) => ({ ...t, open: false }));
  }

  async function fetchVenue() {
    setError("");
    setIsLoading(true);

    try {
      const venueData = await getVenue(id, { withBookings: true, withOwner: true });
      setVenue(venueData);
    } catch (err) {
      setError(err?.message || "Failed to load venue.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isOwner = useMemo(() => {
    const myName = auth?.name;
    const ownerName = venue?.owner?.name;
    if (!myName || !ownerName) return false;
    return myName === ownerName;
  }, [auth?.name, venue?.owner?.name]);

  const bookedRanges = useMemo(() => {
    const list = venue?.bookings || [];
    return list
      .map((b) => ({
        id: b.id,
        fromISO: toDateOnlyISO(b.dateFrom),
        toISO: toDateOnlyISO(b.dateTo),
      }))
      .sort((a, b) => new Date(a.fromISO) - new Date(b.fromISO));
  }, [venue]);

  const dateValidation = useMemo(() => {
    if (!dateFrom || !dateTo) return { ok: true, message: "" };

    const start = toDateOnly(dateFrom);
    const end = toDateOnly(dateTo);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return { ok: false, message: "Invalid date selection." };
    }

    if (end <= start) {
      return { ok: false, message: "Check-out must be after check-in." };
    }

    const available = isDateRangeAvailable({
      dateFrom,
      dateTo,
      bookings: venue?.bookings || [],
    });

    if (!available) {
      const overlap = (venue?.bookings || []).find((b) => {
        const bStart = toDateOnly(b.dateFrom);
        const bEnd = toDateOnly(b.dateTo);
        return rangesOverlap(start, end, bStart, bEnd);
      });

      if (overlap) {
        const fromISO = toDateOnlyISO(overlap.dateFrom);
        const toISO = toDateOnlyISO(overlap.dateTo);
        return {
          ok: false,
          message: `Those dates are unavailable (overlaps ${fromISO} → ${toISO}).`,
        };
      }

      return { ok: false, message: "Those dates are unavailable (overlaps an existing booking)." };
    }

    return { ok: true, message: "" };
  }, [dateFrom, dateTo, venue?.bookings]);

  async function handleBookingSubmit(e) {
    e.preventDefault();
    setBookingError("");

    if (!isLoggedIn) {
      const msg = "You must be logged in to book.";
      setBookingError(msg);
      showToast({ variant: "error", message: msg });
      return;
    }

    if (isOwner) {
      const msg = "You cannot book your own venue.";
      setBookingError(msg);
      showToast({ variant: "error", message: msg });
      return;
    }

    if (!dateValidation.ok) {
      setBookingError(dateValidation.message);
      return;
    }

    try {
      setBookingLoading(true);

      await createBooking({
        dateFrom,
        dateTo,
        guests: Number(guests),
        venueId: id,
      });

      showToast({ variant: "success", message: "Booking confirmed!" });

      await fetchVenue();

      setDateFrom("");
      setDateTo("");
      setGuests(1);
    } catch (err) {
      const msg = err?.message || "Booking failed.";
      setBookingError(msg);
      showToast({ variant: "error", message: msg });
    } finally {
      setBookingLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p className={styles.status}>Loading venue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className={styles.page}>
        <p className={styles.status}>No venue found.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Toast
        key={toast.id}
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        duration={2500}
        onClose={closeToast}
      />

      <div className={styles.breadcrumb}>
        <Link to="/venues" className={styles.back}>
          ← Back to venues
        </Link>
      </div>

      <VenueHeader venue={venue} />

      <div className={styles.grid}>
        <div className={styles.left}>
          <section className={styles.card}>
            <h2 className={styles.h2}>About</h2>
            <p className={styles.text}>{venue.description || "No description provided."}</p>
          </section>

          <BookedDates ranges={bookedRanges} />

          {isLoggedIn && isOwner && <UpcomingBookings bookings={venue.bookings || []} />}
        </div>

        <aside className={styles.right}>
          <BookingCard
            price={venue.price}
            maxGuests={venue.maxGuests}
            isLoggedIn={isLoggedIn}
            isOwner={isOwner}
            dateFrom={dateFrom}
            dateTo={dateTo}
            guests={guests}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onGuestsChange={setGuests}
            dateValidation={dateValidation}
            bookingLoading={bookingLoading}
            bookingError={bookingError}
            onSubmit={handleBookingSubmit}
          />
        </aside>
      </div>
    </div>
  );
}