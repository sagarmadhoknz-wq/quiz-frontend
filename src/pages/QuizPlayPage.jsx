import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";
import TextField from "../components/common/TextField";
import AppShell from "../components/layout/AppShell";
import QuestionCard from "../components/player/QuestionCard";
import {
  getPlayerTournamentById,
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
  const [submitValues, setSubmitValues] = useState({
    score: 0,
    totalAnswered: 0,
  });
  const [submitErrors, setSubmitErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [questionFeedback, setQuestionFeedback] = useState("");

  useEffect(() => {
    async function loadTournament() {
      setLoading(true);
      setError("");

      try {
        const data = await getPlayerTournamentById(tournamentId);
        setTournament(data);
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

    const nextAnswers = { ...answers, [questionId]: option };
    const nextAnsweredCount = countAnsweredQuestions(nextAnswers);

    setAnswers(nextAnswers);
    setQuestionFeedback(
      "Correct/incorrect feedback is unavailable from the current backend because question answers are not exposed in QuestionResponse."
    );
    setSubmitValues((current) => ({
      ...current,
      totalAnswered: nextAnsweredCount,
    }));
  }

  function handleSubmissionFieldChange(event) {
    const { name, value } = event.target;
    setSubmitValues((current) => ({ ...current, [name]: value }));
    setSubmitErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit() {
    const payload = {
      userId: session?.user?.id,
      quizTournamentId: Number(tournamentId),
      score: Number(submitValues.score),
      totalAnswered: Number(submitValues.totalAnswered),
    };

    const validationErrors = validateQuizSubmission(payload, totalQuestions);
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
        tournamentTitle: tournament?.title,
        totalQuestions,
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
      subtitle="This flow uses the player details endpoint for questions and the player submit endpoint for results."
    >
      {error ? <AlertMessage type="error">{error}</AlertMessage> : null}

      {loading ? (
        <div className="panel">Loading quiz...</div>
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
            {questionFeedback ? <AlertMessage type="info">{questionFeedback}</AlertMessage> : null}

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
              <h2>Quiz Result Submission</h2>
              <p className="helper-text">
                TODO backend: `QuestionResponse` does not expose correct answers and
                there is no answer-check endpoint. The frontend therefore collects
                answer selections for the play flow but requires the final aggregate
                score to be entered explicitly before calling the real submit API.
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
            </div>

            <div className="form-grid">
              <TextField
                label="Final Score"
                name="score"
                type="number"
                min="0"
                value={submitValues.score}
                onChange={handleSubmissionFieldChange}
                error={submitErrors.score}
              />
              <TextField
                label="Total Answered"
                name="totalAnswered"
                type="number"
                min="0"
                value={submitValues.totalAnswered}
                onChange={handleSubmissionFieldChange}
                error={submitErrors.totalAnswered}
              />
            </div>

            <div className="alert alert-info">
              The DTO sent to the backend is <code>{`{ userId, quizTournamentId, score, totalAnswered }`}</code>.
            </div>

            <button className="button" type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit result"}
            </button>
          </section>
        </div>
      )}
    </AppShell>
  );
}
