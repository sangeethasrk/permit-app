import type { PermitFormValues } from '../components/PermitForm'
import type { PermitType } from '../types/permit'

export type Permit = PermitFormValues & {
  id: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

async function readApiData<T>(response: Response, fallbackMessage: string): Promise<T> {
  const payload = (await response.json()) as { data?: T; message?: string }
  if (!response.ok || payload.data === undefined) {
    throw new Error(payload.message ?? fallbackMessage)
  }

  return payload.data
}

export async function getPermits(params?: {
  status?: Permit['status']
  permitType?: PermitType
}): Promise<Permit[]> {
  const query = new URLSearchParams()
  if (params?.status) query.set('status', params.status)
  if (params?.permitType) query.set('permitType', params.permitType)

  const queryString = query.toString()
  const url = `${API_BASE_URL}/permits${queryString ? `?${queryString}` : ''}`
  const response = await fetch(url)
  return readApiData<Permit[]>(response, 'Failed to load permits')
}

export async function createPermit(values: PermitFormValues): Promise<Permit> {
  const response = await fetch(`${API_BASE_URL}/permits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })
  return readApiData<Permit>(response, 'Failed to create permit')
}

export async function updatePermitStatus(id: string, status: Permit['status']): Promise<Permit> {
  const response = await fetch(`${API_BASE_URL}/permits/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  return readApiData<Permit>(response, 'Failed to update permit status')
}
