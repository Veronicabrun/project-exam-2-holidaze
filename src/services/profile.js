import { request } from "./api";
import { profileByName, profileBookingsByName } from "../config/api";

/**
 * Get profile data by username.
 *
 * @param {string} name - Profile username.
 * @returns {Promise<Object>} Profile data from the API.
 */
export function getProfile(name) {
  return request(profileByName(name));
}

/**
 * Get bookings for a profile (including venue info).
 *
 * @param {string} name - Profile username.
 * @returns {Promise<Array>} List of bookings.
 */
export function getMyBookings(name) {
  return request(`${profileBookingsByName(name)}?_venue=true`);
}

/**
 * Update profile avatar.
 *
 * @param {string} username - Profile username.
 * @param {Object} avatar - Avatar object.
 * @param {string} avatar.url - Image URL.
 * @param {string} avatar.alt - Image alt text.
 * @returns {Promise<Object>} Updated profile data.
 */
export function updateAvatar(username, avatar) {
  return request(profileByName(username), {
    method: "PUT",
    body: JSON.stringify({
      avatar,
    }),
  });
}