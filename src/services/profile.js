// src/services/profile.js
import { request } from "./api";
import { profileByName } from "../config/api";

export function getProfile(name) {
  return request(profileByName(name));
}
