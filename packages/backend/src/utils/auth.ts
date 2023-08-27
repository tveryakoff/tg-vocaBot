import { User } from '../types/user'
import jsonwebtoken, {JwtPayload} from 'jsonwebtoken'
import { JWT_SECRET } from '../constants/auth'

export const generateAuthJwtToken = (user: User, botApiKey: string) => {
  return jsonwebtoken.sign({ tgId: user.tgId, botApiKey }, JWT_SECRET, { expiresIn: '3h' })
}

export const isUserTokenValid = (jwtToken: string, user: User) => {
  try {
    const decoded = jsonwebtoken.verify(jwtToken, JWT_SECRET) as JwtPayload
    return decoded.tgId === user.tgId && decoded.botApiKey === process.env.API_KEY_BOT
  } catch (error) {
    return false
  }
}

export const getUserTgIdHashFromToken = (jwtToken: string) => {
  try {
    const decoded = jsonwebtoken.verify(jwtToken, JWT_SECRET) as JwtPayload
    return decoded.tgId
  } catch (error) {
    return null
  }
}
