import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";
import TextField from "../components/common/TextField";
import { login } from "../services/authService";
import { saveSession } from "../utils/session";
import { validateLogin } from "../utils/validators";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function useAdminDemo() {
    setValues({
      username: "admin",
      email: "admin@quiztournament.local",
      password: "op@1234",
    });
    setErrors({});
    setServerError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await login(values);
      const session = saveSession(response.user);
      const fallbackRoute = session.role === "admin" ? "/admin" : "/player";
      const redirectRoute = location.state?.from?.pathname ?? fallbackRoute;
      navigate(redirectRoute, { replace: true });
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
          <span className="eyebrow">Quiz Tournament Portal</span>
          <h1 className="auth-title">React frontend for the Spring Boot quiz backend.</h1>
          <p className="lead">
            Login uses the real backend contract: a username, email, and password
            are posted to <code>/api/auth/login</code>. Existing users are validated,
            and new player users are created automatically by the backend.
          </p>
          <div className="alert alert-info">
            Admin shortcut: <strong>admin / admin@quiztournament.local / op@1234</strong>
          </div>
        </div>
      </section>

      <section className="auth-side auth-form-wrap">
        <div className="panel" style={{ width: "min(480px, 100%)" }}>
          <div className="stack">
            <div>
              <h2>Sign in</h2>
              <p className="helper-text">
                Players can use any new username and email combination. The admin
                account is seeded by the backend initializer.
              </p>
            </div>

            {serverError ? <AlertMessage type="error">{serverError}</AlertMessage> : null}

            <form className="form-grid" onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                error={errors.username}
                placeholder="Enter your username"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
              />

              <div className="row-between">
                <button className="button-secondary" type="button" onClick={useAdminDemo}>
                  Use admin account
                </button>
                <button className="button" type="submit" disabled={submitting}>
                  {submitting ? "Signing in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
