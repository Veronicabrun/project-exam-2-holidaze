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

// ✅ NEW: update avatar
export function updateAvatar(username, avatar) {
  console.log("service:updateAvatar ->", { username, avatar });

  // Noroff Holidaze: PUT /profiles/{name}
  // Body: { avatar: { url, alt } }
  return request(profileByName(username), {
    method: "PUT",
    body: JSON.stringify({
      avatar,
    }),
  });
}