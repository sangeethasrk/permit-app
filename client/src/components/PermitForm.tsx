import { useState } from 'react'
import { PERMIT_TYPES, type PermitType } from '../types/permit'
import FormSelect from './FormSelect'
import FormTextArea from './FormTextArea'
import FormTextInput from './FormTextInput'

export type PermitFormValues = {
  name: string
  address: string
  permitType: PermitType
  description: string
}

type PermitFormState = Omit<PermitFormValues, 'permitType'> & {
  permitType: PermitType | ''
}

type PermitFormProps = {
  onSubmit: (values: PermitFormValues) => Promise<void> | void
}

const initialFormState: PermitFormState = {
  name: '',
  address: '',
  permitType: '',
  description: '',
}

function PermitForm({ onSubmit }: PermitFormProps) {
  const [form, setForm] = useState<PermitFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setField<K extends keyof PermitFormState>(field: K, value: PermitFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isValid = Boolean(
    form.name.trim() &&
      form.address.trim() &&
      form.permitType.trim() &&
      form.description.trim(),
  )

  return (
    <form
      className="permit-form"
      onSubmit={async (event) => {
        event.preventDefault()
        if (!isValid || isSubmitting) return

        setIsSubmitting(true)
        try {
          if (!form.permitType) return
          await onSubmit({
            ...form,
            name: form.name.trim(),
            address: form.address.trim(),
            permitType: form.permitType,
            description: form.description.trim(),
          })
          setForm(initialFormState)
        } finally {
          setIsSubmitting(false)
        }
      }}
    >
      <FormTextInput
        label="Name"
        name="name"
        value={form.name}
        required
        disabled={isSubmitting}
        onChange={(value) => setField('name', value)}
      />

      <FormTextInput
        label="Address"
        name="address"
        value={form.address}
        required
        disabled={isSubmitting}
        onChange={(value) => setField('address', value)}
      />

      <FormSelect
        label="Permit Type"
        name="permitType"
        value={form.permitType}
        options={PERMIT_TYPES}
        placeholder="Select permit type"
        required
        disabled={isSubmitting}
        onChange={(value) => setField('permitType', value as PermitType | '')}
      />

      <FormTextArea
        label="Description"
        name="description"
        value={form.description}
        required
        rows={4}
        disabled={isSubmitting}
        onChange={(value) => setField('description', value)}
      />

      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Draft'}
      </button>
    </form>
  )
}

export default PermitForm
