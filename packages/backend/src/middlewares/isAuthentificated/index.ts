import { Request, Response, NextFunction } from 'express'
import { getUserTgIdFromToken } from '../../utils/auth'
import User from '../../models/user'

const getBearerTokenFromHeader = (authToken: string) => {
  if (!authToken) {
    return null
  }
  return authToken.split(' ')?.[1]
}

/**
 *
 * Authenticates user via header with jwt token and saves user from db into req object
 */
const isAuthentificated = async (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  if (!req.headers.authorization || req.user) {
    return next()
  }
  const jwtToken = getBearerTokenFromHeader(req.headers.authorization || '')
  if (!jwtToken) {
    return next()
  }
  const tgId = getUserTgIdFromToken(jwtToken)
  const user = await User.findOne({ tgId })
  if (user) {
    //@ts-ignore
    req.user = user
  }
  return next()
}

export default isAuthentificated
