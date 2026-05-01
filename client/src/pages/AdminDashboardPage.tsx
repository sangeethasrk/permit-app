import { useEffect, useState } from 'react'
import { getPermits, updatePermitStatus, type Permit } from '../api/permitsApi'
import { PERMIT_TYPES, type PermitType } from '../types/permit'

function AdminDashboardPage() {
  const [permits, setPermits] = useState<Permit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [updatingPermitId, setUpdatingPermitId] = useState<string | null>(null)
  const [selectedPermitType, setSelectedPermitType] = useState<PermitType | ''>('')

  async function loadPermits() {
    setLoadError(null)
    setIsLoading(true)
    try {
      const data = await getPermits({
        permitType: selectedPermitType || undefined,
      })
      setPermits(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load permits'
      setLoadError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPermits()
  }, [selectedPermitType])

  async function handleStatusAction(permitId: string, status: 'approved' | 'rejected') {
    if (updatingPermitId) return

    setActionError(null)
    setUpdatingPermitId(permitId)
    try {
      await updatePermitStatus(permitId, status)
      await loadPermits()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update permit'
      setActionError(message)
    } finally {
      setUpdatingPermitId(null)
    }
  }

  return (
    <main className="app-shell">
      <h1>Admin Dashboard</h1>
      <p className="page-intro">Review submitted permits and make approval decisions.</p>
      <label className="filter-field">
        <span>Filter by permit type</span>
        <select
          value={selectedPermitType}
          onChange={(event) => setSelectedPermitType(event.target.value as PermitType | '')}
        >
          <option value="">All types</option>
          {PERMIT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      {loadError ? <p className="form-error">{loadError}</p> : null}
      {actionError ? <p className="form-error">{actionError}</p> : null}

      {isLoading ? <p>Loading permits...</p> : null}

      {!isLoading && permits.length === 0 ? <p>No permits found.</p> : null}

      {!isLoading && permits.length > 0 ? (
        <div className="permit-list">
          {permits.map((permit) => {
            const canReview = permit.status === 'submitted'
            const isUpdatingCurrent = updatingPermitId === permit.id

            return (
              <article key={permit.id} className="permit-row">
                <div>
                  <p className="permit-name">{permit.name}</p>
                  <p className="permit-meta">
                    {permit.permitType} · <span className="status">{permit.status}</span>
                  </p>
                </div>

                {canReview ? (
                  <div className="permit-actions">
                    <button
                      type="button"
                      className="secondary-action"
                      disabled={isUpdatingCurrent}
                      onClick={() => handleStatusAction(permit.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="danger-action"
                      disabled={isUpdatingCurrent}
                      onClick={() => handleStatusAction(permit.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <p className="readonly-state">No action</p>
                )}
              </article>
            )
          })}
        </div>
      ) : null}
    </main>
  )
}

export default AdminDashboardPage
