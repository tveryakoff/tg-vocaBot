import userController from '../controllers/dictionary'
import authController from '../controllers/auth'
import express from 'express'

const router = express.Router()

router.use('/user', userController)
router.use('/auth', authController)

export default router
