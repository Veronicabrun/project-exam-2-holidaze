// src/components/Profile/ProfileTabs/ProfileTabs.jsx
import styles from "./ProfileTabs.module.scss";

export default function ProfileTabs({ activeTab, onChange }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Profile sections">
      <button
        type="button"
        className={`${styles.tab} ${activeTab === "venues" ? styles.active : ""}`}
        onClick={() => onChange("venues")}
        role="tab"
        aria-selected={activeTab === "venues"}
      >
        My venues
      </button>

      <button
        type="button"
        className={`${styles.tab} ${activeTab === "add" ? styles.active : ""}`}
        onClick={() => onChange("add")}
        role="tab"
        aria-selected={activeTab === "add"}
      >
        Add venue
      </button>

      <button
        type="button"
        className={`${styles.tab} ${activeTab === "bookings" ? styles.active : ""}`}
        onClick={() => onChange("bookings")}
        role="tab"
        aria-selected={activeTab === "bookings"}
      >
        My bookings (as guest)
      </button>
    </div>
  );
}