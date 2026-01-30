// src/services/api.js
export async function request(url, options = {}) {
  const token = localStorage.getItem("token");
  const apiKey = process.env.REACT_APP_API_KEY;

  // MIDLER TIDLIG – kun for testing
  console.log("API KEY from env:", apiKey);
  console.log("TOKEN from localStorage:", token);

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

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.errors?.[0]?.message || data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}
