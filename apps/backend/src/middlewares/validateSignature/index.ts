import { validateSignature } from '../../utils/auth'
import { RequestHandler } from 'express'

export const validateSignatureMiddleware: RequestHandler = (req, res, next) => {
  const signature = req.headers.signature
  if (!signature) {
    return res.status(401).json({ error: 'No signature presented' })
  }

  const isValid = validateSignature(signature as string)

  if (!isValid) {
    return res.status(401).json({ error: 'Signature is not valid' })
  }

  return next()
}
