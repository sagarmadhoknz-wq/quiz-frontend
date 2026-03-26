export function validateLogin(values) {
  const errors = {};

  if (!values.usernameOrEmail?.trim()) {
    errors.usernameOrEmail = "Username or email is required";
  }

  if (!values.password?.trim()) {
    errors.password = "Password is required";
  }

  return errors;
}

export function validateTournamentCreate(values) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = "Tournament name is required";
  }

  if (!values.categoryId) {
    errors.categoryId = "Category ID is required";
  }

  if (!values.difficulty) {
    errors.difficulty = "Difficulty is required";
  }

  if (!values.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!values.endDate) {
    errors.endDate = "End date is required";
  }

  if (!values.minPassingScore) {
    errors.minPassingScore = "Minimum passing score is required";
  } else {
    const score = Number(values.minPassingScore);
    if (Number.isNaN(score) || score < 1 || score > 100) {
      errors.minPassingScore = "Minimum passing score must be between 1 and 100";
    }
  }

  return errors;
}

export function validateTournamentUpdate(values) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = "Tournament name is required";
  }

  if (!values.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!values.endDate) {
    errors.endDate = "End date is required";
  }

  return errors;
}

export function validateQuizSubmission(values) {
  const errors = {};
  const answerCount = Object.keys(values.answers ?? {}).length;

  if (answerCount === 0) {
    errors.answers = "Select at least one answer before submitting";
  }

  return errors;
}
