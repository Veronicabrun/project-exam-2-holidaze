import { useEffect } from "react";
import styles from "./DeleteVenueModal.module.scss";

export default function DeleteVenueModal({
  open,
  venue,
  isDeleting = false,
  onClose,
  onConfirm,
}) {
  // ESC for å lukke
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
        aria-labelledby="delete-venue-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h3 id="delete-venue-title" className={styles.title}>
            Delete venue
          </h3>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
            disabled={isDeleting}
          >
            ✕
          </button>
        </header>

        <p className={styles.text}>
          Are you sure you want to delete <strong>{venue?.name}</strong>?
        </p>
        <p className={styles.warning}>This cannot be undone.</p>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.btnDanger}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
