import Modal from "../common/Modal";

export default function DeleteTournamentModal({
  tournament,
  deleting,
  onCancel,
  onConfirm,
}) {
  if (!tournament) {
    return null;
  }

  return (
    <Modal
      title="Delete tournament"
      subtitle="This removes the tournament and its related records from the backend."
      onClose={onCancel}
    >
      <p>
        Delete <strong>{tournament.title}</strong>?
      </p>
      <div className="row-between">
        <button className="button-secondary" type="button" onClick={onCancel}>
          Keep tournament
        </button>
        <button className="button-danger" type="button" onClick={onConfirm} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete now"}
        </button>
      </div>
    </Modal>
  );
}
