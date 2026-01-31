// src/pages/Login/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuth } from "../../utils/auth";

import { loginUser } from "../../services/auth";
import { getProfile } from "../../services/profile";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("LOGIN submit:", { email });
      console.log("Calling loginUser...");

      const loginResponse = await loginUser({ email, password });
      console.log("Raw login response:", loginResponse);

      // Tilpass om din respons er annerledes:
      const token =
        loginResponse?.data?.accessToken ||
        loginResponse?.data?.data?.accessToken ||
        loginResponse?.accessToken;

      const name =
        loginResponse?.data?.name ||
        loginResponse?.data?.data?.name ||
        loginResponse?.data?.user?.name ||
        loginResponse?.name;

      console.log("Extracted token:", token);
      console.log("Extracted name:", name);

      if (!token || !name) {
        throw new Error("Mangler token eller name fra login-responsen.");
      }

      // 1) lagre token + name
      setAuth({ token, name });
      console.log("✅ Token saved:", token);
      console.log("✅ Name saved:", name);

      // 2) hent profil for å få venueManager riktig
      console.log("Calling getProfile(name) after login...");
      const profileResponse = await getProfile(name);
      console.log("Raw profile response (after login):", profileResponse);

      const profile =
        profileResponse?.data?.data || profileResponse?.data || profileResponse;

      const venueManager = Boolean(profile?.venueManager);
      console.log("venueManager from profile:", venueManager);

      // 3) lagre venueManager
      setAuth({ venueManager });
      console.log("✅ venueManager saved to localStorage:", venueManager);

      // 4) send til riktig sted
      const target = venueManager ? "/admin" : "/profile";
      console.log("Navigating to:", target);
      navigate(target, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Kunne ikke logge inn.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem", maxWidth: 420 }}>
      <h1>Login</h1>
      <p>Log in to book venues or manage your venues.</p>

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="username"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete="current-password"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p role="alert" style={{ color: "crimson", marginTop: 12 }}>
            {error}
          </p>
        )}
      </form>

      <p style={{ marginTop: 12 }}>
        Don&apos;t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}