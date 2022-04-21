import joi from 'joi'
import { User } from '@prisma/client'

export type CreateUser = Omit<User, 'id'>

const registerSchema = joi.object<CreateUser>({
    password: joi.string().required(),
    email: joi.string().email().required(),
})

export { registerSchema }
