import * as crypto from 'crypto'
import { PRIVATE_KEY, SECRET } from '../constants/auth'

export const signature = crypto.sign('sha256', Buffer.from(SECRET), {
  key: PRIVATE_KEY,
  padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
})
