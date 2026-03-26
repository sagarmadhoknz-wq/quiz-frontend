import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { clearSession, getSession } from "../../utils/session";

export default function AppShell({ title, subtitle, actions, children }) {
  const navigate = useNavigate();
  const session = getSession();

  async function handleLogout() {
    try {
      if (session?.user?.id) {
        await logout(session.user.id);
      }
    } catch {
      // Ignore logout API failures and still clear the local session.
    } finally {
      clearSession();
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="app-shell">
      <div className="page-container stack">
        <section className="hero-card">
          <div className="row-between">
            <div>
              <span className="eyebrow">{session?.role ?? "Guest"} workspace</span>
              <h1 className="page-title">{title}</h1>
              {subtitle ? <p className="lead">{subtitle}</p> : null}
            </div>
            <div className="header-actions">
              {actions}
              <button className="button-ghost" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </section>
        {children}
      </div>
    </div>
  );
}
