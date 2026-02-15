// src/components/MyVenues/EditVenueModal/EditVenueModal.jsx
import { useEffect, useMemo, useState } from "react";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import { updateVenue } from "../../../services/venues";
import styles from "./EditVenueModal.module.scss";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Venue name is required.";
  if (!values.description.trim()) errors.description = "Description is required.";

  if (values.mediaUrl.trim()) {
    try {
      new URL(values.mediaUrl);
    } catch {
      errors.mediaUrl = "Media URL must be a valid URL.";
    }
  }

  const price = Number(values.price);
  if (!values.price) errors.price = "Price is required.";
  else if (Number.isNaN(price) || price < 1) errors.price = "Price must be a number (min 1).";

  const maxGuests = Number(values.maxGuests);
  if (!values.maxGuests) errors.maxGuests = "Max guests is required.";
  else if (Number.isNaN(maxGuests) || maxGuests < 1) {
    errors.maxGuests = "Max guests must be a number (min 1).";
  }

  if (!values.country.trim()) errors.country = "Country is required.";

  return errors;
}

function toInitialValues(venue) {
  return {
    name: venue?.name || "",
    description: venue?.description || "",
    mediaUrl: venue?.media?.[0]?.url || "",
    price: venue?.price ?? "",
    maxGuests: venue?.maxGuests ?? "",
    country: venue?.location?.country || "",
  };
}

function buildPayload(values) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    media: values.mediaUrl.trim()
      ? [{ url: values.mediaUrl.trim(), alt: values.name.trim() || "Venue image" }]
      : [],
    price: Number(values.price),
    maxGuests: Number(values.maxGuests),
    location: { country: values.country.trim() },
  };
}

export default function EditVenueModal({ open, venue, onClose, onUpdated, onToast }) {
  const [values, setValues] = useState(toInitialValues(venue));
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(toInitialValues(venue));
    setTouched({});
    setSubmitError("");
  }, [open, venue]);

  const errors = useMemo(() => validate(values), [values]);
  const showError = (field) => Boolean(touched[field] && errors[field]);

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    const allTouched = {
      name: true,
      description: true,
      mediaUrl: true,
      price: true,
      maxGuests: true,
      country: true,
    };
    setTouched(allTouched);

    const currentErrors = validate(values);
    if (Object.keys(currentErrors).length > 0) {
      onToast?.({ variant: "error", message: "Please fix the highlighted fields." });
      return;
    }

    try {
      setIsSaving(true);
      const payload = buildPayload(values);

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

  // Close on ESC
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
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
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
            {showError("name") && <p className={styles.fieldError}>{errors.name}</p>}
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
            {showError("description") && <p className={styles.fieldError}>{errors.description}</p>}
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
            {showError("mediaUrl") && <p className={styles.fieldError}>{errors.mediaUrl}</p>}
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
              {showError("price") && <p className={styles.fieldError}>{errors.price}</p>}
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
              {showError("maxGuests") && <p className={styles.fieldError}>{errors.maxGuests}</p>}
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
            {showError("country") && <p className={styles.fieldError}>{errors.country}</p>}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.btnGhost} onClick={onClose} disabled={isSaving}>
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
