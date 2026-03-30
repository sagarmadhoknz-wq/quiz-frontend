import { apiRequest } from "./apiClient";

export function registerPlayer(payload) {
  return apiRequest("/api/auth/register/player", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout(userId) {
  return apiRequest(`/api/auth/logout/${userId}`, {
    method: "POST",
  });
}
