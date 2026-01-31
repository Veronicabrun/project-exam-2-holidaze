// src/services/profile.js
import { request } from "./api";
import { profileByName, profileBookingsByName } from "../config/api";

export function getProfile(name) {
  console.log("service:getProfile ->", name);
  return request(profileByName(name));
}

export function getMyBookings(name) {
  console.log("service:getMyBookings ->", name);
  return request(`${profileBookingsByName(name)}?_venue=true`);
}