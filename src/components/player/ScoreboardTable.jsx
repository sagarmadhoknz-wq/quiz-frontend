export default function ScoreboardTable({ scores }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
            <th>Answered</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={`${score.userId}-${score.quizTournamentId}`}>
              <td>{score.username}</td>
              <td>{score.score}</td>
              <td>{score.totalAnswered}</td>
              <td>{score.completed ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
