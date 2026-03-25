import { useMemo, useState } from "react";
import { createVenue } from "../../services/venues";
import {
  buildVenuePayload,
  validateVenue,
  venueAllTouched,
  venueInitialValues,
} from "../../utils/venueForm";
import ErrorMessage from "../ui/ErrorMessage/ErrorMessage";
import styles from "./AddVenue.module.scss";

export default function AddVenue({ onCreated, onToast }) {
  const [values, setValues] = useState(venueInitialValues);
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(
    () => validateVenue(values, { mediaRequired: true }),
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

    const currentErrors = validateVenue(values, { mediaRequired: true });
    const isValidNow = Object.keys(currentErrors).length === 0;

    if (!isValidNow) {
      onToast?.({
        variant: "error",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = buildVenuePayload(values);
      const created = await createVenue(payload);

      onToast?.({
        variant: "success",
        message: "Venue created successfully!",
      });

      setValues(venueInitialValues);
      setTouched({});

      onCreated?.(created);
    } catch (err) {
      const msg = err?.message || "Failed to create venue.";
      setSubmitError(msg);
      onToast?.({ variant: "error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.container} aria-labelledby="add-venue-title">
      <header className={styles.header}>
        <h2 id="add-venue-title" className={styles.title}>
          Add venue
        </h2>

        <p className={styles.subtitle}>
          Fill in the details below to publish a new venue.
        </p>
      </header>

      <ErrorMessage message={submitError} />

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="venue-name">
            Venue name
          </label>
          <input
            id="venue-name"
            className={`${styles.input} ${showError("name") ? styles.inputError : ""}`}
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => markTouched("name")}
            aria-invalid={showError("name")}
            aria-describedby={showError("name") ? "venue-name-error" : undefined}
            autoComplete="off"
          />
          {showError("name") && (
            <p id="venue-name-error" className={styles.fieldError} role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="venue-description">
            Description
          </label>
          <textarea
            id="venue-description"
            rows={4}
            className={`${styles.textarea} ${showError("description") ? styles.inputError : ""}`}
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            onBlur={() => markTouched("description")}
            aria-invalid={showError("description")}
            aria-describedby={
              showError("description") ? "venue-description-error" : undefined
            }
          />
          {showError("description") && (
            <p
              id="venue-description-error"
              className={styles.fieldError}
              role="alert"
            >
              {errors.description}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="venue-media">
            Media URL
          </label>
          <input
            id="venue-media"
            className={`${styles.input} ${showError("mediaUrl") ? styles.inputError : ""}`}
            value={values.mediaUrl}
            onChange={(e) => setField("mediaUrl", e.target.value)}
            onBlur={() => markTouched("mediaUrl")}
            placeholder="https://..."
            aria-invalid={showError("mediaUrl")}
            aria-describedby={showError("mediaUrl") ? "venue-media-error" : undefined}
            inputMode="url"
          />
          {showError("mediaUrl") && (
            <p id="venue-media-error" className={styles.fieldError} role="alert">
              {errors.mediaUrl}
            </p>
          )}
        </div>

        <div className={styles.twoCol}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="venue-price">
              Price
            </label>
            <input
              id="venue-price"
              type="number"
              className={`${styles.input} ${showError("price") ? styles.inputError : ""}`}
              value={values.price}
              onChange={(e) => setField("price", e.target.value)}
              onBlur={() => markTouched("price")}
              aria-invalid={showError("price")}
              aria-describedby={showError("price") ? "venue-price-error" : undefined}
              min={1}
            />
            {showError("price") && (
              <p id="venue-price-error" className={styles.fieldError} role="alert">
                {errors.price}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="venue-maxGuests">
              Max guests
            </label>
            <input
              id="venue-maxGuests"
              type="number"
              className={`${styles.input} ${showError("maxGuests") ? styles.inputError : ""}`}
              value={values.maxGuests}
              onChange={(e) => setField("maxGuests", e.target.value)}
              onBlur={() => markTouched("maxGuests")}
              aria-invalid={showError("maxGuests")}
              aria-describedby={
                showError("maxGuests") ? "venue-maxGuests-error" : undefined
              }
              min={1}
            />
            {showError("maxGuests") && (
              <p
                id="venue-maxGuests-error"
                className={styles.fieldError}
                role="alert"
              >
                {errors.maxGuests}
              </p>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="venue-country">
            Country
          </label>
          <input
            id="venue-country"
            className={`${styles.input} ${showError("country") ? styles.inputError : ""}`}
            value={values.country}
            onChange={(e) => setField("country", e.target.value)}
            onBlur={() => markTouched("country")}
            aria-invalid={showError("country")}
            aria-describedby={showError("country") ? "venue-country-error" : undefined}
            autoComplete="country-name"
          />
          {showError("country") && (
            <p id="venue-country-error" className={styles.fieldError} role="alert">
              {errors.country}
            </p>
          )}
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Publish"}
        </button>
      </form>
    </section>
  );
}
