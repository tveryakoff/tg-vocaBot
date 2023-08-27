import { Request, Response, NextFunction } from 'express'
import { getUserTgIdHashFromToken } from '../../utils/auth'
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
const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next()
  }
  const jwtToken = getBearerTokenFromHeader(req.headers.authorization || '')
  if (!jwtToken) {
    return next()
  }
  const tgIdHash = getUserTgIdHashFromToken(jwtToken)
  const user = await User.findOne({ tgIdHash })
  if (user) {
    //@ts-ignore
    req.user = user
  }
  return next()
}

export default auth
