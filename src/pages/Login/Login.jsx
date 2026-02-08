import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuth } from "../../utils/auth";
import { loginUser } from "../../services/auth";
import { getProfile } from "../../services/profile";
import { isValidEmail, isValidPassword } from "../../utils/validators";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ email: "", password: "", form: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validateField(field, value) {
    const v = String(value).trim();

    if (field === "email") {
      if (!v) return "Email is required.";
      if (!isValidEmail(v)) return "Please enter a valid email address.";
      return "";
    }

    if (field === "password") {
      if (!value) return "Password is required.";
      if (!isValidPassword(value)) return "Password must be at least 8 characters.";
      return "";
    }

    return "";
  }

  function validateAll() {
    const next = {
      email: validateField("email", email),
      password: validateField("password", password),
      form: "",
    };

    setErrors(next);
    return !next.email && !next.password;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    if (!validateAll()) return;

    setLoading(true);
    setErrors((p) => ({ ...p, form: "" }));

    try {
      const loginResponse = await loginUser({ email, password });

      const token =
        loginResponse?.data?.accessToken ||
        loginResponse?.data?.data?.accessToken ||
        loginResponse?.accessToken;

      const name =
        loginResponse?.data?.name ||
        loginResponse?.data?.data?.name ||
        loginResponse?.data?.user?.name ||
        loginResponse?.name;

      if (!token || !name) {
        throw new Error("Missing token or username from login response.");
      }

      // 1) Lagre token+name først
      setAuth({ token, name });

      // 2) Hent profil for å få venueManager + avatar
      const profileResponse = await getProfile(name);
      const profile =
        profileResponse?.data?.data || profileResponse?.data || profileResponse;

      const venueManager = Boolean(profile?.venueManager);

      // 3) Oppdater auth med rolle + avatar
      setAuth({
        venueManager,
        avatarUrl: profile?.avatar?.url || "",
        avatarAlt: profile?.avatar?.alt || "User avatar",
      });

      // ✅ ALLTID til /profile
      navigate("/profile", { replace: true });
    } catch (err) {
      setErrors((p) => ({
        ...p,
        form: err?.message || "Login failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  const showEmailError = submitted && errors.email;
  const showPasswordError = submitted && errors.password;

  return (
    <div style={{ padding: "1rem", maxWidth: 420 }}>
      <h1>Login</h1>
      <p>Log in to book venues or manage your venues.</p>

      <form onSubmit={onSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => {
              const val = e.target.value;
              setEmail(val);

              if (submitted) {
                setErrors((p) => ({
                  ...p,
                  email: validateField("email", val),
                  form: "",
                }));
              }
            }}
            style={{ width: "100%", padding: 8 }}
            aria-invalid={Boolean(showEmailError)}
          />
          {showEmailError && (
            <p role="alert" style={{ color: "crimson", marginTop: 6 }}>
              {errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);

              if (submitted) {
                setErrors((p) => ({
                  ...p,
                  password: validateField("password", val),
                  form: "",
                }));
              }
            }}
            style={{ width: "100%", padding: 8 }}
            aria-invalid={Boolean(showPasswordError)}
          />
          {showPasswordError && (
            <p role="alert" style={{ color: "crimson", marginTop: 6 }}>
              {errors.password}
            </p>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {errors.form && (
          <p role="alert" style={{ color: "crimson", marginTop: 12 }}>
            {errors.form}
          </p>
        )}
      </form>

      <p style={{ marginTop: 12 }}>
        Don&apos;t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}