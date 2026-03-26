import { render, screen } from "@testing-library/react";
import { within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import TournamentDetailsPage from "../TournamentDetailsPage";

const mockNavigate = vi.fn();

vi.mock("../../utils/session", () => ({
  getSession: () => ({
    role: "admin",
    user: {
      id: 1,
      username: "admin",
      email: "admin@quiztournament.local",
    },
  }),
  clearSession: vi.fn(),
}));

vi.mock("../../services/authService", () => ({
  logout: vi.fn(),
}));

const getAdminTournamentById = vi.fn();
const getTournamentAnalytics = vi.fn();

vi.mock("../../services/adminTournamentService", () => ({
  getAdminTournamentById: (...args) => getAdminTournamentById(...args),
  getTournamentAnalytics: (...args) => getTournamentAnalytics(...args),
}));

vi.mock("../../services/playerTournamentService", () => ({
  getPlayerTournamentById: vi.fn(),
  getTournamentScores: vi.fn(),
  likeTournament: vi.fn(),
  unlikeTournament: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TournamentDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAdminTournamentById.mockResolvedValue({
      id: 10,
      name: "Science Masters",
      category: "Science and Nature",
      totalQuestions: 2,
      categoryId: 17,
      difficulty: "easy",
      status: "ONGOING",
      startDate: "2026-03-26T10:00:00",
      endDate: "2026-03-27T10:00:00",
      minPassingScore: 50,
      createdAt: "2026-03-26T10:00:00",
      createdByUserId: 1,
      createdByUsername: "admin",
      totalLikes: 3,
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
    getTournamentAnalytics.mockResolvedValue({
      tournamentId: 10,
      tournamentName: "Science Masters",
      totalAttempts: 0,
      totalQuestions: 2,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0,
      totalLikes: 3,
    });
  });

  it("shows the question details screen for admin tournament viewing", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/tournaments/10"]}>
        <Routes>
          <Route
            path="/admin/tournaments/:tournamentId"
            element={<TournamentDetailsPage mode="admin" />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Question Details")).toBeInTheDocument();
    const questionCard = screen.getByTestId("question-detail-101");
    expect(questionCard).toBeInTheDocument();
    expect(screen.getByText("What planet is known as the Red Planet?")).toBeInTheDocument();
    expect(screen.getByText("Correct Answer")).toBeInTheDocument();
    expect(within(questionCard).getAllByText("Mars").length).toBeGreaterThan(0);
  });
});
