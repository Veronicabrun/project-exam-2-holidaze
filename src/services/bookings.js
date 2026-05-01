import { request } from "./api";
import { BOOKINGS } from "../config/api";

/**
 * Create a booking for a venue.
 *
 * @param {Object} params - Booking payload.
 * @param {string} params.dateFrom - Check-in date in YYYY-MM-DD format.
 * @param {string} params.dateTo - Check-out date in YYYY-MM-DD format.
 * @param {number} params.guests - Number of guests.
 * @param {string} params.venueId - Venue ID to book.
 * @returns {Promise<Object>} Created booking data from the API.
 */
export async function createBooking({ dateFrom, dateTo, guests, venueId }) {
  return request(BOOKINGS, {
    method: "POST",
    body: JSON.stringify({
      dateFrom,
      dateTo,
      guests,
      venueId,
    }),
  });
}