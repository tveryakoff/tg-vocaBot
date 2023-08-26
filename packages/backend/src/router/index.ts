import userController from '../controllers/user'
import express from 'express'

const router = express.Router()

router.use('/user', userController)

export default router
