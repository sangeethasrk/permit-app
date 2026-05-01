type FormTextAreaProps = {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  rows?: number
  required?: boolean
  disabled?: boolean
}

function FormTextArea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  required = false,
  disabled = false,
}: FormTextAreaProps) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <textarea
        name={name}
        value={value}
        rows={rows}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export default FormTextArea
