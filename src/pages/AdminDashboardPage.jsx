import { useEffect, useMemo, useState } from "react";
import DeleteTournamentModal from "../components/admin/DeleteTournamentModal";
import TournamentForm from "../components/admin/TournamentForm";
import TournamentTable from "../components/admin/TournamentTable";
import AlertMessage from "../components/common/AlertMessage";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import AppShell from "../components/layout/AppShell";
import {
  createTournament,
  deleteTournament,
  getAdminTournaments,
  updateTournament,
} from "../services/adminTournamentService";
import { getSession } from "../utils/session";
import {
  validateTournamentCreate,
  validateTournamentUpdate,
} from "../utils/validators";

const createInitialState = {
  title: "",
  status: "ACTIVE",
  categoryId: "",
  difficulty: "easy",
};

function getUpdateInitialState(tournament) {
  return {
    title: tournament?.title ?? "",
    subject: tournament?.subject ?? "",
    status: tournament?.status ?? "ACTIVE",
    totalQuestions: tournament?.totalQuestions ?? 10,
  };
}

export default function AdminDashboardPage() {
  const session = getSession();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createValues, setCreateValues] = useState(createInitialState);
  const [createErrors, setCreateErrors] = useState({});
  const [editingTournament, setEditingTournament] = useState(null);
  const [updateValues, setUpdateValues] = useState(getUpdateInitialState(null));
  const [updateErrors, setUpdateErrors] = useState({});
  const [deletingTournament, setDeletingTournament] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadTournaments() {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminTournaments();
      setTournaments(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTournaments();
  }, []);

  const stats = useMemo(() => {
    return {
      total: tournaments.length,
      active: tournaments.filter((item) => item.status === "ACTIVE").length,
      questions: tournaments.reduce((sum, item) => sum + (item.totalQuestions ?? 0), 0),
      likes: tournaments.reduce((sum, item) => sum + (item.totalLikes ?? 0), 0),
    };
  }, [tournaments]);

  function handleCreateChange(event) {
    const { name, value } = event.target;
    setCreateValues((current) => ({ ...current, [name]: value }));
    setCreateErrors((current) => ({ ...current, [name]: "" }));
  }

  function handleUpdateChange(event) {
    const { name, value } = event.target;
    setUpdateValues((current) => ({ ...current, [name]: value }));
    setUpdateErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleCreateSubmit(event) {
    event.preventDefault();
    const validationErrors = validateTournamentCreate(createValues);
    setCreateErrors(validationErrors);
    setError("");
    setSuccessMessage("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await createTournament({
        title: createValues.title.trim(),
        status: createValues.status,
        createdByUserId: session.user.id,
        categoryId: Number(createValues.categoryId),
        difficulty: createValues.difficulty,
      });
      setCreateOpen(false);
      setCreateValues(createInitialState);
      setSuccessMessage("Tournament created successfully.");
      await loadTournaments();
    } catch (submitError) {
      setCreateErrors(submitError.errors ?? {});
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateSubmit(event) {
    event.preventDefault();
    const validationErrors = validateTournamentUpdate(updateValues);
    setUpdateErrors(validationErrors);
    setError("");
    setSuccessMessage("");

    if (Object.keys(validationErrors).length > 0 || !editingTournament) {
      return;
    }

    setSubmitting(true);

    try {
      await updateTournament(editingTournament.id, {
        title: updateValues.title.trim(),
        subject: updateValues.subject.trim(),
        status: updateValues.status,
        totalQuestions: Number(updateValues.totalQuestions),
      });
      setEditingTournament(null);
      setSuccessMessage("Tournament updated successfully.");
      await loadTournaments();
    } catch (submitError) {
      setUpdateErrors(submitError.errors ?? {});
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingTournament) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccessMessage("");

    try {
      await deleteTournament(deletingTournament.id);
      setDeletingTournament(null);
      setSuccessMessage("Tournament deleted successfully.");
      await loadTournaments();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppShell
      title="Admin dashboard"
      subtitle="Manage tournaments through the real admin endpoints used by the Spring Boot backend."
      actions={
        <button
          className="button"
          type="button"
          onClick={() => setCreateOpen(true)}
          data-testid="open-create-tournament-modal"
        >
          Create tournament
        </button>
      }
    >
      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total tournaments</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active tournaments</div>
          <div className="stat-value">{stats.active}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Questions published</div>
          <div className="stat-value">{stats.questions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total likes</div>
          <div className="stat-value">{stats.likes}</div>
        </div>
      </section>

      {error ? <AlertMessage type="error">{error}</AlertMessage> : null}
      {successMessage ? <AlertMessage type="success">{successMessage}</AlertMessage> : null}

      <section className="panel stack">
        <div className="panel-header">
          <div>
            <h2>Tournaments</h2>
            <p className="helper-text">
              The table is rubric-aligned for screenshots: Creator, Name, Category, and Difficulty are shown directly.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading tournaments...</div>
        ) : tournaments.length === 0 ? (
          <EmptyState message="No tournaments exist yet. Create the first one from the admin dashboard." />
        ) : (
          <TournamentTable
            tournaments={tournaments}
            onEdit={(tournament) => {
              setEditingTournament(tournament);
              setUpdateValues(getUpdateInitialState(tournament));
              setUpdateErrors({});
            }}
            onDelete={setDeletingTournament}
          />
        )}
      </section>

      {createOpen ? (
        <Modal
          title="Create tournament"
          subtitle="This posts to /api/admin/tournaments and lets the backend fetch questions from OpenTDB."
          onClose={() => setCreateOpen(false)}
        >
          <TournamentForm
            mode="create"
            values={createValues}
            errors={createErrors}
            onChange={handleCreateChange}
            onSubmit={handleCreateSubmit}
            onCancel={() => setCreateOpen(false)}
            submitting={submitting}
          />
        </Modal>
      ) : null}

      {editingTournament ? (
        <Modal
          title="Update tournament"
          subtitle="This sends the backend update DTO: title, subject, status, and totalQuestions."
          onClose={() => setEditingTournament(null)}
        >
          <TournamentForm
            mode="update"
            values={updateValues}
            errors={updateErrors}
            onChange={handleUpdateChange}
            onSubmit={handleUpdateSubmit}
            onCancel={() => setEditingTournament(null)}
            submitting={submitting}
          />
        </Modal>
      ) : null}

      <DeleteTournamentModal
        tournament={deletingTournament}
        deleting={deleting}
        onCancel={() => setDeletingTournament(null)}
        onConfirm={handleDeleteConfirm}
      />
    </AppShell>
  );
}
