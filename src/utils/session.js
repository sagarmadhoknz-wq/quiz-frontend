import { QUIZ_RESULT_STORAGE_KEY, SESSION_STORAGE_KEY } from "./constants";

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveSession(user) {
  if (!isBrowser()) {
    return null;
  }

  const session = {
    user,
    role: user?.role?.toLowerCase() ?? "player",
  };

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  if (!isBrowser()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  window.localStorage.removeItem(QUIZ_RESULT_STORAGE_KEY);
}

export function saveLatestResult(result) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(QUIZ_RESULT_STORAGE_KEY, JSON.stringify(result));
}

export function getLatestResult() {
  if (!isBrowser()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(QUIZ_RESULT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    window.localStorage.removeItem(QUIZ_RESULT_STORAGE_KEY);
    return null;
  }
}
