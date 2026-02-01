// src/pages/Profile/Profile.jsx
import { useEffect, useState } from "react";
import { getProfile, getMyBookings } from "../../services/profile";
import AvatarEditor from "../../components/AvatarEditor/AvatarEditor";
import { setAuth } from "../../utils/auth";

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
    console.log("Profile.jsx: load -> name from localStorage:", name);

    if (!name) {
      setError("No user found in localStorage.");
      return;
    }

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        // 1) Hent profil
        console.log("Profile.jsx: fetching profile for:", name);
        const profileRes = await getProfile(name);
        console.log("Profile.jsx: raw profile response:", profileRes);

        // Noroff v2: services/request returnerer ofte { data, meta }
        const profileData = profileRes?.data?.data || profileRes?.data || profileRes;

        console.log("Profile.jsx: parsed profileData:", profileData);
        setProfile(profileData);

        // ✅ Synk avatar i auth/localStorage så Nav kan vise riktig bilde ved refresh/route change
        setAuth({
          avatarUrl: profileData?.avatar?.url || "",
          avatarAlt: profileData?.avatar?.alt || "User avatar",
        });

        // 2) Hent bookings
        console.log("Profile.jsx: fetching bookings for:", name);
        const bookingsRes = await getMyBookings(name);
        console.log("Profile.jsx: raw bookings response:", bookingsRes);

        const bookingsData = bookingsRes?.data?.data || bookingsRes?.data || [];
        console.log("Profile.jsx: parsed bookingsData length:", bookingsData.length);

        setBookings(bookingsData);
      } catch (err) {
        console.error("Profile.jsx: fetch error:", err);
        setError(err?.message || "Could not load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleAvatarUpdated(newAvatar) {
    console.log("Profile.jsx: handleAvatarUpdated ->", newAvatar);

    // 1) Oppdater state på profilsiden (UI)
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        avatar: newAvatar,
      };
    });

    // 2) Oppdater auth/localStorage + trigge authchange så Nav oppdaterer med en gang
    setAuth({
      avatarUrl: newAvatar?.url || "",
      avatarAlt: newAvatar?.alt || "User avatar",
    });
  }

  if (isLoading) return <p style={{ padding: "1rem" }}>Loading profile...</p>;
  if (error) return <p style={{ padding: "1rem", color: "crimson" }}>{error}</p>;

  // username er samme som profile.name (fallback til localStorage)
  const username = profile?.name || localStorage.getItem("name");

  return (
    <section style={{ padding: "1rem" }}>
      <h1>Profile</h1>

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

          {/* ✅ Avatar editor (click avatar -> modal) */}
          <div style={{ display: "grid", gap: 8 }}>
            <strong>Avatar:</strong>

            <AvatarEditor
              username={username}
              avatarUrl={profile.avatar?.url}
              avatarAlt={profile.avatar?.alt}
              onAvatarUpdated={handleAvatarUpdated}
            />
          </div>

          {profile.bio && (
            <div>
              <strong>Bio:</strong> {profile.bio}
            </div>
          )}

          <hr style={{ margin: "24px 0" }} />

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
        </div>
      )}
    </section>
  );
}