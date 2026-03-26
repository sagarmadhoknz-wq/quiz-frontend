export default function AlertMessage({ type = "info", children }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}
