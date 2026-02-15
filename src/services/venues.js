// src/services/venues.js

import { request } from "./api";
import {
  VENUES,
  venueById,
  profileVenuesByName,
} from "../config/api";

/**
 * Get all venues (with pagination + sorting)
 * Default: newest first
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
 * Get single venue
 * Can include bookings and owner
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
 * Create venue
 */
export async function createVenue(payload) {
  return request(VENUES, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get venues for specific profile
 */
export async function getMyVenues(profileName) {
  return request(profileVenuesByName(profileName));
}

/**
 * Update venue
 */
export async function updateVenue(id, payload) {
  return request(venueById(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete venue
 */
export async function deleteVenue(id) {
  return request(venueById(id), {
    method: "DELETE",
  });
}
