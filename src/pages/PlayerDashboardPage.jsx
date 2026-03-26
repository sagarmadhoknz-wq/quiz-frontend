import { useEffect, useMemo, useState } from "react";
import AlertMessage from "../components/common/AlertMessage";
import EmptyState from "../components/common/EmptyState";
import TextField from "../components/common/TextField";
import AppShell from "../components/layout/AppShell";
import ScoreboardTable from "../components/player/ScoreboardTable";
import TournamentCard from "../components/player/TournamentCard";
import {
  CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
  PLAYER_TOURNAMENT_TABS,
  SEARCH_FILTER_DEFAULTS,
} from "../utils/constants";
import { getSession } from "../utils/session";
import {
  getOngoingTournaments,
  getParticipatedTournaments,
  getPastTournaments,
  getPlayerHistory,
  getUpcomingTournaments,
  searchTournaments,
} from "../services/playerTournamentService";

export default function PlayerDashboardPage() {
  const session = getSession();
  const [tournaments, setTournaments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ongoing");
  const [filters, setFilters] = useState(SEARCH_FILTER_DEFAULTS);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const tournamentRequest =
          activeTab === "ongoing"
            ? getOngoingTournaments()
            : activeTab === "upcoming"
              ? getUpcomingTournaments()
              : activeTab === "past"
                ? getPastTournaments()
                : getParticipatedTournaments(session.user.id);

        const [tournamentData, historyData] = await Promise.all([
          tournamentRequest,
          getPlayerHistory(session.user.id),
        ]);

        setTournaments(tournamentData);
        setHistory(historyData);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [activeTab, session.user.id]);

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await searchTournaments(filters);
      setTournaments(data);
      setActiveTab("search");
    } catch (searchError) {
      setError(searchError.message);
    } finally {
      setLoading(false);
    }
  }

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
      subtitle="Browse tournaments by status, search by category or difficulty, and submit answers for server-side scoring."
    >
      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Visible tournaments</div>
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

      <section className="panel stack">
        <div className="toolbar">
          {PLAYER_TOURNAMENT_TABS.map((tab) => (
            <button
              key={tab.value}
              className={activeTab === tab.value ? "button" : "button-secondary"}
              type="button"
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form className="grid grid-3" onSubmit={handleSearch}>
          <TextField
            label="Category"
            name="category"
            as="select"
            value={filters.category}
            onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
            options={CATEGORY_OPTIONS.map((item) => ({ label: item.label, value: item.label }))}
          />
          <TextField
            label="Difficulty"
            name="difficulty"
            as="select"
            value={filters.difficulty}
            onChange={(event) =>
              setFilters((current) => ({ ...current, difficulty: event.target.value }))
            }
            options={DIFFICULTY_OPTIONS}
          />
          <div className="form-group" style={{ alignSelf: "end" }}>
            <button className="button" type="submit">
              Search
            </button>
          </div>
        </form>
      </section>

      <section className="grid grid-2">
        {loading ? (
          <div className="empty-state">Loading tournaments...</div>
        ) : tournaments.length === 0 ? (
          <EmptyState message="No tournaments match the current player view." />
        ) : (
          tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))
        )}
      </section>

      <section className="panel stack">
        <div className="panel-header">
          <div>
            <h2>Quiz History</h2>
            <p className="helper-text">Loaded from the backend player history endpoint.</p>
          </div>
        </div>

        {history.length === 0 ? (
          <EmptyState message="No completed quiz history is available yet." />
        ) : (
          <ScoreboardTable scores={history} />
        )}
      </section>
    </AppShell>
  );
}
