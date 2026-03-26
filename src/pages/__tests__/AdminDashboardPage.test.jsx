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

vi.mock("../../services/adminTournamentService", () => ({
  getAdminTournaments: (...args) => getAdminTournaments(...args),
  createTournament: (...args) => createTournament(...args),
  updateTournament: (...args) => updateTournament(...args),
  deleteTournament: (...args) => deleteTournament(...args),
}));

vi.mock("../../services/authService", () => ({
  logout: vi.fn(),
}));

const baseTournament = {
  id: 10,
  title: "Science Masters",
  subject: "Science and Nature",
  totalQuestions: 10,
  categoryId: 17,
  difficulty: "easy",
  status: "ACTIVE",
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
  });

  it("creates a tournament through the modal form", async () => {
    renderWithRouter(<AdminDashboardPage />);

    await screen.findByText("Science Masters");

    fireEvent.click(screen.getByTestId("open-create-tournament-modal"));

    fireEvent.change(screen.getByLabelText("Tournament Name"), {
      target: { value: "History Sprint" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "23" },
    });
    fireEvent.change(screen.getByLabelText("Difficulty"), {
      target: { value: "medium" },
    });
    fireEvent.click(screen.getByTestId("submit-create-tournament"));

    await waitFor(() =>
      expect(createTournament).toHaveBeenCalledWith({
        title: "History Sprint",
        status: "ACTIVE",
        createdByUserId: 1,
        categoryId: 23,
        difficulty: "medium",
      })
    );
  });

  it("updates a tournament through the edit modal", async () => {
    renderWithRouter(<AdminDashboardPage />);

    await screen.findByText("Science Masters");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    fireEvent.change(screen.getByLabelText("Tournament Name"), {
      target: { value: "Science Masters Updated" },
    });
    fireEvent.change(screen.getByLabelText("Category / Subject Label"), {
      target: { value: "Updated Science" },
    });
    fireEvent.change(screen.getByLabelText("Total Questions"), {
      target: { value: "12" },
    });
    fireEvent.click(screen.getByTestId("submit-update-tournament"));

    await waitFor(() =>
      expect(updateTournament).toHaveBeenCalledWith(10, {
        title: "Science Masters Updated",
        subject: "Updated Science",
        status: "ACTIVE",
        totalQuestions: 12,
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
