import userController from '../controllers/user'
import authController from '../controllers/auth'
import express from 'express'
import isAuthentificated from "../middlewares/isAuthentificated";

const router = express.Router()

router.use('/user', isAuthentificated, userController)
router.use('/auth', authController)

export default router
