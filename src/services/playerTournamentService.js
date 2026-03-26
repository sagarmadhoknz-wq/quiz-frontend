import { apiRequest } from "./apiClient";

export function getOngoingTournaments() {
  return apiRequest("/api/player/tournaments/ongoing");
}

export function getUpcomingTournaments() {
  return apiRequest("/api/player/tournaments/upcoming");
}

export function getPastTournaments() {
  return apiRequest("/api/player/tournaments/past");
}

export function getParticipatedTournaments(userId) {
  return apiRequest(`/api/player/tournaments/participated?userId=${userId}`);
}

export function searchTournaments({ category, difficulty }) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (difficulty) {
    params.set("difficulty", difficulty);
  }

  const query = params.toString();
  return apiRequest(`/api/player/tournaments/search${query ? `?${query}` : ""}`);
}

export function getPlayerHistory(userId) {
  return apiRequest(`/api/player/tournaments/history/${userId}`);
}

export function getPlayerTournamentById(tournamentId) {
  return apiRequest(`/api/player/tournaments/${tournamentId}`);
}

export function submitTournament(tournamentId, payload) {
  return apiRequest(`/api/player/tournaments/${tournamentId}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getTournamentScores(tournamentId) {
  return apiRequest(`/api/player/tournaments/${tournamentId}/scores`);
}

export function likeTournament(tournamentId, userId) {
  return apiRequest(`/api/player/tournaments/${tournamentId}/like/${userId}`, {
    method: "POST",
  });
}

export function unlikeTournament(tournamentId, userId) {
  return apiRequest(`/api/player/tournaments/${tournamentId}/unlike/${userId}`, {
    method: "POST",
  });
}
