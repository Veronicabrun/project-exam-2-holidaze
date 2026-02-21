// src/components/ui/Loading/Loading.jsx
import styles from "./Loading.module.scss";

export default function Loading({ text = "Loading...", fullScreen = false }) {
  return (
    <div
      className={`${styles.wrapper} ${fullScreen ? styles.fullScreen : ""}`}
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.inner}>
        <div aria-hidden="true" className={styles.spinner} />
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
