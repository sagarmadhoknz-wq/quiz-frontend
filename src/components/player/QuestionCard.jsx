import { buildQuestionOptions } from "../../utils/quiz";

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelect,
}) {
  const options = buildQuestionOptions(question);

  return (
    <section className="question-card stack">
      <div>
        <div className="eyebrow">Question {questionNumber}</div>
        <h2>{question.questionText}</h2>
        <p className="muted">Each question is currently worth {question.points} point.</p>
      </div>

      <div className="options-grid">
        {options.map((option) => (
          <button
            key={option}
            className={`option-card ${selectedAnswer === option ? "selected" : ""}`}
            type="button"
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
