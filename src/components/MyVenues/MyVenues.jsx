import { useEffect, useMemo, useState } from "react";
import Loading from "../ui/Loading/Loading";
import ErrorMessage from "../ui/ErrorMessage/ErrorMessage";
import { deleteVenue, getMyVenues, getVenue } from "../../services/venues";

import EditVenueModal from "./EditVenueModal/EditVenueModal";
import DeleteVenueModal from "./DeleteVenueModal/DeleteVenueModal";

import styles from "./MyVenues.module.scss";

function dateOnly(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

// Simple inline SVG icons (consistent across platforms)
function Icon({ name }) {
  if (name === "edit") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.83H5v-.92l9.06-9.06.92.92L5.92 20.08zM20.71 7.04a1.003 1.003 0 0 0 0-1.42L18.37 3.29a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z" />
      </svg>
    );
  }

  if (name === "trash") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 7h12l-1 14H7L6 7zm3-3h6l1 2H8l1-2zM4 7h16v2H4V7z" />
      </svg>
    );
  }

  // calendar
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 8H6v10h14V10zM6 8h14V6H6v2z" />
    </svg>
  );
}

export default function MyVenues({ username, onToast }) {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // bookings state per venueId
  const [expanded, setExpanded] = useState(null);
  const [bookingsByVenue, setBookingsByVenue] = useState({});
  const [loadingBookingsId, setLoadingBookingsId] = useState(null);

  // edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  // delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadMyVenues() {
    if (!username) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await getMyVenues(username);
      setVenues(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Could not load your venues.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMyVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const hasVenues = useMemo(() => venues.length > 0, [venues]);

  function openEdit(venue) {
    setSelectedVenue(venue);
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setSelectedVenue(null);
  }

  function openDelete(venue) {
    setVenueToDelete(venue);
    setDeleteOpen(true);
  }

  function closeDelete() {
    if (isDeleting) return;
    setDeleteOpen(false);
    setVenueToDelete(null);
  }

  async function confirmDelete() {
    if (!venueToDelete?.id) return;

    try {
      setIsDeleting(true);

      await deleteVenue(venueToDelete.id);

      onToast?.({ variant: "success", message: "Venue deleted." });

      // Optimistic remove
      setVenues((prev) => prev.filter((v) => v.id !== venueToDelete.id));

      closeDelete();
    } catch (e) {
      onToast?.({ variant: "error", message: e?.message || "Failed to delete venue." });
    } finally {
      setIsDeleting(false);
    }
  }

  async function toggleBookings(venueId) {
    if (expanded === venueId) {
      setExpanded(null);
      return;
    }

    setExpanded(venueId);

    // cached?
    if (bookingsByVenue[venueId]) return;

    try {
      setLoadingBookingsId(venueId);
      const venueWithBookings = await getVenue(venueId, { withBookings: true });
      const bookings = venueWithBookings?.bookings || [];
      setBookingsByVenue((prev) => ({ ...prev, [venueId]: bookings }));
    } catch (e) {
      onToast?.({ variant: "error", message: e?.message || "Could not load bookings." });
    } finally {
      setLoadingBookingsId(null);
    }
  }

  if (isLoading) return <Loading text="Loading your venues..." />;

  return (
    <section className={styles.wrapper} aria-labelledby="my-venues-title">
      <header className={styles.header}>
        <h2 id="my-venues-title" className={styles.title}>
          My venues
        </h2>
        <p className={styles.subtitle}>Manage venues you own (edit, delete, view bookings).</p>
      </header>

      <ErrorMessage message={error} />

      {!error && !hasVenues && (
        <p className={styles.empty}>
          You don’t have any venues yet. Go to <strong>Add venue</strong> to create one.
        </p>
      )}

      {hasVenues && (
        <ul className={styles.grid}>
          {venues.map((v) => (
            <li key={v.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.mediaWrap}>
                  <img
                    className={styles.media}
                    src={v.media?.[0]?.url || "https://placehold.co/600x400?text=Venue"}
                    alt={v.media?.[0]?.alt || v.name || "Venue"}
                    loading="lazy"
                  />
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{v.name}</h3>
                  <p className={styles.cardDesc}>{v.description || "No description."}</p>

                  <div className={styles.meta}>
                    <span>
                      <strong>Price:</strong> {v.price}
                    </span>
                    <span>
                      <strong>Guests:</strong> {v.maxGuests}
                    </span>
                    <span>
                      <strong>Country:</strong> {v.location?.country || "-"}
                    </span>
                  </div>

                  {/* Actions on one row */}
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => openEdit(v)}
                      aria-label={`Edit ${v.name}`}
                      title="Edit"
                    >
                      <Icon name="edit" />
                    </button>

                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.danger}`}
                      onClick={() => openDelete(v)}
                      aria-label={`Delete ${v.name}`}
                      title="Delete"
                    >
                      <Icon name="trash" />
                    </button>

                    <button
                      type="button"
                      className={`${styles.iconBtn} ${expanded === v.id ? styles.activeIcon : ""}`}
                      onClick={() => toggleBookings(v.id)}
                      aria-label={expanded === v.id ? `Hide bookings for ${v.name}` : `View bookings for ${v.name}`}
                      title={expanded === v.id ? "Hide bookings" : "View bookings"}
                    >
                      <Icon name="calendar" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bookings panel */}
              {expanded === v.id && (
                <div className={styles.bookings}>
                  {loadingBookingsId === v.id ? (
                    <Loading text="Loading bookings..." />
                  ) : (
                    <>
                      <h4 className={styles.bookingsTitle}>Bookings</h4>

                      {(bookingsByVenue[v.id] || []).length === 0 ? (
                        <p className={styles.bookingsEmpty}>No bookings yet for this venue.</p>
                      ) : (
                        <ul className={styles.bookingList}>
                          {(bookingsByVenue[v.id] || []).map((b) => (
                            <li key={b.id} className={styles.bookingItem}>
                              <div>
                                <strong>{b.customer?.name || "Customer"}</strong>
                              </div>
                              <div className={styles.bookingMeta}>
                                {dateOnly(b.dateFrom)} → {dateOnly(b.dateTo)}
                              </div>
                              <div className={styles.bookingMeta}>Guests: {b.guests}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <EditVenueModal
        open={editOpen}
        venue={selectedVenue}
        onClose={closeEdit}
        onToast={onToast}
        onUpdated={() => {
          closeEdit();
          loadMyVenues();
        }}
      />

      <DeleteVenueModal
        open={deleteOpen}
        venue={venueToDelete}
        isDeleting={isDeleting}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

