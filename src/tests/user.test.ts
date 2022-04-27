import supertest from 'supertest'
import app from '../app'
import client from '../database'
import * as userFactory from './factories/userFactory'

const body = {
    email: 'test@example.com',
    password: 'test',
}

describe('POST /login', () => {
    beforeEach(async () => {
        await client.$queryRaw`TRUNCATE TABLE users`
        await client.$disconnect()
    })

    it('given a valid body it should return a token', async () => {
        await userFactory.createUser()

        const result = await supertest(app).post('/login').send(body)

        expect(typeof result.text).toBe('string')
        expect(result.statusCode).toBe(200)
    })

    it('given a invalid body it should return 422', async () => {
        const result = await supertest(app).post('/login').send({})

        expect(result.statusCode).toBe(422)
    })
})

describe('POST /register', () => {
    beforeEach(async () => {
        await client.$queryRaw`TRUNCATE TABLE users`
        await client.$disconnect()
    })

    it('given a valid body it should return 201', async () => {
        const result = await supertest(app).post('/register').send(body)

        expect(result.statusCode).toBe(201)
    })

    it('given a valid register prisma return not null', async () => {
        await userFactory.createUser()

        const result = await client.user.findUnique({
            where: { email: body.email },
        })
        expect(result).not.toBeNull()
    })

    it('given a invalid body it should return 422', async () => {
        const result = await supertest(app).post('/register').send({})

        expect(result.statusCode).toBe(422)
    })
})
