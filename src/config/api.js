// src/config/api.js
export const API_BASE = "https://v2.api.noroff.dev";

// Auth
export const AUTH_REGISTER = `${API_BASE}/auth/register`;
export const AUTH_LOGIN = `${API_BASE}/auth/login`;

// Holidaze base
export const HOLIDAZE_BASE = `${API_BASE}/holidaze`;

// Profiles
export const PROFILES = `${HOLIDAZE_BASE}/profiles`;
export const profileByName = (name) => `${PROFILES}/${name}`;
export const profileBookingsByName = (name) => `${PROFILES}/${name}/bookings`;

// ✅ NY: venues owned by profile (venue manager)
export const profileVenuesByName = (name) => `${PROFILES}/${name}/venues`;

// Venues
export const VENUES = `${HOLIDAZE_BASE}/venues`;
export const venueById = (id) => `${VENUES}/${id}`;

// Bookings
export const BOOKINGS = `${HOLIDAZE_BASE}/bookings`;

