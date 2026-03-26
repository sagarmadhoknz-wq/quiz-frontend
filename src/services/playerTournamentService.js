import { apiRequest } from "./apiClient";

export function getPlayerTournaments() {
  return apiRequest("/api/player/tournaments");
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
  return apiRequest(`/api/player/tournaments/${tournamentId}/likes/${userId}`, {
    method: "POST",
  });
}

export function unlikeTournament(tournamentId, userId) {
  return apiRequest(`/api/player/tournaments/${tournamentId}/unlikes/${userId}`, {
    method: "POST",
  });
}
