import axios from 'axios'
import dotenv from 'dotenv'
import { signature } from '../auth/generateSignature'

dotenv.config()

const instance = axios.create({
  baseURL: `${process.env.BACKEND_URL}/api`,
  headers: {
    signature: signature.toString('base64'),
  },
})

export default instance
