// src/components/ui/Toast/Toast.jsx
import { useEffect } from "react";
import styles from "./Toast.module.scss";

export default function Toast({
  message,
  variant = "success",
  open,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  const title =
    variant === "success"
      ? "Success"
      : variant === "error"
      ? "Error"
      : "Info";

  const icon =
    variant === "success" ? (
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path
          d="M20 6L9 17l-5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : variant === "error" ? (
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path
          d="M6 6l12 12M18 6l-12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    );

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${styles.toast} ${styles[variant]}`}
    >
      {icon}

      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.message}>{message}</div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className={styles.close}
      >
        Close
      </button>
    </div>
  );
}