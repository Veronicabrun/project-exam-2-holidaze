import { request } from "./api";
import { VENUES, venueById } from "../config/api";

export async function getVenues() {
  return request(VENUES);
}

export async function getVenue(id, options = {}) {
  const { withBookings = false } = options;

  const url = withBookings
    ? `${venueById(id)}?_bookings=true`
    : venueById(id);

  return request(url);
}
