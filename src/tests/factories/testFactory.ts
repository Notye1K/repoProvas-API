import client from '../../database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body } from './userFactory'

export async function getToken() {
    const password = bcrypt.hashSync(body.password, 8)
    const user = await client.user.create({
        data: {
            email: body.email,
            password,
        },
        select: { id: true, email: true },
    })

    const data = user
    const secretKey = process.env.JWT_SECRET
    const token = jwt.sign(data, secretKey)
    return token
}

export async function createTest() {
    return await client.test.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'test1',
            pdfUrl: 'pdfurl',
            categoryId: 1,
            teacherDisciplineId: 1,
        },
        select: { id: true },
    })
}

export async function getTest(id: number) {
    return await client.test.findFirst({
        where: { id },
    })
}
