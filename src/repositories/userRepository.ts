import { CreateUser } from '../schemas/userSchema.js'
import client from '../database.js'

export async function findOne(email: string) {
    return await client.user.findUnique({
        where: { email },
    })
}

export async function create(body: CreateUser) {
    await client.user.create({
        data: { ...body },
    })
}

export async function findByToken(token: { id: number; email: string }) {
    return await client.user.findFirst({
        where: { ...token },
    })
}
