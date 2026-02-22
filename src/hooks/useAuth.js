// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { getAuth } from "../utils/auth";

/**
 * useAuth()
 * - Gir deg alltid "fersk" auth (token, name, avatar, venueManager)
 * - Re-render UI automatisk ved login/logout (authchange) + storage events.
 */
export default function useAuth() {
  const [auth, setAuthState] = useState(() => getAuth());

  useEffect(() => {
    function syncAuth() {
      setAuthState(getAuth());
    }

    window.addEventListener("authchange", syncAuth);
    window.addEventListener("storage", syncAuth);

    // sørg for at state er riktig ved mount
    syncAuth();

    return () => {
      window.removeEventListener("authchange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return auth;
}