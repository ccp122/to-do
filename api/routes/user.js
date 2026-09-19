import express from 'express'
import { getAllUsers, registerUser, loginUser } from '../controllers/user.js'
import { apiLimiter, authLimiter } from '../middleware/rateLimiter.js'
import { protectRoute } from '../middleware/authMiddleware.js'

const userRouter = express.Router()

userRouter.get('/', apiLimiter, protectRoute, getAllUsers)
userRouter.post('/register', authLimiter, registerUser)
userRouter.post('/login', authLimiter, loginUser)

export default userRouter