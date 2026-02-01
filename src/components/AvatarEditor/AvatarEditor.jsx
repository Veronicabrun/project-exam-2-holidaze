// src/components/AvatarEditor/AvatarEditor.jsx
import { useEffect, useState } from "react";
import { updateAvatar } from "../../services/profile";
import styles from "./AvatarEditor.module.scss";

export default function AvatarEditor({
  username,
  avatarUrl,
  avatarAlt,
  onAvatarUpdated,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [url, setUrl] = useState(avatarUrl || "");
  const [alt, setAlt] = useState(avatarAlt || "User avatar");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("AvatarEditor: props changed ->", { avatarUrl, avatarAlt });
    setUrl(avatarUrl || "");
    setAlt(avatarAlt || "User avatar");
  }, [avatarUrl, avatarAlt]);

  function openModal() {
    console.log("AvatarEditor: openModal");
    setError("");
    setIsOpen(true);
  }

  function closeModal() {
    console.log("AvatarEditor: closeModal");
    setIsOpen(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!username) {
      setError("Missing username. Cannot update avatar.");
      console.log("AvatarEditor: missing username");
      return;
    }

    if (!url.trim()) {
      setError("Please provide an image URL.");
      console.log("AvatarEditor: empty url");
      return;
    }

    try {
      setLoading(true);
      console.log("AvatarEditor: saving avatar ->", { username, url, alt });

      const res = await updateAvatar(username, { url: url.trim(), alt: alt.trim() });
      console.log("AvatarEditor: updateAvatar response ->", res);

      const updatedProfile = res?.data || res;
      const updatedAvatar = updatedProfile?.avatar;

      console.log("AvatarEditor: updated avatar from API ->", updatedAvatar);

      if (onAvatarUpdated && updatedAvatar?.url) {
        onAvatarUpdated(updatedAvatar);
      }

      closeModal();
    } catch (err) {
      console.error("AvatarEditor: update error ->", err);
      setError(err.message || "Could not update avatar.");
    } finally {
      setLoading(false);
    }
  }

  const displayUrl = avatarUrl || "https://placehold.co/200x200?text=Avatar";

  return (
    <div>
      <button
        type="button"
        className={styles.avatarButton}
        onClick={openModal}
        aria-label="Edit avatar"
      >
        <img
          src={displayUrl}
          alt={avatarAlt || "Avatar"}
          className={styles.img}
        />

        <span className={styles.pencil} aria-hidden="true">
          ✏️
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label="Edit avatar modal"
          onMouseDown={(e) => {
            if (e.target.classList.contains(styles.backdrop)) {
              console.log("AvatarEditor: backdrop click -> close");
              closeModal();
            }
          }}
        >
          <div className={styles.modal}>
            <h2 className={styles.title}>Edit avatar</h2>

            <form onSubmit={handleSave} className={styles.form}>
              <label className={styles.label}>
                Image URL
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  type="url"
                  placeholder="https://..."
                  className={styles.input}
                  required
                />
              </label>

              <label className={styles.label}>
                Alt text (optional)
                <input
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  type="text"
                  className={styles.input}
                />
              </label>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.actions}>
                <button type="button" onClick={closeModal} disabled={loading}>
                  Cancel
                </button>

                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>

            <p className={styles.hint}>
              (Console logs are enabled so you can see exactly what happens.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}