import { formatStatus } from "../../utils/formatters";

export default function StatusBadge({ status }) {
  const normalized = String(status ?? "").toUpperCase();
  const className =
    normalized === "ACTIVE"
      ? "status-badge status-active"
      : normalized === "DRAFT"
        ? "status-badge status-draft"
        : "status-badge status-inactive";

  return <span className={className}>{formatStatus(status)}</span>;
}
