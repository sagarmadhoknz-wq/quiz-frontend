import { API_BASE_URL } from "../utils/constants";

async function parseJsonSafely(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const error = new Error(
      data?.message ?? "The request could not be completed."
    );
    error.status = response.status;
    error.errors = data?.errors ?? null;
    error.payload = data;
    throw error;
  }

  return data;
}
