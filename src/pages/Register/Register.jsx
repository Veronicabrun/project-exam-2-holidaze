// src/pages/Register/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import {
  isValidEmail,
  isStudNoroffEmail,
  isValidPassword,
  isValidName,
} from "../../utils/validators";

import styles from "./Register.module.scss";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    form: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validateField(field, value) {
    const v = String(value).trim();

    if (field === "name") {
      if (!v) return "Username is required.";
      if (!isValidName(v)) return "Username must be at least 3 characters.";
      return "";
    }

    if (field === "email") {
      if (!v) return "Email is required.";
      if (!isValidEmail(v)) return "Please enter a valid email address.";
      if (!isStudNoroffEmail(v)) return "You must use a @stud.noroff.no email.";
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
      name: validateField("name", name),
      email: validateField("email", email),
      password: validateField("password", password),
      form: "",
    };

    setErrors(next);
    return !next.name && !next.email && !next.password;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    if (!validateAll()) return;

    try {
      setIsLoading(true);
      setErrors((p) => ({ ...p, form: "" }));

      await registerUser({ name, email, password, venueManager });

      navigate("/login");
    } catch (err) {
      setErrors((p) => ({
        ...p,
        form: err?.message || "Registration failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  }

  const showNameError = submitted && errors.name;
  const showEmailError = submitted && errors.email;
  const showPasswordError = submitted && errors.password;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>
          You must register with a <strong>@stud.noroff.no</strong> email.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Username
            </label>
            <input
              className={styles.input}
              id="name"
              required
              minLength={3}
              value={name}
              onChange={(e) => {
                const val = e.target.value;
                setName(val);

                if (submitted) {
                  setErrors((p) => ({
                    ...p,
                    name: validateField("name", val),
                    form: "",
                  }));
                }
              }}
              aria-invalid={Boolean(showNameError)}
            />
            {showNameError && <p className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              type="email"
              required
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
              placeholder="name@stud.noroff.no"
              aria-invalid={Boolean(showEmailError)}
            />
            {showEmailError && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              id="password"
              type="password"
              required
              minLength={8}
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
              aria-invalid={Boolean(showPasswordError)}
            />
            {showPasswordError && <p className={styles.error}>{errors.password}</p>}
          </div>

          <label className={styles.checkboxRow}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={venueManager}
              onChange={(e) => setVenueManager(e.target.checked)}
            />
            Register as Venue Manager
          </label>

          <button className={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Sign up"}
          </button>

          {errors.form && <p className={styles.error}>{errors.form}</p>}
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link className={styles.footerLink} to="/login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
