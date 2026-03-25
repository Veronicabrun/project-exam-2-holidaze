import { useEffect, useMemo, useState } from "react";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import { updateVenue } from "../../../services/venues";
import {
  buildVenuePayload,
  toVenueInitialValues,
  validateVenue,
  venueAllTouched,
} from "../../../utils/venueForm";
import styles from "./EditVenueModal.module.scss";

export default function EditVenueModal({
  open,
  venue,
  onClose,
  onUpdated,
  onToast,
}) {
  const [values, setValues] = useState(toVenueInitialValues(venue));
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(toVenueInitialValues(venue));
    setTouched({});
    setSubmitError("");
  }, [open, venue]);

  const errors = useMemo(
    () => validateVenue(values, { mediaRequired: false }),
    [values]
  );

  function showError(field) {
    return Boolean(touched[field] && errors[field]);
  }

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setTouched(venueAllTouched);

    const currentErrors = validateVenue(values, { mediaRequired: false });
    if (Object.keys(currentErrors).length > 0) {
      onToast?.({
        variant: "error",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    try {
      setIsSaving(true);
      const payload = buildVenuePayload(values);

      await updateVenue(venue.id, payload);

      onToast?.({ variant: "success", message: "Venue updated!" });
      onUpdated?.();
    } catch (e) {
      const msg = e?.message || "Failed to update venue.";
      setSubmitError(msg);
      onToast?.({ variant: "error", message: msg });
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onMouseDown={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-venue-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h3 id="edit-venue-title" className={styles.title}>
            Edit venue
          </h3>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <p className={styles.subtitle}>
          Updating: <strong>{venue?.name}</strong>
        </p>

        <ErrorMessage message={submitError} />

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-name">
              Venue name
            </label>
            <input
              id="edit-name"
              className={`${styles.input} ${showError("name") ? styles.inputError : ""}`}
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => markTouched("name")}
              aria-invalid={showError("name")}
            />
            {showError("name") && (
              <p className={styles.fieldError}>{errors.name}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-description">
              Description
            </label>
            <textarea
              id="edit-description"
              rows={4}
              className={`${styles.textarea} ${showError("description") ? styles.inputError : ""}`}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              onBlur={() => markTouched("description")}
              aria-invalid={showError("description")}
            />
            {showError("description") && (
              <p className={styles.fieldError}>{errors.description}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-media">
              Media URL (optional)
            </label>
            <input
              id="edit-media"
              className={`${styles.input} ${showError("mediaUrl") ? styles.inputError : ""}`}
              value={values.mediaUrl}
              onChange={(e) => setField("mediaUrl", e.target.value)}
              onBlur={() => markTouched("mediaUrl")}
              placeholder="https://..."
              aria-invalid={showError("mediaUrl")}
            />
            {showError("mediaUrl") && (
              <p className={styles.fieldError}>{errors.mediaUrl}</p>
            )}
          </div>

          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="edit-price">
                Price
              </label>
              <input
                id="edit-price"
                type="number"
                min={1}
                className={`${styles.input} ${showError("price") ? styles.inputError : ""}`}
                value={values.price}
                onChange={(e) => setField("price", e.target.value)}
                onBlur={() => markTouched("price")}
                aria-invalid={showError("price")}
              />
              {showError("price") && (
                <p className={styles.fieldError}>{errors.price}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="edit-maxGuests">
                Max guests
              </label>
              <input
                id="edit-maxGuests"
                type="number"
                min={1}
                className={`${styles.input} ${showError("maxGuests") ? styles.inputError : ""}`}
                value={values.maxGuests}
                onChange={(e) => setField("maxGuests", e.target.value)}
                onBlur={() => markTouched("maxGuests")}
                aria-invalid={showError("maxGuests")}
              />
              {showError("maxGuests") && (
                <p className={styles.fieldError}>{errors.maxGuests}</p>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-country">
              Country
            </label>
            <input
              id="edit-country"
              className={`${styles.input} ${showError("country") ? styles.inputError : ""}`}
              value={values.country}
              onChange={(e) => setField("country", e.target.value)}
              onBlur={() => markTouched("country")}
              aria-invalid={showError("country")}
            />
            {showError("country") && (
              <p className={styles.fieldError}>{errors.country}</p>
            )}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className={styles.btn} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
