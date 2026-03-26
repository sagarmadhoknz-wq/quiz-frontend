import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import AppShell from "../components/layout/AppShell";
import ScoreboardTable from "../components/player/ScoreboardTable";
import { getAdminTournamentById } from "../services/adminTournamentService";
import {
  getPlayerTournamentById,
  getTournamentScores,
  likeTournament,
  unlikeTournament,
} from "../services/playerTournamentService";
import { formatDateTime } from "../utils/formatters";
import { getSession } from "../utils/session";
import { buildQuestionOptions } from "../utils/quiz";

export default function TournamentDetailsPage({ mode }) {
  const { tournamentId } = useParams();
  const session = getSession();
  const [tournament, setTournament] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [likeBusy, setLikeBusy] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const tournamentRequest =
          mode === "admin"
            ? getAdminTournamentById(tournamentId)
            : getPlayerTournamentById(tournamentId);

        const [tournamentResponse, scoresResponse] = await Promise.all([
          tournamentRequest,
          mode === "player" ? getTournamentScores(tournamentId) : Promise.resolve([]),
        ]);

        setTournament(tournamentResponse);
        setScores(scoresResponse);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [mode, tournamentId]);

  async function handleLikeAction(action) {
    if (!session?.user?.id || !tournament) {
      return;
    }

    setLikeBusy(true);
    setError("");
    setFeedback("");

    try {
      const response =
        action === "unlike"
          ? await unlikeTournament(tournament.id, session.user.id)
          : await likeTournament(tournament.id, session.user.id);

      setTournament((current) =>
        current ? { ...current, totalLikes: response.totalLikes } : current
      );
      setFeedback(response.message);
    } catch (toggleError) {
      setError(toggleError.message);
    } finally {
      setLikeBusy(false);
    }
  }

  return (
    <AppShell
      title={mode === "admin" ? "Tournament details" : "Tournament overview"}
      subtitle="Questions come from the backend response directly. The player page also loads the scoreboard endpoint."
      actions={
        mode === "player" && tournament ? (
          <>
            <button
              className="button-secondary"
              type="button"
              onClick={() => handleLikeAction("like")}
              disabled={likeBusy}
            >
              {likeBusy ? "Saving..." : "Like"}
            </button>
            <button
              className="button-secondary"
              type="button"
              onClick={() => handleLikeAction("unlike")}
              disabled={likeBusy}
            >
              {likeBusy ? "Saving..." : "Unlike"}
            </button>
            <Link className="button" to={`/player/tournaments/${tournament.id}/play`}>
              Play quiz
            </Link>
          </>
        ) : null
      }
    >
      {error ? <AlertMessage type="error">{error}</AlertMessage> : null}
      {feedback ? <AlertMessage type="success">{feedback}</AlertMessage> : null}

      {loading ? (
        <div className="panel">Loading tournament...</div>
      ) : !tournament ? (
        <EmptyState message="Tournament details are not available." />
      ) : (
        <>
          <section className="panel stack">
            <div className="row-between">
              <div>
                <h2>{tournament.title}</h2>
                <p className="lead">{tournament.subject}</p>
              </div>
              <StatusBadge status={tournament.status} />
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Difficulty</div>
                <div className="stat-value" style={{ fontSize: "1.35rem" }}>
                  {tournament.difficulty}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Questions</div>
                <div className="stat-value" style={{ fontSize: "1.35rem" }}>
                  {tournament.totalQuestions}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Likes</div>
                <div className="stat-value" style={{ fontSize: "1.35rem" }}>
                  {tournament.totalLikes}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Created</div>
                <div style={{ fontWeight: 700 }}>{formatDateTime(tournament.createdAt)}</div>
                <div className="muted">by {tournament.createdByUsername}</div>
              </div>
            </div>
          </section>

          <section className="panel stack">
            <div className="panel-header">
              <div>
                <h2>Question Details</h2>
                <p className="helper-text">
                  The question text is returned by the backend. Correct and incorrect
                  answers are labelled below, but the current DTO does not expose their values.
                </p>
              </div>
            </div>

            {tournament.questions?.length ? (
              <div className="stack">
                {tournament.questions.map((question, index) => (
                  <article
                    className="question-card stack"
                    key={question.id}
                    data-testid={`question-detail-${question.id}`}
                  >
                    <div>
                      <div className="eyebrow">Question {index + 1}</div>
                      <h3>{question.questionText}</h3>
                    </div>
                    <div className="grid grid-2">
                      <div className="option-card">
                        <strong>Correct Answer</strong>
                        <div className="muted">TODO backend: not exposed by current backend DTO</div>
                      </div>
                      <div className="option-card">
                        <strong>Incorrect Answers</strong>
                        <div className="muted">TODO backend: not exposed separately by current backend DTO</div>
                      </div>
                    </div>
                    <div className="stack">
                      <strong>Available Options Returned By API</strong>
                      <div className="grid grid-2">
                        {buildQuestionOptions(question).map((option) => (
                          <div className="option-card" key={option}>
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState message="No questions are attached to this tournament." />
            )}
          </section>

          {mode === "player" ? (
            <section className="panel stack">
              <div className="panel-header">
                <div>
                  <h2>Leaderboard</h2>
                  <p className="helper-text">
                    Loaded from the real `/scores` endpoint. TODO backend: there is
                    no endpoint that tells the frontend whether the current user has
                    already liked this tournament, so the UI exposes explicit Like
                    and Unlike actions instead of guessing a toggle state.
                  </p>
                </div>
              </div>

              {scores.length === 0 ? (
                <EmptyState message="No scores have been submitted yet." />
              ) : (
                <ScoreboardTable scores={scores} />
              )}
            </section>
          ) : null}
        </>
      )}
    </AppShell>
  );
}
