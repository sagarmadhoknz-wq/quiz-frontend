import { Link, useLocation } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { getLatestResult } from "../utils/session";

export default function ResultPage() {
  const location = useLocation();
  const result = location.state?.result ?? getLatestResult();

  return (
    <AppShell
      title="Submission result"
      subtitle="This screen reflects the `ScoreResponse` returned by the backend submit endpoint."
    >
      {!result ? (
        <section className="panel">No result is available yet.</section>
      ) : (
        <section className="grid grid-2">
          <article className="panel stack">
            <div>
              <span className="eyebrow">Latest attempt</span>
              <h2>{result.tournamentTitle ?? "Quiz tournament"}</h2>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Player</div>
                <div className="stat-value" style={{ fontSize: "1.25rem" }}>
                  {result.username}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Score</div>
                <div className="stat-value">{result.score}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Answered</div>
                <div className="stat-value">{result.totalAnswered}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Completed</div>
                <div className="stat-value" style={{ fontSize: "1.25rem" }}>
                  {result.completed ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </article>

          <article className="panel stack">
            <h2>Next actions</h2>
            <p className="helper-text">
              You can go back to the player dashboard or reopen the tournament details
              page to compare your result with the leaderboard.
            </p>
            <Link className="button" to="/player">
              Back to player dashboard
            </Link>
            <Link className="button-secondary" to={`/player/tournaments/${result.quizTournamentId}`}>
              Open tournament details
            </Link>
          </article>
        </section>
      )}
    </AppShell>
  );
}
