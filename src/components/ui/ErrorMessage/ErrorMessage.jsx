// src/components/ui/ErrorMessage.jsx
export default function ErrorMessage({ message, style }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      style={{
        color: "crimson",
        background: "#fdecec",
        border: "1px solid #f5c2c2",
        padding: 12,
        borderRadius: 8,
        margin: "12px 0",
        ...style,
      }}
    >
      {message}
    </p>
  );
}
