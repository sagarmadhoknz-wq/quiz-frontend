import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";
import TextField from "../components/common/TextField";
import { registerPlayer } from "../services/authService";
import { validateRegister } from "../utils/validators";

const initialValues = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  profilePicture: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateRegister(values);
    setErrors(validationErrors);
    setServerError("");
    setSuccessMessage("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await registerPlayer({
        username: values.username.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
        profilePicture: values.profilePicture.trim() || null,
      });
      setSuccessMessage(response.message);
      setValues(initialValues);
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (error) {
      setErrors(error.errors ?? {});
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-side">
        <div className="auth-copy">
          <span className="eyebrow">Player Registration</span>
          <h1 className="auth-title">Create a player account against the real Spring Boot auth API.</h1>
          <p className="lead">
            This form posts the backend register DTO directly to <code>/api/auth/register/player</code>.
          </p>
        </div>
      </section>

      <section className="auth-side auth-form-wrap">
        <div className="panel" style={{ width: "min(520px, 100%)" }}>
          <div className="stack">
            <div>
              <h2>Create player account</h2>
              <p className="helper-text">
                Required fields are username, first name, last name, email, and password.
              </p>
            </div>

            {serverError ? <AlertMessage type="error">{serverError}</AlertMessage> : null}
            {successMessage ? <AlertMessage type="success">{successMessage}</AlertMessage> : null}

            <form className="form-grid" onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                error={errors.username}
              />
              <div className="grid grid-2">
                <TextField
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
              />
              <TextField
                label="Profile Picture URL"
                name="profilePicture"
                value={values.profilePicture}
                onChange={handleChange}
                error={errors.profilePicture}
                placeholder="Optional"
              />

              <div className="row-between">
                <Link className="button-secondary" to="/login">
                  Back to login
                </Link>
                <button className="button" type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
