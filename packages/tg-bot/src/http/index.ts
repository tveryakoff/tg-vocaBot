import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const instance = axios.create({
  baseURL: `${process.env.BACKEND_URL}/api`,
})

export default instance
