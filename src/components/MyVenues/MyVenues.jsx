import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../ui/Loading/Loading";
import ErrorMessage from "../ui/ErrorMessage/ErrorMessage";
import { deleteVenue, getMyVenues, getVenue } from "../../services/venues";

import {
  EditIcon,
  DeleteIcon,
  BookingsIcon,
  GuestsIcon,
  LocationIcon,
} from "../ui/Icons/Icons";

import EditVenueModal from "./EditVenueModal/EditVenueModal";
import DeleteVenueModal from "./DeleteVenueModal/DeleteVenueModal";

import styles from "./MyVenues.module.scss";

function dateOnly(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function MyVenues({ username, onToast }) {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [expanded, setExpanded] = useState(null);
  const [bookingsByVenue, setBookingsByVenue] = useState({});
  const [loadingBookingsId, setLoadingBookingsId] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

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

      setVenues((prev) => prev.filter((v) => v.id !== venueToDelete.id));

      closeDelete();
    } catch (e) {
      onToast?.({
        variant: "error",
        message: e?.message || "Failed to delete venue.",
      });
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

    if (bookingsByVenue[venueId]) return;

    try {
      setLoadingBookingsId(venueId);
      const venueWithBookings = await getVenue(venueId, { withBookings: true });
      const bookings = venueWithBookings?.bookings || [];

      setBookingsByVenue((prev) => ({
        ...prev,
        [venueId]: bookings,
      }));
    } catch (e) {
      onToast?.({
        variant: "error",
        message: e?.message || "Could not load bookings.",
      });
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
        <p className={styles.subtitle}>
          Manage venues you own (edit, delete, view bookings).
        </p>
      </header>

      <ErrorMessage message={error} />

      {!error && !hasVenues && (
        <p className={styles.empty}>
          You don’t have any venues yet. Go to <strong>Add venue</strong> to
          create one.
        </p>
      )}

      {hasVenues && (
        <ul className={styles.grid}>
          {venues.map((v) => (
            <li
              key={v.id}
              className={styles.card}
              onClick={() => navigate(`/venue/${v.id}`)}
              aria-label={`View ${v.name}`}
            >
              <div className={styles.mediaWrap}>
                <img
                  className={styles.media}
                  src={
                    v.media?.[0]?.url ||
                    "https://placehold.co/600x400?text=Venue"
                  }
                  alt={v.media?.[0]?.alt || v.name || "Venue"}
                  loading="lazy"
                />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.topRow}>
                  <h3 className={styles.cardTitle}>{v.name}</h3>

                  <div className={styles.price}>
                    <span className={styles.priceValue}>${v.price}</span>
                    <span className={styles.priceSuffix}>/ night</span>
                  </div>
                </div>

                <p className={styles.cardDesc}>
                  {v.description || "No description."}
                </p>

                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>
                    <GuestsIcon className={styles.metaIcon} />
                    <span>
                      {v.maxGuests ? `${v.maxGuests} guests` : "Guests unavailable"}
                    </span>
                  </span>

                  <span className={styles.metaDivider}>•</span>

                  <span className={styles.metaItem}>
                    <LocationIcon className={styles.metaIcon} />
                    <span>{v.location?.country || "Country unavailable"}</span>
                  </span>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(v);
                    }}
                    aria-label={`Edit ${v.name}`}
                    title="Edit"
                  >
                    <EditIcon />
                  </button>

                  <button
                    type="button"
                    className={`${styles.iconBtn} ${styles.danger}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDelete(v);
                    }}
                    aria-label={`Delete ${v.name}`}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </button>

                  <button
                    type="button"
                    className={`${styles.iconBtn} ${
                      expanded === v.id ? styles.activeIcon : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookings(v.id);
                    }}
                    aria-label={
                      expanded === v.id
                        ? `Hide bookings for ${v.name}`
                        : `View bookings for ${v.name}`
                    }
                    title={expanded === v.id ? "Hide bookings" : "View bookings"}
                  >
                    <BookingsIcon />
                  </button>
                </div>
              </div>

              {expanded === v.id && (
                <div
                  className={styles.bookings}
                  onClick={(e) => e.stopPropagation()}
                >
                  {loadingBookingsId === v.id ? (
                    <Loading text="Loading bookings..." />
                  ) : (
                    <>
                      <h4 className={styles.bookingsTitle}>Bookings</h4>

                      {(bookingsByVenue[v.id] || []).length === 0 ? (
                        <p className={styles.bookingsEmpty}>
                          No bookings yet for this venue.
                        </p>
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
                              <div className={styles.bookingMeta}>
                                Guests: {b.guests}
                              </div>
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