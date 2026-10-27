export default function NumberField({
  field,
  values,
  errors,
  onChange,
}) {
  return (
    <div className="col-md-4">
      <label htmlFor={field.name} className="form-label fw-semibold">{field.label}</label>

      <input
        id={field.name}
        name={field.name}
        type="number"
        className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
        min="1"
        max={field.max}
        step="1"
        value={values[field.name]}
        onChange={onChange}
      />

      {errors[field.name] && (
        <div className="invalid-feedback">{errors[field.name]}</div>
      )}
    </div>
  );
}
