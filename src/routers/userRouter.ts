import { Router } from 'express'

import validateSchema from '../middlewares/validateSchemaMiddleware.js'
import { registerSchema } from '../schemas/userSchema.js'
import * as userController from '../controllers/userController.js'

const userRouter = Router()

userRouter.post(
    '/register',
    validateSchema(registerSchema),
    userController.createUser
)
userRouter.post('/login', validateSchema(registerSchema), userController.login)
userRouter.post('/login/github', userController.loginGithub)

export default userRouter
