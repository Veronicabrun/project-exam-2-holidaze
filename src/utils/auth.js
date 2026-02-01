// src/utils/auth.js

const TOKEN_KEY = "token";
const NAME_KEY = "name";
const VENUE_MANAGER_KEY = "venueManager";

export function setAuth({ token, name, venueManager }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (name) localStorage.setItem(NAME_KEY, name);

  if (typeof venueManager === "boolean") {
    localStorage.setItem(VENUE_MANAGER_KEY, String(venueManager));
  }
}

export function getAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const name = localStorage.getItem(NAME_KEY);
  const venueManager = localStorage.getItem(VENUE_MANAGER_KEY) === "true";

  return {
    isLoggedIn: Boolean(token),
    token,
    name,
    venueManager,
  };
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(VENUE_MANAGER_KEY);
}