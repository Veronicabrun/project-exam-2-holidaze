import { useEffect, useState } from "react";
import { getProfile } from "../../services/profile";

export default function Profile() {
  const [profile, setProfile] = useState(null);
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

        console.log("Fetching profile for:", name);
        const response = await getProfile(name);

        console.log("Raw profile response:", response);
        console.log("Profile data:", response.data);

        setProfile(response.data);
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
        <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
          <div><strong>Name:</strong> {profile.name}</div>
          <div><strong>Email:</strong> {profile.email}</div>

          {profile.avatar?.url && (
            <img
              src={profile.avatar.url}
              alt={profile.avatar.alt || "Avatar"}
              style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "50%" }}
            />
          )}

          {profile.bio && <div><strong>Bio:</strong> {profile.bio}</div>}
        </div>
      )}
    </section>
  );
}

