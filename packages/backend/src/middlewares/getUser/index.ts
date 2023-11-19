import { Request, Response, NextFunction } from 'express'
import User from '../../models/user'

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.headers
  const user = await User.findOne({ id })
  if (user) {
    //@ts-ignore
    req.user = user
  }
  return next()
}

export default getUser
