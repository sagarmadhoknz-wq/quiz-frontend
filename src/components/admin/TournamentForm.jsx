import TextField from "../common/TextField";
import {
  CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
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
        name="name"
        value={values.name}
        onChange={onChange}
        error={errors.name}
        placeholder="Enter name"
      />

      {mode === "create" ? (
        <>
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
          <TextField
            label="Start Date"
            name="startDate"
            type="datetime-local"
            value={values.startDate}
            onChange={onChange}
            error={errors.startDate}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="datetime-local"
            value={values.endDate}
            onChange={onChange}
            error={errors.endDate}
          />
          <TextField
            label="Minimum Passing Score"
            name="minPassingScore"
            type="number"
            min="1"
            max="100"
            value={values.minPassingScore}
            onChange={onChange}
            error={errors.minPassingScore}
          />
        </>
      ) : (
        <>
          <TextField
            label="Start Date"
            name="startDate"
            type="datetime-local"
            value={values.startDate}
            onChange={onChange}
            error={errors.startDate}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="datetime-local"
            value={values.endDate}
            onChange={onChange}
            error={errors.endDate}
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
