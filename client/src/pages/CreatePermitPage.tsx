import { useState } from 'react'
import { createPermit, updatePermitStatus, type Permit } from '../api/permitsApi'
import PermitForm, { type PermitFormValues } from '../components/PermitForm'

function CreatePermitPage() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false)
  const [createdPermit, setCreatedPermit] = useState<Permit | null>(null)

  async function handlePermitDraftSubmit(values: PermitFormValues) {
    setSubmitError(null)
    setStatusError(null)
    try {
      const permit = await createPermit(values)
      setCreatedPermit(permit)
      console.log('Created permit', permit)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit permit'
      setSubmitError(message)
      throw error
    }
  }

  async function handleSubmitApplication() {
    if (!createdPermit || createdPermit.status !== 'draft' || isSubmittingApplication) return

    setStatusError(null)
    setIsSubmittingApplication(true)
    try {
      const updatedPermit = await updatePermitStatus(createdPermit.id, 'submitted')
      setCreatedPermit(updatedPermit)
      console.log('Submitted permit', updatedPermit)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit application'
      setStatusError(message)
    } finally {
      setIsSubmittingApplication(false)
    }
  }

  return (
    <main className="app-shell">
      <h1>Submit Permit Application</h1>
      <p className="page-intro">Fill out the form below to start a permit request.</p>
      {submitError ? <p className="form-error">{submitError}</p> : null}
      {statusError ? <p className="form-error">{statusError}</p> : null}
      {createdPermit ? (
        <div className="permit-status-card">
          <p className="form-success">
            Permit {createdPermit.id} is currently <strong>{createdPermit.status}</strong>.
          </p>
          {createdPermit.status === 'draft' ? (
            <button
              type="button"
              className="secondary-action"
              disabled={isSubmittingApplication}
              onClick={handleSubmitApplication}
            >
              {isSubmittingApplication ? 'Submitting...' : 'Submit Application'}
            </button>
          ) : null}
        </div>
      ) : null}
      <PermitForm onSubmit={handlePermitDraftSubmit} />
    </main>
  )
}

export default CreatePermitPage
