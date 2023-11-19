// import { User } from '../types/user'
//
//
// export const generateAuthJwtToken = (user: User, botApiKey: string) => {
//   return jsonwebtoken.sign({ tgId: user.tgId, botApiKey }, JWT_SECRET, { expiresIn: '3h' })
// }
//
// export const isUserTokenValid = (jwtToken: string, user: User) => {
//   try {
//     const decoded = jsonwebtoken.verify(jwtToken, JWT_SECRET) as JwtPayload
//     return decoded.tgId === user.tgId && decoded.botApiKey === process.env.API_KEY_BOT
//   } catch (error) {
//     return false
//   }
// }
//
// export const getUserTgIdFromToken = (jwtToken: string) => {
//   try {
//     const decoded = jsonwebtoken.verify(jwtToken, JWT_SECRET) as JwtPayload
//     return decoded.tgId
//   } catch (error) {
//     return null
//   }
// }

import * as crypto from 'crypto'
import { PUBLIC_KEY, SECRET } from '../test/auth'

export const validateSignature = (signature: string) => {
  try {
    const isVerified = crypto.verify(
      'sha256',
      Buffer.from(SECRET, 'utf8'),
      {
        key: PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(signature, 'base64'),
    )

    return isVerified
  } catch (error) {
    console.log('error while validating signature', error)
  }
}
