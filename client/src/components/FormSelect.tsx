type FormSelectProps = {
  label: string
  name: string
  value: string
  options: readonly string[]
  placeholder?: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
}

function FormSelect({
  label,
  name,
  value,
  options,
  placeholder = 'Select an option',
  onChange,
  required = false,
  disabled = false,
}: FormSelectProps) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <select
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default FormSelect
