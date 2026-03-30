import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import PlayerDashboardPage from "../PlayerDashboardPage";

vi.mock("../../utils/session", () => ({
  getSession: () => ({
    role: "player",
    user: {
      id: 7,
      username: "player7",
      email: "player7@example.com",
    },
  }),
  clearSession: vi.fn(),
}));

vi.mock("../../services/authService", () => ({
  logout: vi.fn(),
}));

const getOngoingTournaments = vi.fn();
const getUpcomingTournaments = vi.fn();
const getPastTournaments = vi.fn();
const getParticipatedTournaments = vi.fn();
const getPlayerHistory = vi.fn();
const searchTournaments = vi.fn();

vi.mock("../../services/playerTournamentService", () => ({
  getOngoingTournaments: (...args) => getOngoingTournaments(...args),
  getUpcomingTournaments: (...args) => getUpcomingTournaments(...args),
  getPastTournaments: (...args) => getPastTournaments(...args),
  getParticipatedTournaments: (...args) => getParticipatedTournaments(...args),
  getPlayerHistory: (...args) => getPlayerHistory(...args),
  searchTournaments: (...args) => searchTournaments(...args),
}));

const baseTournament = {
  id: 10,
  category: "Science and Nature",
  totalQuestions: 10,
  categoryId: 17,
  difficulty: "easy",
  status: "ONGOING",
  startDate: "2026-03-26T10:00:00",
  endDate: "2026-03-27T10:00:00",
  minPassingScore: 50,
  createdAt: "2026-03-26T10:00:00",
  createdByUserId: 1,
  createdByUsername: "admin",
  totalLikes: 2,
  questions: [],
};

describe("PlayerDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getOngoingTournaments.mockResolvedValue([{ ...baseTournament, id: 10, name: "Ongoing Cup" }]);
    getUpcomingTournaments.mockResolvedValue([]);
    getPastTournaments.mockResolvedValue([]);
    getParticipatedTournaments.mockResolvedValue([
      { ...baseTournament, id: 11, name: "Participated Cup" },
    ]);
    getPlayerHistory.mockResolvedValue([]);
    searchTournaments.mockResolvedValue([
      { ...baseTournament, id: 12, name: "History Search", category: "History" },
    ]);
  });

  it("keeps backend search results visible without reapplying tab data", async () => {
    render(
      <BrowserRouter>
        <PlayerDashboardPage />
      </BrowserRouter>
    );

    expect(await screen.findByText("Ongoing Cup")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "History" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByText("History Search")).toBeInTheDocument();
    expect(screen.getByText("Search Results")).toBeInTheDocument();
    expect(screen.queryByText("Participated Cup")).not.toBeInTheDocument();

    await waitFor(() =>
      expect(searchTournaments).toHaveBeenCalledWith({
        category: "History",
        difficulty: "",
      })
    );
    expect(getParticipatedTournaments).not.toHaveBeenCalled();
  });
});
