// src/components/AddVenue/AddVenue.jsx
import { useMemo, useState } from "react";
import { createVenue } from "../../services/venues";
import ErrorMessage from "../ui/ErrorMessage/ErrorMessage";
import styles from "./AddVenue.module.scss";

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = "Venue name is required.";
  if (!values.description.trim()) errors.description = "Description is required.";

  if (!values.mediaUrl.trim()) {
    errors.mediaUrl = "Media URL is required.";
  } else {
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

const initialValues = {
  name: "",
  description: "",
  mediaUrl: "",
  price: "",
  maxGuests: "",
  country: "",
};

const allTouched = {
  name: true,
  description: true,
  mediaUrl: true,
  price: true,
  maxGuests: true,
  country: true,
};

function buildPayload(values) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    media: [
      {
        url: values.mediaUrl.trim(),
        alt: values.name.trim() || "Venue image",
      },
    ],
    price: Number(values.price),
    maxGuests: Number(values.maxGuests),
    location: {
      country: values.country.trim(),
    },
  };
}

export default function AddVenue({ onCreated, onToast }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => validate(values), [values]);

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

    // ✅ UX: på submit → vis alle feltfeil
    setTouched(allTouched);

    const currentErrors = validate(values);
    const isValidNow = Object.keys(currentErrors).length === 0;

    if (!isValidNow) {
      onToast?.({ variant: "error", message: "Please fix the highlighted fields." });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = buildPayload(values);
      console.log("🟦 AddVenue payload:", payload);

      const created = await createVenue(payload);
      console.log("🟩 Venue created:", created);

      onToast?.({ variant: "success", message: "Venue created successfully!" });

      setValues(initialValues);
      setTouched({});

      onCreated?.(created);
    } catch (err) {
      const msg = err?.message || "Failed to create venue.";
      console.error("❌ Create venue error:", err);

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
        <p className={styles.subtitle}>Create a new venue (venue manager only).</p>
      </header>

      {/* API/submit error (ikke feltfeil) */}
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
            aria-describedby={showError("description") ? "venue-description-error" : undefined}
          />
          {showError("description") && (
            <p id="venue-description-error" className={styles.fieldError} role="alert">
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
              aria-describedby={showError("maxGuests") ? "venue-maxGuests-error" : undefined}
              min={1}
            />
            {showError("maxGuests") && (
              <p id="venue-maxGuests-error" className={styles.fieldError} role="alert">
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
