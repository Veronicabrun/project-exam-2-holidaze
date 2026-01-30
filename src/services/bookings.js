import { request } from "./api";
import { BOOKINGS } from "../config/api";

export async function createBooking({ dateFrom, dateTo, guests, venueId }) {
  console.log("createBooking() payload:", { dateFrom, dateTo, guests, venueId });

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
