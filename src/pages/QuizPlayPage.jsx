import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";
import AppShell from "../components/layout/AppShell";
import QuestionCard from "../components/player/QuestionCard";
import {
  getPlayerTournamentById,
  getTournamentScores,
  submitTournament,
} from "../services/playerTournamentService";
import { getSession, saveLatestResult } from "../utils/session";
import { countAnsweredQuestions } from "../utils/quiz";
import { validateQuizSubmission } from "../utils/validators";

export default function QuizPlayPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitErrors, setSubmitErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [existingAttempt, setExistingAttempt] = useState(null);

  useEffect(() => {
    async function loadTournament() {
      setLoading(true);
      setError("");

      try {
        const [tournamentResponse, scoresResponse] = await Promise.all([
          getPlayerTournamentById(tournamentId),
          getTournamentScores(tournamentId),
        ]);
        setTournament(tournamentResponse);
        setExistingAttempt(
          scoresResponse.find((score) => Number(score.userId) === Number(session?.user?.id)) ?? null
        );
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadTournament();
  }, [tournamentId]);

  const answeredCount = useMemo(() => countAnsweredQuestions(answers), [answers]);
  const currentQuestion = tournament?.questions?.[currentIndex] ?? null;
  const totalQuestions = tournament?.questions?.length ?? 0;

  function handleAnswerSelect(option) {
    const questionId = currentQuestion?.id;

    if (!questionId) {
      return;
    }

    setAnswers((current) => ({ ...current, [questionId]: option }));
    setSubmitErrors((current) => ({ ...current, answers: "" }));
  }

  async function handleSubmit() {
    const payload = {
      userId: session?.user?.id,
      answers,
    };

    const validationErrors = validateQuizSubmission(payload);
    setSubmitErrors(validationErrors);
    setError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitTournament(tournamentId, payload);
      const latestResult = {
        ...result,
        tournamentName: tournament?.name,
      };
      saveLatestResult(latestResult);
      navigate(`/player/tournaments/${tournamentId}/result`, {
        replace: true,
        state: { result: latestResult },
      });
    } catch (submitError) {
      setSubmitErrors(submitError.errors ?? {});
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell
      title="Quiz play"
      subtitle="Answers are submitted to the backend for server-side score calculation and feedback."
    >
      {error ? <AlertMessage type="error">{error}</AlertMessage> : null}

      {loading ? (
        <div className="panel">Loading quiz...</div>
      ) : existingAttempt ? (
        <section className="panel stack">
          <AlertMessage type="info">
            You have already completed this quiz. Your score: {existingAttempt.score}/
            {existingAttempt.totalQuestions}
          </AlertMessage>
          <Link className="button" to={`/player/tournaments/${tournamentId}`}>
            Back to tournament details
          </Link>
        </section>
      ) : tournament.status !== "ONGOING" ? (
        <section className="panel stack">
          <AlertMessage type="info">This quiz is not currently open for play.</AlertMessage>
          <Link className="button" to={`/player/tournaments/${tournamentId}`}>
            Back to tournament details
          </Link>
        </section>
      ) : !tournament || !currentQuestion ? (
        <div className="panel">The tournament could not be loaded for play.</div>
      ) : (
        <div className="grid grid-2">
          <section className="stack">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              selectedAnswer={answers[currentQuestion.id]}
              onSelect={handleAnswerSelect}
            />
            {submitErrors.answers ? <AlertMessage type="error">{submitErrors.answers}</AlertMessage> : null}

            <div className="row-between">
              <button
                className="button-secondary"
                type="button"
                onClick={() => setCurrentIndex((current) => Math.max(current - 1, 0))}
                disabled={currentIndex === 0}
              >
                Previous
              </button>
              <span className="muted">
                {currentIndex + 1} / {totalQuestions}
              </span>
              <button
                className="button"
                type="button"
                onClick={() =>
                  setCurrentIndex((current) => Math.min(current + 1, totalQuestions - 1))
                }
                disabled={currentIndex === totalQuestions - 1}
              >
                Next
              </button>
            </div>
          </section>

          <section className="panel stack">
            <div>
              <h2>Quiz Submission</h2>
              <p className="helper-text">
                The frontend sends <code>userId</code> and an <code>answers</code> map.
                The backend validates answers and returns score plus per-question feedback.
              </p>
            </div>

            <div className="score-card stack">
              <div className="row-between">
                <span className="stat-label">Answered questions</span>
                <strong>{answeredCount}</strong>
              </div>
              <div className="row-between">
                <span className="stat-label">Tournament total</span>
                <strong>{totalQuestions}</strong>
              </div>
              <div className="row-between">
                <span className="stat-label">Passing score</span>
                <strong>{tournament.minPassingScore}%</strong>
              </div>
            </div>

            <div className="alert alert-info">
              The DTO sent to the backend is <code>{`{ userId, answers: { questionId: selectedAnswer } }`}</code>.
            </div>

            <button className="button" type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit answers"}
            </button>
          </section>
        </div>
      )}
    </AppShell>
  );
}
