export default function ListInputField({ label, items, error, placeholder, multiline, onChange }) {
  const updateItem = (index, value) => onChange(items.map((item, i) => (i === index ? value : item)));
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));
  const InputTag = multiline ? 'textarea' : 'input';

  return (
    <fieldset className="mb-4">
      <legend className="fs-6 fw-semibold">{label}</legend>
      {items.map((item, index) => (
        <div className="d-flex align-items-start gap-2 mb-2" key={index}>
          <span className="text-body-secondary pt-2 flex-shrink-0" style={{ width: '1.5rem' }}>{index + 1}.</span>
          <InputTag
            className={`form-control ${error && !item.trim() ? 'is-invalid' : ''}`}
            value={item}
            rows={multiline ? 2 : undefined}
            placeholder={placeholder}
            onChange={(event) => updateItem(index, event.target.value)}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary flex-shrink-0 mt-1"
            onClick={() => removeItem(index)}
            disabled={items.length === 1}
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}
      {error && <div className="text-danger small mb-2">{error}</div>}
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onChange([...items, ''])}>
        + Add {multiline ? 'step' : 'ingredient'}
      </button>
    </fieldset>
  );
}
