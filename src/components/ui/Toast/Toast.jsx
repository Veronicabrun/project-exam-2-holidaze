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

  const icon =
    variant === "success" ? "✅" :
    variant === "error" ? "❌" :
    "ℹ️";

  const title =
    variant === "success" ? "Success" :
    variant === "error" ? "Error" :
    "Info";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${styles.toast} ${styles[variant]}`}
    >
      <div className={styles.icon}>{icon}</div>

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
        ✕
      </button>
    </div>
  );
}