import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import QuizPlayPage from "../QuizPlayPage";

vi.mock("../../utils/session", () => ({
  getSession: () => ({
    role: "player",
    user: {
      id: 7,
      username: "player7",
      email: "player7@example.com",
    },
  }),
  saveLatestResult: vi.fn(),
  clearSession: vi.fn(),
}));

vi.mock("../../services/authService", () => ({
  logout: vi.fn(),
}));

const getPlayerTournamentById = vi.fn();
const getTournamentScores = vi.fn();
const submitTournament = vi.fn();

vi.mock("../../services/playerTournamentService", () => ({
  getPlayerTournamentById: (...args) => getPlayerTournamentById(...args),
  getTournamentScores: (...args) => getTournamentScores(...args),
  submitTournament: (...args) => submitTournament(...args),
}));

describe("QuizPlayPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPlayerTournamentById.mockResolvedValue({
      id: 10,
      name: "Science Masters",
      totalQuestions: 2,
      difficulty: "easy",
      status: "ONGOING",
      minPassingScore: 50,
      questions: [
        {
          id: 101,
          type: "multiple",
          questionText: "What planet is known as the Red Planet?",
          options: ["Earth", "Mars", "Jupiter", "Saturn"],
          correctAnswer: "Mars",
          points: 1,
        },
      ],
    });
    getTournamentScores.mockResolvedValue([
      {
        userId: 7,
        playerName: "Ada Lovelace",
        quizTournamentId: 10,
        score: 1,
        totalQuestions: 2,
        passed: true,
        completedDate: "2026-03-30T20:00:00",
      },
    ]);
  });

  it("blocks replay when the logged-in player already has a score entry", async () => {
    render(
      <MemoryRouter initialEntries={["/player/tournaments/10/play"]}>
        <Routes>
          <Route path="/player/tournaments/:tournamentId/play" element={<QuizPlayPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/You have already completed this quiz/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Submit answers" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to tournament details" })).toBeInTheDocument();
    expect(submitTournament).not.toHaveBeenCalled();
  });
});
