import { Request, Response } from 'express'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

import { CreateUser } from '../schemas/userSchema.js'
import * as userService from '../services/userService.js'

export async function createUser(req: Request, res: Response) {
    const body: CreateUser = req.body

    await userService.create(body)

    res.sendStatus(201)
}

export async function login(req: Request, res: Response) {
    const body: CreateUser = req.body

    const user = await userService.login(body)

    const token = createToken(user)

    res.send(token)
}


function createToken(user: User) {
    delete user.password
    const data = user
    const secretKey = process.env.JWT_SECRET
    const token = jwt.sign(data, secretKey)
    return token
}
