export const PERMIT_TYPES = [
  'Electrical',
  'Paving',
  'Roofing',
  'Plumbing',
  'New Construction',
] as const

export type PermitType = (typeof PERMIT_TYPES)[number]
