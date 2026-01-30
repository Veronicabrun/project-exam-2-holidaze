// src/services/auth.js
import { request } from "./api";
import { AUTH_LOGIN, AUTH_REGISTER } from "../config/api";

export async function loginUser({ email, password }) {
  return request(AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser({ name, email, password, venueManager }) {
  return request(AUTH_REGISTER, {
    method: "POST",
    body: JSON.stringify({ name, email, password, venueManager }),
  });
}
