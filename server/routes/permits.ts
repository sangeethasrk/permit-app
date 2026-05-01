import { Router } from 'express'
import {
  createPermit,
  getPermitById,
  listPermits,
  updatePermitStatus,
} from '../models/permitDbModel.js'
import {
  isValidPermitStatus,
  normalizePermitType,
  VALID_PERMIT_STATUSES,
  VALID_PERMIT_TYPES,
  validateRequiredPermitFields,
  type PermitStatus,
  type PermitInput,
} from '../models/permitModel.js'

const permitsRouter = Router()

permitsRouter.get('/', (req, res) => {
  const statusQuery = req.query.status
  const permitTypeQuery = req.query.permitType

  if (statusQuery !== undefined && typeof statusQuery !== 'string') {
    return res.status(400).json({ message: 'status must be a string' })
  }

  if (permitTypeQuery !== undefined && typeof permitTypeQuery !== 'string') {
    return res.status(400).json({ message: 'permitType must be a string' })
  }

  if (statusQuery && !isValidPermitStatus(statusQuery)) {
    return res.status(400).json({
      message: 'Invalid status filter',
      allowed: VALID_PERMIT_STATUSES,
    })
  }

  const normalizedPermitType = permitTypeQuery ? normalizePermitType(permitTypeQuery) : undefined
  if (permitTypeQuery && !normalizedPermitType) {
    return res.status(400).json({
      message: 'Invalid permitType filter',
      allowed: VALID_PERMIT_TYPES,
    })
  }

  listPermits({
    status: statusQuery as PermitStatus | undefined,
    permitType: normalizedPermitType,
  })
    .then((permits) => res.json({ data: permits }))
    .catch((error: unknown) => {
      console.error('Failed to load permits', error)
      return res.status(500).json({ message: 'Failed to load permits' })
    })
})

permitsRouter.post('/', (req, res) => {
  const body = req.body as Partial<PermitInput>
  const validationErrors = validateRequiredPermitFields(body)

  if (validationErrors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationErrors,
    })
  }

  const normalizedPermitType = body.permitType ? normalizePermitType(body.permitType) : undefined
  if (!normalizedPermitType) {
    return res.status(400).json({
      message: 'Invalid permitType',
      allowed: VALID_PERMIT_TYPES,
    })
  }

  createPermit({
    name: body.name!.trim(),
    address: body.address!.trim(),
    permitType: normalizedPermitType,
    description: body.description!.trim(),
  })
    .then((permit) => res.status(201).json({ data: permit }))
    .catch((error: unknown) => {
      console.error('Failed to create permit', error)
      return res.status(500).json({ message: 'Failed to create permit' })
    })
})

permitsRouter.patch('/:id/status', (req, res) => {
  const { id } = req.params
  const status = req.body?.status

  if (typeof status !== 'string') {
    return res.status(400).json({ message: 'status is required and must be a string' })
  }

  const normalizedStatus = status.trim() as PermitStatus
  if (!isValidPermitStatus(normalizedStatus)) {
    return res.status(400).json({
      message: 'Invalid status',
      allowed: VALID_PERMIT_STATUSES,
    })
  }

  getPermitById(id)
    .then((existingPermit) => {
      if (!existingPermit) {
        return res.status(404).json({ message: `Permit not found: ${id}` })
      }

      return updatePermitStatus(id, normalizedStatus)
        .then((updatedPermit) => res.json({ data: updatedPermit }))
        .catch((error: unknown) => {
          if (error instanceof Error && error.message.startsWith('Invalid status transition')) {
            return res.status(400).json({ message: error.message })
          }

          console.error('Failed to update permit status', error)
          return res.status(500).json({ message: 'Failed to update permit status' })
        })
    })
    .catch((error: unknown) => {
      console.error('Failed to fetch permit for status update', error)
      return res.status(500).json({ message: 'Failed to update permit status' })
    })
})

export default permitsRouter
