export function buildQuestionOptions(question) {
  if (Array.isArray(question.options)) {
    return question.options.filter(Boolean);
  }

  return [
    question.optionA,
    question.optionB,
    question.optionC,
    question.optionD,
  ].filter(Boolean);
}

export function countAnsweredQuestions(answers) {
  return Object.values(answers).filter(Boolean).length;
}
