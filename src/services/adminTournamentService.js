import { apiRequest } from "./apiClient";

export function getAdminTournaments() {
  return apiRequest("/api/admin/tournaments");
}

export function getAdminTournamentById(tournamentId) {
  return apiRequest(`/api/admin/tournaments/${tournamentId}`);
}

export function createTournament(payload) {
  return apiRequest("/api/admin/tournaments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTournament(tournamentId, payload) {
  return apiRequest(`/api/admin/tournaments/${tournamentId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTournament(tournamentId) {
  return apiRequest(`/api/admin/tournaments/${tournamentId}`, {
    method: "DELETE",
  });
}
