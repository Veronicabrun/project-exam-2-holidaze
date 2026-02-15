// src/pages/Profile/Profile.jsx
import { useEffect, useState } from "react";
import { getProfile, getMyBookings } from "../../services/profile";
import AvatarEditor from "../../components/AvatarEditor/AvatarEditor";
import AddVenue from "../../components/AddVenue/AddVenue";
import MyVenues from "../../components/MyVenues/MyVenues";
import { setAuth, getAuth } from "../../utils/auth";

import Loading from "../../components/ui/Loading/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage/ErrorMessage";
import Toast from "../../components/ui/Toast/Toast";

function dateOnly(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Venue manager tabs
  const [activeTab, setActiveTab] = useState("venues");

  // ✅ Toast eies av Profile + id for å trigge på nytt hver gang
  const [toast, setToast] = useState({
    open: false,
    message: "",
    variant: "success",
    id: 0,
  });

  function showToast({ message, variant = "success" }) {
    setToast((t) => ({
      id: t.id + 1,
      open: true,
      message,
      variant,
    }));
  }

  function closeToast() {
    setToast((t) => ({ ...t, open: false }));
  }

  const auth = getAuth();
  const username = auth?.name || "";

  useEffect(() => {
    if (!username) {
      setError("You must be logged in to view profile.");
      return;
    }

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        const profileData = await getProfile(username);
        setProfile(profileData);

        setAuth({
          venueManager: Boolean(profileData?.venueManager),
          avatarUrl: profileData?.avatar?.url || "",
          avatarAlt: profileData?.avatar?.alt || "User avatar",
        });

        const bookingsData = await getMyBookings(username);
        setBookings(bookingsData || []);
      } catch (err) {
        setError(err?.message || "Could not load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [username]);

  function handleAvatarUpdated(newAvatar) {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, avatar: newAvatar };
    });

    setAuth({
      avatarUrl: newAvatar?.url || "",
      avatarAlt: newAvatar?.alt || "User avatar",
    });

    showToast({ variant: "success", message: "Avatar updated!" });
  }

  // ✅ Etter venue opprettes: bytt tab til "My venues"
  function handleVenueCreated() {
    setActiveTab("venues");
  }

  if (isLoading) {
    return <Loading text="Loading profile..." fullScreen />;
  }

  if (error) {
    return (
      <div style={{ padding: "1rem" }}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  const isVenueManager = Boolean(getAuth()?.venueManager);

  return (
    <section style={{ padding: "1rem" }}>
      <Toast
        key={toast.id}
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        duration={1500}
        onClose={closeToast}
      />

      <h1>{isVenueManager ? "Venue Manager" : "Profile"}</h1>

      {!profile ? (
        <p>No profile loaded yet</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {/* Profile header box */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              maxWidth: 900,
            }}
          >
            <div>
              <strong>Name:</strong> {profile.name}
            </div>

            <div>
              <strong>Email:</strong> {profile.email}
            </div>

            <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
              <strong>Avatar:</strong>
              <AvatarEditor
                username={username}
                avatarUrl={profile.avatar?.url}
                avatarAlt={profile.avatar?.alt}
                onAvatarUpdated={handleAvatarUpdated}
              />
            </div>
          </div>

          {/* Venue manager section */}
          {isVenueManager ? (
            <>
              <hr style={{ margin: "12px 0" }} />

              {/* Tabs */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("venues")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid #ddd",
                    background: activeTab === "venues" ? "#000" : "#fff",
                    color: activeTab === "venues" ? "#fff" : "#000",
                    cursor: "pointer",
                  }}
                >
                  My venues
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("add")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid #ddd",
                    background: activeTab === "add" ? "#000" : "#fff",
                    color: activeTab === "add" ? "#fff" : "#000",
                    cursor: "pointer",
                  }}
                >
                  Add venue
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: "1px solid #ddd",
                    background: activeTab === "bookings" ? "#000" : "#fff",
                    color: activeTab === "bookings" ? "#fff" : "#000",
                    cursor: "pointer",
                  }}
                >
                  My bookings (as guest)
                </button>
              </div>

              {/* Tab content */}
              <div style={{ marginTop: 12, maxWidth: 900 }}>
                {activeTab === "venues" && (
                  <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
                    <MyVenues username={username} onToast={showToast} />
                  </div>
                )}

                {activeTab === "add" && (
                  <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
                    <AddVenue onCreated={handleVenueCreated} onToast={showToast} />
                  </div>
                )}

                {activeTab === "bookings" && (
                  <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
                    <h2 style={{ marginTop: 0 }}>My bookings</h2>

                    {bookings.length === 0 ? (
                      <p style={{ opacity: 0.8 }}>You have no bookings yet.</p>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
                        {bookings
                          .slice()
                          .sort((a, b) => new Date(b.created) - new Date(a.created))
                          .map((b) => (
                            <li
                              key={b.id}
                              style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}
                            >
                              <div style={{ fontWeight: 600 }}>{b.venue?.name || "Venue"}</div>
                              <div style={{ opacity: 0.9 }}>
                                {dateOnly(b.dateFrom)} → {dateOnly(b.dateTo)}
                              </div>
                              <div style={{ opacity: 0.9 }}>Guests: {b.guests}</div>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <hr style={{ margin: "12px 0" }} />

              <div style={{ maxWidth: 900 }}>
                <h2 style={{ marginTop: 0 }}>My bookings</h2>

                {bookings.length === 0 ? (
                  <p style={{ opacity: 0.8 }}>You have no bookings yet.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
                    {bookings
                      .slice()
                      .sort((a, b) => new Date(b.created) - new Date(a.created))
                      .map((b) => (
                        <li
                          key={b.id}
                          style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}
                        >
                          <div style={{ fontWeight: 600 }}>{b.venue?.name || "Venue"}</div>
                          <div style={{ opacity: 0.9 }}>
                            {dateOnly(b.dateFrom)} → {dateOnly(b.dateTo)}
                          </div>
                          <div style={{ opacity: 0.9 }}>Guests: {b.guests}</div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
