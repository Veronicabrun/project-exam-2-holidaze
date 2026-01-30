import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function isStudNoroffEmail(value) {
    return value.toLowerCase().endsWith("@stud.noroff.no");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    console.log("REGISTER submit:", { name, email, password, venueManager });

    if (!isStudNoroffEmail(email)) {
      setError("Du må registrere deg med en @stud.noroff.no e-post.");
      return;
    }

    try {
      setIsLoading(true);

      console.log("Calling registerUser...");
      const response = await registerUser({ name, email, password, venueManager });

      console.log("Raw register response:", response);

      // Noroff v2 returnerer ofte { data, meta }
      const user = response.data;
      console.log("Registered user:", user);

      // Etter register: send til login
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem", maxWidth: 420 }}>
      <h1>Create an account</h1>
      <p>You must register with a @stud.noroff.no email.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="name">Username</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@stud.noroff.no"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={venueManager}
              onChange={(e) => setVenueManager(e.target.checked)}
            />
            Register as Venue Manager
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Sign up"}
        </button>

        {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

