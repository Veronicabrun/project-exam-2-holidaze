// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { getAuth } from "../utils/auth";

/**
* useAuth()
* - Always gives you "fresh" auth (token, name, avatar, venueManager)
* - Re-render UI automatically on login/logout (authchange) + storage events.
*/
export default function useAuth() {
  const [auth, setAuthState] = useState(() => getAuth());

  useEffect(() => {
    function syncAuth() {
      setAuthState(getAuth());
    }

    window.addEventListener("authchange", syncAuth);
    window.addEventListener("storage", syncAuth);

   // make sure state is correct at mount
    syncAuth();

    return () => {
      window.removeEventListener("authchange", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return auth;
}