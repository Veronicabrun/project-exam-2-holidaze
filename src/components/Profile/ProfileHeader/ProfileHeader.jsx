// src/components/Profile/ProfileHeader/ProfileHeader.jsx
import AvatarEditor from "../../AvatarEditor/AvatarEditor";
import styles from "./ProfileHeader.module.scss";

export default function ProfileHeader({ profile, username, onAvatarUpdated }) {
  if (!profile) return null;

  return (
    <section className={styles.card} aria-label="Profile information">
      <div className={styles.layout}>
        {/* Left: Avatar */}
        <div className={styles.avatarColumn}>
          <AvatarEditor
            username={username}
            avatarUrl={profile.avatar?.url}
            avatarAlt={profile.avatar?.alt}
            onAvatarUpdated={onAvatarUpdated}
          />
        </div>

        {/* Right: Name + Email */}
        <div className={styles.infoColumn}>
          <div className={styles.item}>
            <span className={styles.label}>Name</span>
            <span className={styles.value}>{profile.name}</span>
          </div>

          <div className={styles.item}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{profile.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}