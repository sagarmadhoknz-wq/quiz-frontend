export default function ScoreboardTable({ scores }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
            <th>Total Questions</th>
            <th>Passed</th>
            <th>Completed Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={`${score.userId}-${score.quizTournamentId}`}>
              <td>{score.playerName}</td>
              <td>{score.score}</td>
              <td>{score.totalQuestions}</td>
              <td>{score.passed ? "Yes" : "No"}</td>
              <td>{score.completedDate ? new Date(score.completedDate).toLocaleString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
