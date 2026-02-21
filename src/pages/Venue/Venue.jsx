// src/pages/Venue/Venue.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVenue } from "../../services/venues";
import { createBooking } from "../../services/bookings";
import { getAuth } from "../../utils/auth";
import { isDateRangeAvailable, toDateOnly, rangesOverlap } from "../../services/availability";

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

  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Booking state
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);

  // ❌ bookingMsg fjernes (suksess -> toast)
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // ✅ Toast state (bruker din eksisterende Toast.jsx)
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

  // Auth state (så UI reagerer på login/logout)
  const [auth, setAuthState] = useState(() => getAuth() || null);

  useEffect(() => {
    function syncAuth() {
      setAuthState(getAuth() || null);
    }

    window.addEventListener("authchange", syncAuth);
    window.addEventListener("storage", syncAuth);
    syncAuth();

    return () => {
      window.removeEventListener("authchange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

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

  const isLoggedIn = Boolean(auth?.token);

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

    // ❌ ikke lenger bookingMsg
    setBookingError("");

    if (!isLoggedIn) {
      setBookingError("You must be logged in to book.");
      showToast({ variant: "error", message: "You must be logged in to book." });
      return;
    }

    if (isOwner) {
      setBookingError("You cannot book your own venue.");
      showToast({ variant: "error", message: "You cannot book your own venue." });
      return;
    }

    if (!dateValidation.ok) {
      setBookingError(dateValidation.message);
      // Her holder det ofte å vise inline under feltene,
      // men du kan også vise toast hvis du vil:
      // showToast({ variant: "error", message: dateValidation.message });
      return;
    }

    try {
      setBookingLoading(true);

      const payload = {
        dateFrom,
        dateTo,
        guests: Number(guests),
        venueId: id,
      };

      await createBooking(payload);

      // ✅ Toast på suksess
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
      {/* ✅ Toast øverst høyre (fixed i Toast.jsx) */}
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
        {/* Left column */}
        <div className={styles.left}>
          <section className={styles.card}>
            <h2 className={styles.h2}>About</h2>
            <p className={styles.text}>{venue.description || "No description provided."}</p>
          </section>

          <BookedDates ranges={bookedRanges} />

          {/* Kun eier får “Upcoming bookings” */}
          {isLoggedIn && isOwner && <UpcomingBookings bookings={venue.bookings || []} />}
        </div>

        {/* Right column */}
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