export function buildQuestionOptions(question) {
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
