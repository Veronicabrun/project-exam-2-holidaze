import { useEffect, useState } from "react";
import { getProfile, getMyBookings } from "../../services/profile";
import AvatarEditor from "../../components/AvatarEditor/AvatarEditor";
import { setAuth, getAuth } from "../../utils/auth";

function dateOnly(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");

    if (!name) {
      setError("No user found in localStorage.");
      return;
    }

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        // ✅ Nå returnerer getProfile selve profilen
        const profileData = await getProfile(name);
        setProfile(profileData);

        setAuth({
          venueManager: Boolean(profileData?.venueManager),
          avatarUrl: profileData?.avatar?.url || "",
          avatarAlt: profileData?.avatar?.alt || "User avatar",
        });

        // ✅ Nå returnerer getMyBookings selve arrayet
        const bookingsData = await getMyBookings(name);
        setBookings(bookingsData || []);
      } catch (err) {
        setError(err?.message || "Could not load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleAvatarUpdated(newAvatar) {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, avatar: newAvatar };
    });

    setAuth({
      avatarUrl: newAvatar?.url || "",
      avatarAlt: newAvatar?.alt || "User avatar",
    });
  }

  if (isLoading) return <p style={{ padding: "1rem" }}>Loading profile...</p>;
  if (error) return <p style={{ padding: "1rem", color: "crimson" }}>{error}</p>;

  const username = profile?.name || localStorage.getItem("name");
  const auth = getAuth();
  const isVenueManager = Boolean(auth?.venueManager);

  return (
    <section style={{ padding: "1rem" }}>
      <h1>{isVenueManager ? "Venue Manager" : "Profile"}</h1>

      {!profile ? (
        <p>No profile loaded yet</p>
      ) : (
        <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
          <div>
            <strong>Name:</strong> {profile.name}
          </div>

          <div>
            <strong>Email:</strong> {profile.email}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <strong>Avatar:</strong>
            <AvatarEditor
              username={username}
              avatarUrl={profile.avatar?.url}
              avatarAlt={profile.avatar?.alt}
              onAvatarUpdated={handleAvatarUpdated}
            />
          </div>

          <hr style={{ margin: "24px 0" }} />

          {isVenueManager ? (
            <>
              <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
                <strong>ADD VENUE</strong>
                <strong>MY VENUES</strong>
                <strong>MY BOOKINGS</strong>
              </div>

              <h2 style={{ margin: "24px 0 0" }}>My bookings</h2>

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
                        style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
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
            </>
          ) : (
            <>
              <h2 style={{ margin: 0 }}>My bookings</h2>

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
                        style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
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
            </>
          )}
        </div>
      )}
    </section>
  );
}
