import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVenue } from "../../services/venues";
import { createBooking } from "../../services/bookings";
import { getAuth } from "../../utils/auth";

function toDateOnlyISO(isoString) {
  return new Date(isoString).toISOString().slice(0, 10);
}

function parseDateInput(value) {
  return new Date(`${value}T00:00:00.000Z`);
}

/**
 * Intervaller som [start, end) (end er utsjekk-dag / ikke inkludert)
 * Overlap hvis start < existingEnd && end > existingStart
 */
function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
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

  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // ✅ Auth state (så UI reagerer ved login/logout)
  const [auth, setAuth] = useState(() => getAuth() || null);

  useEffect(() => {
    function syncAuth() {
      setAuth(getAuth() || null);
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
      console.log("🟡 Loading venue id:", id);

      // ✅ Hent både bookings og owner
      const venueData = await getVenue(id, { withBookings: true, withOwner: true });
      console.log("🟢 Venue data:", venueData);

      setVenue(venueData);

      console.log("📅 Existing bookings:", venueData?.bookings?.length || 0);
      console.log("BOOKING EXAMPLE:", venueData?.bookings?.[0]);

      // Debug: sjekk at owner faktisk kommer med
      console.log("AUTH NAME:", auth?.name);
      console.log("VENUE OWNER:", venueData?.owner);
      console.log("OWNER NAME:", venueData?.owner?.name);
    } catch (err) {
      console.error("❌ Venue error:", err);
      setError(err.message || "Failed to load venue");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ✅ Er dette venue eid av innlogget bruker?
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
        fromDate: parseDateInput(toDateOnlyISO(b.dateFrom)),
        toDate: parseDateInput(toDateOnlyISO(b.dateTo)),
      }))
      .sort((a, b) => a.fromDate - b.fromDate);
  }, [venue]);

  const dateValidation = useMemo(() => {
    if (!dateFrom || !dateTo) return { ok: true, message: "" };

    const start = parseDateInput(dateFrom);
    const end = parseDateInput(dateTo);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return { ok: false, message: "Invalid date selection." };
    }

    if (end <= start) {
      return { ok: false, message: "Date to must be after date from." };
    }

    const overlap = bookedRanges.find((r) =>
      rangesOverlap(start, end, r.fromDate, r.toDate)
    );

    if (overlap) {
      return {
        ok: false,
        message: `Those dates are unavailable (overlaps ${overlap.fromISO} → ${overlap.toISO}).`,
      };
    }

    return { ok: true, message: "" };
  }, [dateFrom, dateTo, bookedRanges]);

  async function handleBookingSubmit(e) {
    e.preventDefault();
    setBookingMsg("");
    setBookingError("");

    if (!auth?.token) {
      setBookingError("You must be logged in to book.");
      return;
    }

    // ✅ BLOCK: eier kan ikke booke eget venue
    if (isOwner) {
      setBookingError("You cannot book your own venue.");
      return;
    }

    if (!dateValidation.ok) {
      setBookingError(dateValidation.message);
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

      console.log("🔵 BOOKING submit payload:", payload);

      const res = await createBooking(payload);
      console.log("🟢 Booking response:", res);

      setBookingMsg("✅ Booking created!");

      console.log("🟡 Refreshing venue after booking...");
      await fetchVenue();

      setDateFrom("");
      setDateTo("");
      setGuests(1);
    } catch (err) {
      console.error("❌ Booking error:", err);
      setBookingError(err.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  }

  if (isLoading) return <p style={{ padding: "1rem" }}>Loading venue...</p>;
  if (error) return <p style={{ padding: "1rem", color: "crimson" }}>{error}</p>;
  if (!venue) return <p style={{ padding: "1rem" }}>No venue found.</p>;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={{ padding: "1rem" }}>
      <p style={{ marginTop: 0 }}>
        <Link to="/venues">← Back to venues</Link>
      </p>

      <h1 style={{ marginBottom: 6 }}>{venue.name}</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Price: {venue.price} · Max guests: {venue.maxGuests}
      </p>

      {venue.description && <p>{venue.description}</p>}

      <hr style={{ margin: "24px 0" }} />

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Unavailable dates</h2>

        {bookedRanges.length === 0 ? (
          <p style={{ opacity: 0.8 }}>No bookings yet — looks available.</p>
        ) : (
          <details>
            <summary style={{ cursor: "pointer" }}>
              View booked periods ({bookedRanges.length})
            </summary>

            <ul style={{ marginTop: 10 }}>
              {bookedRanges.slice(0, 20).map((r) => (
                <li key={r.id}>
                  {r.fromISO} → {r.toISO}
                </li>
              ))}
            </ul>

            {bookedRanges.length > 20 && (
              <p style={{ opacity: 0.8 }}>Showing first 20.</p>
            )}
          </details>
        )}
      </section>

      <hr style={{ margin: "24px 0" }} />

      <h2>Book this venue</h2>

      {!auth?.token && (
        <p style={{ background: "#fff3cd", padding: 12, borderRadius: 8 }}>
          You must be logged in to book. <Link to="/login">Go to login</Link>
        </p>
      )}

      {/* ✅ Info til venue owner */}
      {auth?.token && isOwner && (
        <p style={{ background: "#e7f3ff", padding: 12, borderRadius: 8 }}>
          You manage this venue, so you can’t book it yourself.
        </p>
      )}

      <form onSubmit={handleBookingSubmit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 12 }}>
          <label>From</label>
          <input
            type="date"
            value={dateFrom}
            min={today}
            onChange={(e) => setDateFrom(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
            disabled={!auth?.token || isOwner}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>To</label>
          <input
            type="date"
            value={dateTo}
            min={dateFrom || today}
            onChange={(e) => setDateTo(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
            disabled={!auth?.token || isOwner}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Guests</label>
          <input
            type="number"
            min="1"
            max={venue.maxGuests}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
            disabled={!auth?.token || isOwner}
          />
          <small style={{ opacity: 0.8 }}>
            Max guests for this venue: {venue.maxGuests}
          </small>
        </div>

        {!dateValidation.ok && (
          <p style={{ color: "crimson", marginTop: 0 }}>
            {dateValidation.message}
          </p>
        )}

        <button
          type="submit"
          disabled={!auth?.token || isOwner || bookingLoading || !dateValidation.ok}
        >
          {bookingLoading ? "Booking..." : "Book now"}
        </button>

        {bookingMsg && <p style={{ color: "green" }}>{bookingMsg}</p>}
        {bookingError && <p style={{ color: "crimson" }}>{bookingError}</p>}
      </form>
    </div>
  );
}

