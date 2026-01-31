import { useEffect, useState } from "react";
import { getProfile, getMyBookings } from "../../services/profile";

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
    console.log("Profile page - name from localStorage:", name);

    if (!name) {
      setError("No user found in localStorage.");
      return;
    }

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        // 1) profile
        console.log("Fetching profile for:", name);
        const profileRes = await getProfile(name);
        console.log("Raw profile response:", profileRes);
        setProfile(profileRes.data);

        // 2) bookings
        console.log("Fetching bookings for:", name);
        const bookingsRes = await getMyBookings(name);
        console.log("Raw bookings response:", bookingsRes);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Could not load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (isLoading) return <p style={{ padding: "1rem" }}>Loading profile...</p>;
  if (error) return <p style={{ padding: "1rem", color: "crimson" }}>{error}</p>;

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

          {profile.avatar?.url && (
            <img
              src={profile.avatar.url}
              alt={profile.avatar.alt || "Avatar"}
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          )}

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
                    <div style={{ fontWeight: 600 }}>
                      {b.venue?.name || "Venue"}
                    </div>
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

