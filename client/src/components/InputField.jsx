export default function InputField({
  field,
  values,
  errors,
  onChange,
}) {
  return (
    <div className={field.name === 'title' ? 'col-12' : 'col-md-6'}>
      <label htmlFor={field.name} className="form-label fw-semibold">{field.label}</label>

      <input
        id={field.name}
        name={field.name}
        className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
        value={values[field.name]}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        onChange={onChange}
      />

      {errors[field.name] && (
        <div className="invalid-feedback">{errors[field.name]}</div>
      )}
    </div>
  );
}
