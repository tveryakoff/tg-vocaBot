import { Request, Response, NextFunction } from 'express'
import { getUserTgIdHashFromToken } from '../../utils/auth'
import User from 'packages/backend/src/models/user'

const getBearerTokenFromHeader = (authToken) => {
  return authToken.split(' ')[1]
}

/**
 *
 * Authenticates user via header with jwt token and saves user from db into req object
 */
const auth = (req: Request, res: Response, next: NextFunction): void => {
  const jwtToken = getBearerTokenFromHeader(req.headers.authorization)
  if (!jwtToken) {
    next()
  }
  const tgIdHash = getUserTgIdHashFromToken(jwtToken)
  const user = User.findOne({ tgIdHash })
  if (user) {
    req.user = user
  }
  next()
}

export default auth
