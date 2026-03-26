import { Link } from "react-router-dom";
import { getCategoryLabel } from "../../utils/constants";
import { formatDateTime } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

export default function TournamentTable({ tournaments, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Creator</th>
            <th>Name</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Status</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament.id} data-testid={`admin-tournament-row-${tournament.id}`}>
              <td>{tournament.createdByUsername}</td>
              <td>
                <Link className="button-ghost" to={`/admin/tournaments/${tournament.id}`}>
                  {tournament.name}
                </Link>
                <div className="muted">{formatDateTime(tournament.createdAt)}</div>
              </td>
              <td>
                <div>{tournament.category ?? getCategoryLabel(tournament.categoryId)}</div>
                <div className="muted">ID: {tournament.categoryId}</div>
              </td>
              <td>{tournament.difficulty}</td>
              <td>
                <StatusBadge status={tournament.status} />
              </td>
              <td>{tournament.totalQuestions}</td>
              <td>
                <div className="toolbar">
                  <button className="button-secondary" type="button" onClick={() => onEdit(tournament)}>
                    Edit
                  </button>
                  <button
                    className="button-danger"
                    type="button"
                    onClick={() => onDelete(tournament)}
                    data-testid={`delete-tournament-${tournament.id}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
