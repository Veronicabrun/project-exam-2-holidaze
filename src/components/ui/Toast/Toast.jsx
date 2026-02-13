import { useEffect } from "react";

export default function Toast({ message, variant = "success", open, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  const styles = {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 9999,
    minWidth: 260,
    maxWidth: 360,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    background: "white",
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  };

  const variants = {
    success: { borderColor: "#b7e1c1" },
    error: { borderColor: "#f5c2c2" },
    info: { borderColor: "#cfe2ff" },
  };

  return (
    <div role="status" aria-live="polite" style={{ ...styles, ...variants[variant] }}>
      <div style={{ fontSize: 18, lineHeight: 1 }}>
        {variant === "success" ? "✅" : variant === "error" ? "❌" : "ℹ️"}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>
          {variant === "success" ? "Success" : variant === "error" ? "Error" : "Info"}
        </div>
        <div style={{ opacity: 0.9 }}>{message}</div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
          opacity: 0.7,
        }}
      >
        ✕
      </button>
    </div>
  );
}
