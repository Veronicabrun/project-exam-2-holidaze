// src/utils/auth.js

const TOKEN_KEY = "token";
const NAME_KEY = "name";
const VENUE_MANAGER_KEY = "venueManager";
const AVATAR_URL_KEY = "avatarUrl";
const AVATAR_ALT_KEY = "avatarAlt";

/**
 * Slå av/på logging her.
 * Sett til false når du vil rydde før innlevering.
 */
const DEBUG_AUTH = true;

function log(...args) {
  if (DEBUG_AUTH) console.log(...args);
}

function emitAuthChange() {
  window.dispatchEvent(new Event("authchange"));
}

/**
 * Oppdater auth i localStorage uten å overskrive alt.
 * Du kan sende inn bare { avatarUrl } eller bare { venueManager } osv.
 */
export function setAuth({ token, name, venueManager, avatarUrl, avatarAlt }) {
  const before = getAuth();

  if (typeof token === "string") localStorage.setItem(TOKEN_KEY, token);
  if (typeof name === "string") localStorage.setItem(NAME_KEY, name);

  if (typeof venueManager === "boolean") {
    localStorage.setItem(VENUE_MANAGER_KEY, String(venueManager));
  }

  if (typeof avatarUrl === "string") {
    localStorage.setItem(AVATAR_URL_KEY, avatarUrl);
  }

  if (typeof avatarAlt === "string") {
    localStorage.setItem(AVATAR_ALT_KEY, avatarAlt);
  }

  const after = getAuth();
  log("auth.js: setAuth ->", { before, after });

  emitAuthChange();
}

export function getAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const name = localStorage.getItem(NAME_KEY);

  const venueManager = localStorage.getItem(VENUE_MANAGER_KEY) === "true";

  const avatarUrl = localStorage.getItem(AVATAR_URL_KEY);
  const avatarAlt = localStorage.getItem(AVATAR_ALT_KEY);

  return {
    isLoggedIn: Boolean(token),
    token,
    name,
    venueManager,
    avatarUrl,
    avatarAlt,
  };
}

export function logout() {
  log("auth.js: logout -> clearing localStorage keys");

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(VENUE_MANAGER_KEY);
  localStorage.removeItem(AVATAR_URL_KEY);
  localStorage.removeItem(AVATAR_ALT_KEY);

  emitAuthChange();
}