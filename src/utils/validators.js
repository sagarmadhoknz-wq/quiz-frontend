export function validateLogin(values) {
  const errors = {};

  if (!values.username?.trim()) {
    errors.username = "Username is required";
  }

  if (!values.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email must be valid";
  }

  if (!values.password?.trim()) {
    errors.password = "Password is required";
  }

  return errors;
}

export function validateTournamentCreate(values) {
  const errors = {};

  if (!values.title?.trim()) {
    errors.title = "Title is required";
  }

  if (!values.status) {
    errors.status = "Status is required";
  }

  if (!values.categoryId) {
    errors.categoryId = "Category is required";
  }

  if (!values.difficulty) {
    errors.difficulty = "Difficulty is required";
  }

  return errors;
}

export function validateTournamentUpdate(values) {
  const errors = {};

  if (!values.title?.trim()) {
    errors.title = "Title is required";
  }

  if (!values.subject?.trim()) {
    errors.subject = "Subject is required";
  }

  if (!values.status) {
    errors.status = "Status is required";
  }

  if (!values.totalQuestions || Number(values.totalQuestions) < 1) {
    errors.totalQuestions = "Total questions must be at least 1";
  }

  return errors;
}

export function validateQuizSubmission(values, totalQuestions) {
  const errors = {};
  const score = Number(values.score);
  const totalAnswered = Number(values.totalAnswered);

  if (Number.isNaN(score) || score < 0) {
    errors.score = "Score must be zero or greater";
  }

  if (Number.isNaN(totalAnswered) || totalAnswered < 0) {
    errors.totalAnswered = "Total answered must be zero or greater";
  }

  if (!Number.isNaN(totalAnswered) && totalQuestions && totalAnswered > totalQuestions) {
    errors.totalAnswered = "Total answered cannot exceed the question count";
  }

  if (
    !Number.isNaN(score) &&
    !Number.isNaN(totalAnswered) &&
    totalAnswered >= 0 &&
    score > totalAnswered
  ) {
    errors.score = "Fallback score cannot exceed answered questions";
  }

  return errors;
}
