import { Request, Response } from 'express'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

import { CreateUser } from '../schemas/userSchema.js'
import * as userService from '../services/userService.js'
import axios from 'axios'

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

export async function loginGithub(req: Request, res: Response) {
    const code = req.body.code
    if (!code) {
        return res.sendStatus(422)
    }

    axios
        .post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: 'da6cca9191e6967a9724',
                client_secret: process.env.GITSECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        )
        .then((response) => {
            const accessToken = response.data.access_token

            axios
                .get('https://api.github.com/user', {
                    headers: { Authorization: `token ${accessToken}` },
                })
                .then(async (response) => {
                    let user
                    if (response.data.email) {
                        user = await userService.loginGit(response.data.email)
                    } else {
                        user = await userService.loginGit(response.data.login)
                    }

                    const token = createToken(user)

                    res.send(token)
                })
                .catch((error) => {
                    res.sendStatus(400)
                })
        })
        .catch((error) => {
            res.status(400).send(error.response.data.error_description)
        })
}

function createToken(user: User) {
    delete user.password
    const data = user
    const secretKey = process.env.JWT_SECRET
    const token = jwt.sign(data, secretKey)
    return token
}
