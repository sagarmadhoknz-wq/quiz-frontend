import TextField from "../common/TextField";
import {
  CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
  TOURNAMENT_STATUS_OPTIONS,
} from "../../utils/constants";

export default function TournamentForm({
  mode,
  values,
  errors,
  onChange,
  onSubmit,
  onCancel,
  submitting,
}) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <TextField
        label="Name"
        name="title"
        value={values.title}
        onChange={onChange}
        error={errors.title}
        placeholder="Enter name"
      />

      {mode === "create" ? (
        <>
          <TextField
            label="Status"
            name="status"
            as="select"
            value={values.status}
            onChange={onChange}
            error={errors.status}
            options={TOURNAMENT_STATUS_OPTIONS}
          />
          <TextField
            label="Category"
            name="categoryId"
            as="select"
            value={values.categoryId}
            onChange={onChange}
            error={errors.categoryId}
            options={CATEGORY_OPTIONS}
          />
          <TextField
            label="Difficulty"
            name="difficulty"
            as="select"
            value={values.difficulty}
            onChange={onChange}
            error={errors.difficulty}
            options={DIFFICULTY_OPTIONS}
          />
        </>
      ) : (
        <>
          <TextField
            label="Category"
            name="subject"
            value={values.subject}
            onChange={onChange}
            error={errors.subject}
            placeholder="Update category label"
          />
          <TextField
            label="Status"
            name="status"
            as="select"
            value={values.status}
            onChange={onChange}
            error={errors.status}
            options={TOURNAMENT_STATUS_OPTIONS}
          />
          <TextField
            label="Total Questions"
            name="totalQuestions"
            type="number"
            min="1"
            value={values.totalQuestions}
            onChange={onChange}
            error={errors.totalQuestions}
          />
        </>
      )}

      <div className="row-between">
        <button className="button-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="button"
          type="submit"
          disabled={submitting}
          data-testid={mode === "create" ? "submit-create-tournament" : "submit-update-tournament"}
        >
          {submitting ? "Saving..." : mode === "create" ? "Create tournament" : "Update tournament"}
        </button>
      </div>
    </form>
  );
}
