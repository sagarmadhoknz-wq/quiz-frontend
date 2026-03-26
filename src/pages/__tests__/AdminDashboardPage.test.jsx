import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AdminDashboardPage from "../AdminDashboardPage";
import { renderWithRouter } from "../../test/testUtils";

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

const getAdminTournaments = vi.fn();
const createTournament = vi.fn();
const updateTournament = vi.fn();
const deleteTournament = vi.fn();
const getTournamentAnalytics = vi.fn();
const getTournamentLikes = vi.fn();

vi.mock("../../services/adminTournamentService", () => ({
  getAdminTournaments: (...args) => getAdminTournaments(...args),
  createTournament: (...args) => createTournament(...args),
  updateTournament: (...args) => updateTournament(...args),
  deleteTournament: (...args) => deleteTournament(...args),
  getTournamentAnalytics: (...args) => getTournamentAnalytics(...args),
  getTournamentLikes: (...args) => getTournamentLikes(...args),
}));

vi.mock("../../services/authService", () => ({
  logout: vi.fn(),
}));

const baseTournament = {
  id: 10,
  name: "Science Masters",
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

describe("AdminDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAdminTournaments.mockResolvedValue([baseTournament]);
    createTournament.mockResolvedValue(baseTournament);
    updateTournament.mockResolvedValue(baseTournament);
    deleteTournament.mockResolvedValue({ message: "Quiz tournament deleted successfully" });
    getTournamentAnalytics.mockResolvedValue({
      tournamentId: 10,
      tournamentName: "Science Masters",
      totalAttempts: 0,
      totalQuestions: 10,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0,
      totalLikes: 2,
    });
    getTournamentLikes.mockResolvedValue({ tournamentId: 10, totalLikes: 2 });
  });

  it("creates a tournament through the modal form", async () => {
    renderWithRouter(<AdminDashboardPage />);

    await screen.findByText("Science Masters");

    fireEvent.click(screen.getByTestId("open-create-tournament-modal"));

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "History Sprint" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "23" },
    });
    fireEvent.change(screen.getByLabelText("Difficulty"), {
      target: { value: "medium" },
    });
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2026-03-26T09:00" },
    });
    fireEvent.change(screen.getByLabelText("End Date"), {
      target: { value: "2026-03-27T09:00" },
    });
    fireEvent.change(screen.getByLabelText("Minimum Passing Score"), {
      target: { value: "60" },
    });
    fireEvent.click(screen.getByTestId("submit-create-tournament"));

    await waitFor(() =>
      expect(createTournament).toHaveBeenCalledWith({
        name: "History Sprint",
        createdByUserId: 1,
        categoryId: 23,
        difficulty: "medium",
        startDate: "2026-03-26T09:00",
        endDate: "2026-03-27T09:00",
        minPassingScore: 60,
      })
    );
  });

  it("updates a tournament through the edit modal", async () => {
    renderWithRouter(<AdminDashboardPage />);

    await screen.findByText("Science Masters");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Science Masters Updated" },
    });
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2026-03-28T09:00" },
    });
    fireEvent.change(screen.getByLabelText("End Date"), {
      target: { value: "2026-03-29T09:00" },
    });
    fireEvent.click(screen.getByTestId("submit-update-tournament"));

    await waitFor(() =>
      expect(updateTournament).toHaveBeenCalledWith(10, {
        name: "Science Masters Updated",
        startDate: "2026-03-28T09:00",
        endDate: "2026-03-29T09:00",
      })
    );
  });

  it("deletes a tournament after confirmation", async () => {
    renderWithRouter(<AdminDashboardPage />);

    await screen.findByText("Science Masters");

    fireEvent.click(screen.getByTestId("delete-tournament-10"));
    fireEvent.click(screen.getByRole("button", { name: "Delete now" }));

    await waitFor(() => expect(deleteTournament).toHaveBeenCalledWith(10));
  });
});
