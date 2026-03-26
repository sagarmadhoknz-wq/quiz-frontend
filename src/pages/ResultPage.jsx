import { Link, useLocation } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import AppShell from "../components/layout/AppShell";
import { formatDateTime } from "../utils/formatters";
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
        <section className="stack">
          <section className="grid grid-2">
            <article className="panel stack">
              <div>
                <span className="eyebrow">Latest attempt</span>
                <h2>{result.tournamentName ?? "Quiz tournament"}</h2>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-label">Player</div>
                  <div className="stat-value" style={{ fontSize: "1.25rem" }}>
                    {result.playerName}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Score</div>
                  <div className="stat-value">{result.score}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Questions</div>
                  <div className="stat-value">{result.totalQuestions}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Passed</div>
                  <div className="stat-value" style={{ fontSize: "1.25rem" }}>
                    {result.passed ? "Yes" : "No"}
                  </div>
                </div>
              </div>

              <div className="muted">Completed: {formatDateTime(result.completedDate)}</div>
            </article>

            <article className="panel stack">
              <h2>Next actions</h2>
              <p className="helper-text">
                Go back to the player dashboard or reopen the tournament details page to compare your result with the leaderboard.
              </p>
              <Link className="button" to="/player">
                Back to player dashboard
              </Link>
              <Link className="button-secondary" to={`/player/tournaments/${result.quizTournamentId}`}>
                Open tournament details
              </Link>
            </article>
          </section>

          <section className="panel stack">
            <div className="panel-header">
              <div>
                <h2>Question Feedback</h2>
                <p className="helper-text">Returned by the backend after server-side answer checking.</p>
              </div>
            </div>

            {result.feedback?.length ? (
              <div className="stack">
                {result.feedback.map((item) => (
                  <article className="question-card stack" key={item.questionId}>
                    <div>
                      <h3>{item.questionText}</h3>
                      <div className="muted">Your answer: {item.playerAnswer ?? "No answer"}</div>
                    </div>
                    <div className="row-between">
                      <div>
                        <strong>Correct Answer</strong>
                        <div>{item.correctAnswer}</div>
                      </div>
                      <div>
                        <strong>Result</strong>
                        <div>{item.isCorrect ? "Correct" : "Incorrect"}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState message="No per-question feedback is available for this result." />
            )}
          </section>
        </section>
      )}
    </AppShell>
  );
}
