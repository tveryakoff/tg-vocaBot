import dictionaryController from '../controllers/dictionary'
import authController from '../controllers/auth'
import express from 'express'

const router = express.Router()

router.use('/dictionary', dictionaryController)
router.use('/auth', authController)

export default router
