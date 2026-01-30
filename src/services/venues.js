import { request } from "./api";
import { VENUES, venueById } from "../config/api";

export async function getVenues() {
  console.log("getVenues() calling:", VENUES);
  return request(VENUES);
}

export async function getVenue(id) {
  console.log("getVenue() calling:", venueById(id));
  return request(venueById(id));
}
