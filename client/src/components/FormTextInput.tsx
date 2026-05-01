type FormTextInputProps = {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
}

function FormTextInput({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
}: FormTextInputProps) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export default FormTextInput
