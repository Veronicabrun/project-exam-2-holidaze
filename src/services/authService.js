import { request } from "./api";
import { AUTH_LOGIN, AUTH_REGISTER } from "../config/api";

/**
 * Log in a user.
 *
 * @param {Object} body - Login payload.
 * @param {string} body.email - User email.
 * @param {string} body.password - User password.
 * @returns {Promise<Object>} Auth response containing token and user info.
 */
export function loginUser(body) {
  return request(AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Register a new user.
 *
 * @param {Object} body - Registration payload.
 * @param {string} body.name - Username.
 * @param {string} body.email - User email.
 * @param {string} body.password - User password.
 * @param {boolean} [body.venueManager] - Whether user is a venue manager.
 * @returns {Promise<Object>} Registration response.
 */
export function registerUser(body) {
  return request(AUTH_REGISTER, {
    method: "POST",
    body: JSON.stringify(body),
  });
}