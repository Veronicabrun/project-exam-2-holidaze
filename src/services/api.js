// src/services/api.js
import { getAuth } from "../utils/auth";

export async function request(url, options = {}) {
  const { token } = getAuth();
  const apiKey = process.env.REACT_APP_API_KEY;

  console.log("API KEY from env:", apiKey);
  console.log("TOKEN from auth:", token ? token.slice(0, 12) + "..." : null);

  const headers = {
    "Content-Type": "application/json",
    ...(apiKey ? { "X-Noroff-API-Key": apiKey } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      json?.errors?.[0]?.message || json?.message || "Request failed";
    throw new Error(message);
  }

  // ✅ Normaliser: komponenter får alltid "ferdig data"
  return json?.data ?? json;
}
