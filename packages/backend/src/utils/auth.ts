import { User } from '../types/user'
import jsonwebtoken from 'jsonwebtoken'
import { JWT_SECRET } from '../constants/auth'

export const generateAuthJwtToken = (user: User, botApiKey: string) => {
  return jsonwebtoken.sign({ tgIdHash: user.tgIdHash, botApiKey }, JWT_SECRET, { expiresIn: '3h' })
}

export const isUserTokenValid = (jwtToken, user: User) => {
  try {
    const decoded = jsonwebtoken.verify(jwtToken, JWT_SECRET)
    return decoded.tgIdHash === user.tgIdHash && decoded.botApiKey === process.env.API_KEY_BOT
  } catch (error) {
    return false
  }
}

export const getUserTgIdHashFromToken = (jwtToken: string) => {
  try {
    const decoded = jsonwebtoken.verify(jwtToken, JWT_SECRET)
    return decoded.tgIdHash
  } catch (error) {
    return null
  }
}
