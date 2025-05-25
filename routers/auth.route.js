import express from "express"
import { AuthController } from "../controllers/auth.controller.js"
import { body } from "express-validator"
import authMiddleware from "../middlewares/auth.middleware.js"
const authRouter = express.Router()

authRouter.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 30}),
  AuthController.register
)
authRouter.get('/activation/:id', AuthController.activation)
authRouter.post('/login', AuthController.login)
authRouter.post('/logout', AuthController.logout)
authRouter.get('/refresh', AuthController.refresh)
authRouter.get('/get-users', authMiddleware, AuthController.getuser)


export {authRouter}