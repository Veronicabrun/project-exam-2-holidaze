// src/components/ui/ErrorMessage/ErrorMessage.jsx
import styles from "./ErrorMessage.module.scss";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <p role="alert" className={styles.error}>
      {message}
    </p>
  );
}