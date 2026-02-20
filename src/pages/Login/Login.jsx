import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuth } from "../../utils/auth";
import { loginUser } from "../../services/authService";
import { getProfile } from "../../services/profile";
import { isValidEmail, isValidPassword } from "../../utils/validators";
import styles from "./Login.module.scss";

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

      const token = loginResponse?.accessToken;
      const name = loginResponse?.name;

      if (!token || !name) throw new Error("Missing token or username from login response.");

      setAuth({ token, name });

      const profile = await getProfile(name);
      const venueManager = Boolean(profile?.venueManager);

      setAuth({
        venueManager,
        avatarUrl: profile?.avatar?.url || "",
        avatarAlt: profile?.avatar?.alt || "User avatar",
      });

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
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Log in to book venues or manage your venues.</p>

        <form onSubmit={onSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
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
              className={`${styles.input} ${showEmailError ? styles.inputError : ""}`}
              aria-invalid={Boolean(showEmailError)}
            />
            {showEmailError && (
              <p role="alert" className={styles.errorText}>
                {errors.email}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
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
              className={`${styles.input} ${showPasswordError ? styles.inputError : ""}`}
              aria-invalid={Boolean(showPasswordError)}
            />
            {showPasswordError && (
              <p role="alert" className={styles.errorText}>
                {errors.password}
              </p>
            )}
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {errors.form && (
            <p role="alert" className={styles.formError}>
              {errors.form}
            </p>
          )}
        </form>

        <p className={styles.footerText}>
          Don&apos;t have an account? <Link className={styles.inlineLink} to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
