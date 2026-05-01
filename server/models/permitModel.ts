export type PermitStatus = 'draft' | 'submitted' | 'approved' | 'rejected'
export const VALID_PERMIT_STATUSES: PermitStatus[] = [
  'draft',
  'submitted',
  'approved',
  'rejected',
]
export const VALID_PERMIT_TYPES = [
  'Electrical',
  'Paving',
  'Roofing',
  'Plumbing',
  'New Construction',
] as const
export type PermitType = (typeof VALID_PERMIT_TYPES)[number]

export interface PermitInput {
  name: string
  address: string
  permitType: PermitType
  description: string
}

export interface Permit extends PermitInput {
  id: string
  status: PermitStatus
  createdAt: string
  updatedAt: string
}

const allowedTransitions: Record<PermitStatus, PermitStatus[]> = {
  draft: ['submitted'],
  submitted: ['approved', 'rejected'],
  approved: [],
  rejected: [],
}

export function validateRequiredPermitFields(input: Partial<PermitInput>): string[] {
  const errors: string[] = []

  if (!input.name?.trim()) errors.push('name is required')
  if (!input.address?.trim()) errors.push('address is required')
  if (!input.permitType?.trim()) errors.push('permitType is required')
  if (!input.description?.trim()) errors.push('description is required')

  return errors
}

export function normalizePermitType(input: string): PermitType | undefined {
  const normalized = input.trim().toLowerCase()
  return VALID_PERMIT_TYPES.find((type) => type.toLowerCase() === normalized)
}

export function isValidPermitType(input: string): input is PermitType {
  return normalizePermitType(input) !== undefined
}

export function isValidPermitStatus(input: string): input is PermitStatus {
  return VALID_PERMIT_STATUSES.includes(input as PermitStatus)
}

export function canTransitionStatus(from: PermitStatus, to: PermitStatus): boolean {
  return allowedTransitions[from].includes(to)
}
