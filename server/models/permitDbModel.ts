import { all, get, run } from '../db.js'
import { canTransitionStatus } from './permitModel.js'
import type { Permit, PermitInput, PermitStatus, PermitType } from './permitModel.js'

export async function createPermit(input: PermitInput): Promise<Permit> {
  const now = new Date().toISOString()
  const permitId = `permit-${Date.now()}`

  const permit: Permit = {
    id: permitId,
    name: input.name.trim(),
    address: input.address.trim(),
    permitType: input.permitType,
    description: input.description.trim(),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }

  await run(
    `
      INSERT INTO permits (id, name, address, permitType, description, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      permit.id,
      permit.name,
      permit.address,
      permit.permitType,
      permit.description,
      permit.status,
      permit.createdAt,
      permit.updatedAt,
    ],
  )

  const insertedPermit = await get<Permit>('SELECT * FROM permits WHERE id = ?', [permit.id])
  return insertedPermit ?? permit
}

type ListPermitFilters = {
  status?: PermitStatus
  permitType?: PermitType
}

export async function listPermits(filters: ListPermitFilters = {}): Promise<Permit[]> {
  const whereClauses: string[] = []
  const params: unknown[] = []

  if (filters.status) {
    whereClauses.push('status = ?')
    params.push(filters.status)
  }

  if (filters.permitType) {
    whereClauses.push('permitType = ?')
    params.push(filters.permitType)
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''
  const query = `
    SELECT id, name, address, permitType, description, status, createdAt, updatedAt
    FROM permits
    ${whereSql}
    ORDER BY createdAt DESC
  `

  return all<Permit>(query, params)
}

export async function getPermitById(id: string): Promise<Permit | undefined> {
  return get<Permit>('SELECT * FROM permits WHERE id = ?', [id])
}

export async function updatePermitStatus(
  id: string,
  nextStatus: PermitStatus,
): Promise<Permit | undefined> {
  const permit = await getPermitById(id)
  if (!permit) return undefined

  if (!canTransitionStatus(permit.status, nextStatus)) {
    throw new Error(`Invalid status transition: ${permit.status} -> ${nextStatus}`)
  }

  const updatedAt = new Date().toISOString()
  await run('UPDATE permits SET status = ?, updatedAt = ? WHERE id = ?', [nextStatus, updatedAt, id])
  return getPermitById(id)
}
