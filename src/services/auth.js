import { request } from "./api";
import { AUTH_LOGIN, AUTH_REGISTER } from "../config/api";

export function loginUser(body) {
  return request(AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function registerUser(body) {
  return request(AUTH_REGISTER, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
