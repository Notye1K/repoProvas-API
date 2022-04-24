import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import * as userService from '../services/userService.js'

interface TokenData {
    id: number
    email: string
    iat: number
}

export default async function validateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
        return res.status(401).send('Missing token')
    }

    try {
        const user = await getUser(token)

        if (!user) {
            return res.status(401).send('Invalid token')
        }

        res.locals.user = user
    } catch {
        return res.status(401).send('Invalid token')
    }

    next()
}

async function getUser(token: string) {
    const secretKey = process.env.JWT_SECRET
    const tokenData = jwt.verify(token, secretKey) as TokenData
    delete tokenData.iat
    const user = await userService.find(tokenData)
    delete user.password
    return user
}
