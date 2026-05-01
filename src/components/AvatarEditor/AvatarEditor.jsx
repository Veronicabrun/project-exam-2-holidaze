import { useEffect, useState } from "react";
import { updateAvatar } from "../../services/profile";
import { EditIcon } from "../ui/Icons/Icons";
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
    setUrl(avatarUrl || "");
    setAlt(avatarAlt || "User avatar");
  }, [avatarUrl, avatarAlt]);

  function openModal() {
    setError("");
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!username) {
      setError("Missing username. Cannot update avatar.");
      return;
    }

    if (!url.trim()) {
      setError("Please provide an image URL.");
      return;
    }

    try {
      setLoading(true);

      const res = await updateAvatar(username, {
        url: url.trim(),
        alt: alt.trim(),
      });

      const updatedProfile = res?.data || res;
      const updatedAvatar = updatedProfile?.avatar;

      if (onAvatarUpdated && updatedAvatar?.url) {
        onAvatarUpdated(updatedAvatar);
      }

      closeModal();
    } catch (err) {
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
          loading="lazy"
        />

        <span className={styles.pencil} aria-hidden="true">
          <EditIcon className={styles.pencilIcon} />
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
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className={styles.btnGhost}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.btn}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}