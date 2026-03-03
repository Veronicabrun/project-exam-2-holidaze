// src/pages/Profile/Profile.jsx
import { useEffect, useState } from "react";
import { getProfile, getMyBookings } from "../../services/profile";
import { setAuth } from "../../utils/auth";

import useAuth from "../../hooks/useAuth";

import AddVenue from "../../components/AddVenue/AddVenue";
import MyVenues from "../../components/MyVenues/MyVenues";

import Loading from "../../components/ui/Loading/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage/ErrorMessage";
import Toast from "../../components/ui/Toast/Toast";

import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs/ProfileTabs";
import BookingsList from "../../components/Profile/BookingsList/BookingsList";

import styles from "./Profile.module.scss";

export default function Profile() {
  const auth = useAuth();
  const username = auth?.name || "";
  const isVenueManager = Boolean(auth?.venueManager);

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("venues");

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

  useEffect(() => {
    if (!username) {
      setError("You must be logged in to view profile.");
      return;
    }

    async function load() {
      try {
        setIsLoading(true);
        setError("");

        const profileData = await getProfile(username);
        setProfile(profileData);

        // hold localStorage i sync (Nav + andre steder bruker dette)
        setAuth({
          venueManager: Boolean(profileData?.venueManager),
          avatarUrl: profileData?.avatar?.url || "",
          avatarAlt: profileData?.avatar?.alt || "User avatar",
        });

        const bookingsData = await getMyBookings(username);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (err) {
        setError(err?.message || "Could not load profile.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [username]);

  function handleAvatarUpdated(newAvatar) {
    setProfile((prev) => (prev ? { ...prev, avatar: newAvatar } : prev));

    setAuth({
      avatarUrl: newAvatar?.url || "",
      avatarAlt: newAvatar?.alt || "User avatar",
    });

    showToast({ variant: "success", message: "Avatar updated!" });
  }

  function handleVenueCreated() {
    setActiveTab("venues");
    showToast({ variant: "success", message: "Venue created!" });
  }

  if (isLoading) return <Loading text="Loading profile..." fullScreen />;

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Toast
        key={toast.id}
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        duration={2200}
        onClose={closeToast}
      />

      <div className={styles.container}>
        <h1 className={styles.title}>{isVenueManager ? "Venue Manager" : "Profile"}</h1>

        {!profile ? (
          <p className={styles.status}>No profile loaded.</p>
        ) : (
          <div className={styles.stack}>
            <ProfileHeader
              profile={profile}
              username={username}
              onAvatarUpdated={handleAvatarUpdated}
            />

            {isVenueManager ? (
              <>
                <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === "venues" && (
                  <section className={styles.panel}>
                    <MyVenues username={username} onToast={showToast} />
                  </section>
                )}

                {activeTab === "add" && (
                  <section className={styles.panel}>
                    <AddVenue onCreated={handleVenueCreated} onToast={showToast} />
                  </section>
                )}

                {activeTab === "bookings" && (
                  <section className={styles.panel}>
                    <h2 className={styles.h2}>My bookings</h2>
                    <BookingsList bookings={bookings} emptyText="You have no bookings yet." />
                  </section>
                )}
              </>
            ) : (
              <section className={styles.panel}>
                <h2 className={styles.h2}>My bookings</h2>
                <BookingsList bookings={bookings} emptyText="You have no bookings yet." />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}