export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const ADMIN_CREDENTIALS = {
  username: "admin",
  email: "admin@quiztournament.local",
};

export const TOURNAMENT_STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Inactive", value: "INACTIVE" },
];

export const DIFFICULTY_OPTIONS = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

export const CATEGORY_OPTIONS = [
  // TODO: Replace this static OpenTDB mapping when the backend exposes a category lookup endpoint.
  { label: "General Knowledge", value: 9 },
  { label: "Books", value: 10 },
  { label: "Film", value: 11 },
  { label: "Music", value: 12 },
  { label: "Science and Nature", value: 17 },
  { label: "Computers", value: 18 },
  { label: "Mathematics", value: 19 },
  { label: "Sports", value: 21 },
  { label: "Geography", value: 22 },
  { label: "History", value: 23 },
];

export function getCategoryLabel(categoryId) {
  const match = CATEGORY_OPTIONS.find((item) => Number(item.value) === Number(categoryId));
  return match?.label ?? `Category ${categoryId ?? "N/A"}`;
}

export const SESSION_STORAGE_KEY = "quizTournamentSession";
export const QUIZ_RESULT_STORAGE_KEY = "quizTournamentLatestResult";
