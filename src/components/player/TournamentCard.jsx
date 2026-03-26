import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

export default function TournamentCard({ tournament }) {
  return (
    <article className="panel stack">
      <div className="row-between">
        <div>
          <h3>{tournament.title}</h3>
          <p className="muted">
            {tournament.subject} • {tournament.difficulty}
          </p>
        </div>
        <StatusBadge status={tournament.status} />
      </div>

      <div className="cards-row">
        <div>
          <div className="stat-label">Questions</div>
          <div>{tournament.totalQuestions}</div>
        </div>
        <div>
          <div className="stat-label">Likes</div>
          <div>{tournament.totalLikes}</div>
        </div>
        <div>
          <div className="stat-label">Created by</div>
          <div>{tournament.createdByUsername}</div>
        </div>
      </div>

      <div className="row-between">
        <span className="muted">{formatDateTime(tournament.createdAt)}</span>
        <Link className="button" to={`/player/tournaments/${tournament.id}`}>
          View tournament
        </Link>
      </div>
    </article>
  );
}
