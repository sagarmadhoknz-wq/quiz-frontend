import { useEffect, useMemo, useState } from "react";
import AlertMessage from "../components/common/AlertMessage";
import EmptyState from "../components/common/EmptyState";
import AppShell from "../components/layout/AppShell";
import TournamentCard from "../components/player/TournamentCard";
import { getPlayerTournaments } from "../services/playerTournamentService";

export default function PlayerDashboardPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTournaments() {
      setLoading(true);
      setError("");

      try {
        const data = await getPlayerTournaments();
        setTournaments(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadTournaments();
  }, []);

  const stats = useMemo(() => {
    return {
      active: tournaments.length,
      likes: tournaments.reduce((sum, item) => sum + (item.totalLikes ?? 0), 0),
      questions: tournaments.reduce((sum, item) => sum + (item.totalQuestions ?? 0), 0),
    };
  }, [tournaments]);

  return (
    <AppShell
      title="Player dashboard"
      subtitle="Browse active tournaments, open details, view leaderboards, and submit quiz attempts."
    >
      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Active tournaments</div>
          <div className="stat-value">{stats.active}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available questions</div>
          <div className="stat-value">{stats.questions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total likes</div>
          <div className="stat-value">{stats.likes}</div>
        </div>
      </section>

      {error ? <AlertMessage type="error">{error}</AlertMessage> : null}

      <section className="grid grid-2">
        {loading ? (
          <div className="empty-state">Loading tournaments...</div>
        ) : tournaments.length === 0 ? (
          <EmptyState message="There are no ACTIVE tournaments available right now." />
        ) : (
          tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))
        )}
      </section>
    </AppShell>
  );
}
