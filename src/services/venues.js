import { request } from "./api";
import {
  VENUES,
  venueById,
  profileVenuesByName,
} from "../config/api";

/**
 * Get venues with pagination and sorting.
 *
 * @param {Object} [options={}] - Query options.
 * @param {number} [options.page=1] - Page number.
 * @param {number} [options.limit=20] - Number of venues per page.
 * @param {string} [options.sort="created"] - Field to sort by.
 * @param {string} [options.sortOrder="desc"] - Sort direction.
 * @returns {Promise<Array>} Venue list from the API.
 */
export async function getVenues(options = {}) {
  const {
    page = 1,
    limit = 20,
    sort = "created",
    sortOrder = "desc",
  } = options;

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (sort) params.set("sort", sort);
  if (sortOrder) params.set("sortOrder", sortOrder);

  const url = `${VENUES}?${params.toString()}`;

  return request(url);
}

/**
 * Get a single venue by ID.
 *
 * @param {string} id - Venue ID.
 * @param {Object} [options={}] - Include options.
 * @param {boolean} [options.withBookings=false] - Include venue bookings.
 * @param {boolean} [options.withOwner=false] - Include venue owner.
 * @returns {Promise<Object>} Venue data from the API.
 */
export async function getVenue(id, options = {}) {
  const { withBookings = false, withOwner = false } = options;

  const params = new URLSearchParams();

  if (withBookings) {
    params.set("_bookings", "true");
  }

  if (withOwner) {
    params.set("_owner", "true");
  }

  const query = params.toString();
  const url = query
    ? `${venueById(id)}?${query}`
    : venueById(id);

  return request(url);
}

/**
 * Create a new venue.
 *
 * @param {Object} payload - Venue payload.
 * @returns {Promise<Object>} Created venue data from the API.
 */
export async function createVenue(payload) {
  return request(VENUES, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get all venues owned by a profile.
 *
 * @param {string} profileName - Profile username.
 * @returns {Promise<Array>} Venue list from the API.
 */
export async function getMyVenues(profileName) {
  return request(profileVenuesByName(profileName));
}

/**
 * Update an existing venue.
 *
 * @param {string} id - Venue ID.
 * @param {Object} payload - Updated venue payload.
 * @returns {Promise<Object>} Updated venue data from the API.
 */
export async function updateVenue(id, payload) {
  return request(venueById(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a venue by ID.
 *
 * @param {string} id - Venue ID.
 * @returns {Promise<Object>} API response.
 */
export async function deleteVenue(id) {
  return request(venueById(id), {
    method: "DELETE",
  });
}