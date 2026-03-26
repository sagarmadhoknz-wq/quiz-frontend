import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import AppShell from "../components/layout/AppShell";
import ScoreboardTable from "../components/player/ScoreboardTable";
import {
  getAdminTournamentById,
  getTournamentAnalytics,
} from "../services/adminTournamentService";
import {
  getPlayerTournamentById,
  getTournamentScores,
  likeTournament,
  unlikeTournament,
} from "../services/playerTournamentService";
import { getCategoryLabel } from "../utils/constants";
import { formatDateTime } from "../utils/formatters";
import { getSession } from "../utils/session";
import { buildQuestionOptions } from "../utils/quiz";

export default function TournamentDetailsPage({ mode }) {
  const { tournamentId } = useParams();
  const session = getSession();
  const [tournament, setTournament] = useState(null);
  const [scores, setScores] = useState([]);
  const [analytics, setAnalytics] = useState(null);
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

        const [tournamentResponse, scoresResponse, analyticsResponse] = await Promise.all([
          tournamentRequest,
          mode === "player" ? getTournamentScores(tournamentId) : Promise.resolve([]),
          mode === "admin" ? getTournamentAnalytics(tournamentId) : Promise.resolve(null),
        ]);

        setTournament(tournamentResponse);
        setScores(scoresResponse);
        setAnalytics(analyticsResponse);
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
      subtitle="This page uses the current backend tournament DTO, leaderboard endpoint, and admin analytics endpoint."
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
                <h2>{tournament.name}</h2>
                <p className="lead">{tournament.category ?? getCategoryLabel(tournament.categoryId)}</p>
              </div>
              <StatusBadge status={tournament.status} />
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Difficulty</div>
                <div className="stat-value" style={{ fontSize: "1.2rem" }}>
                  {tournament.difficulty}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Start Date</div>
                <div style={{ fontWeight: 700 }}>{formatDateTime(tournament.startDate)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">End Date</div>
                <div style={{ fontWeight: 700 }}>{formatDateTime(tournament.endDate)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Passing Score</div>
                <div className="stat-value" style={{ fontSize: "1.2rem" }}>
                  {tournament.minPassingScore}%
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Questions</div>
                <div className="stat-value" style={{ fontSize: "1.2rem" }}>
                  {tournament.totalQuestions}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Likes</div>
                <div className="stat-value" style={{ fontSize: "1.2rem" }}>
                  {tournament.totalLikes}
                </div>
              </div>
            </div>
          </section>

          {mode === "admin" && analytics ? (
            <section className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Attempts</div>
                <div className="stat-value" style={{ fontSize: "1.2rem" }}>
                  {analytics.totalAttempts}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Average Score</div>
                <div className="stat-value" style={{ fontSize: "1.2rem" }}>
                  {analytics.averageScore}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Highest Score</div>
                <div className="stat-value" style={{ fontSize: "1.2rem" }}>
                  {analytics.highestScore}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Pass Rate</div>
                <div className="stat-value" style={{ fontSize: "1.2rem" }}>
                  {analytics.passRate}%
                </div>
              </div>
            </section>
          ) : null}

          <section className="panel stack">
            <div className="panel-header">
              <div>
                <h2>Question Details</h2>
                <p className="helper-text">
                  Admin detail uses the backend DTO that now includes the correct answer.
                </p>
              </div>
            </div>

            {tournament.questions?.length ? (
              <div className="stack">
                {tournament.questions.map((question, index) => {
                  const options = buildQuestionOptions(question);
                  const incorrectAnswers = options.filter((option) => option !== question.correctAnswer);

                  return (
                    <article
                      className="question-card stack"
                      key={question.id}
                      data-testid={`question-detail-${question.id}`}
                    >
                      <div>
                        <div className="eyebrow">Question {index + 1}</div>
                        <h3>{question.questionText}</h3>
                      </div>
                      {mode === "admin" ? (
                        <div className="grid grid-2">
                          <div className="option-card">
                            <strong>Correct Answer</strong>
                            <div className="muted">{question.correctAnswer ?? "Not available"}</div>
                          </div>
                          <div className="option-card">
                            <strong>Incorrect Answers</strong>
                            <div className="muted">{incorrectAnswers.join(", ") || "Not available"}</div>
                          </div>
                        </div>
                      ) : null}
                      <div className="stack">
                        <strong>Options</strong>
                        <div className="grid grid-2">
                          {options.map((option) => (
                            <div className="option-card" key={option}>
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
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
                    Loaded from the real `/scores` endpoint with aggregate tournament values.
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
