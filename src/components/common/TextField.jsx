export default function TextField({
  label,
  name,
  value,
  onChange,
  error,
  as = "input",
  options = [],
  ...props
}) {
  const Element = as === "textarea" ? "textarea" : as === "select" ? "select" : "input";
  const className =
    as === "textarea" ? "textarea" : as === "select" ? "select" : "input";

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Element id={name} name={name} value={value} onChange={onChange} className={className} {...props}>
        {as === "select"
          ? [
              <option key="" value="">
                Select an option
              </option>,
              ...options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )),
            ]
          : null}
      </Element>
      {error ? <div className="field-error">{error}</div> : null}
    </div>
  );
}
