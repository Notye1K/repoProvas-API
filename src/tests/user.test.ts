import supertest from 'supertest'
import app from '../app'
import client from '../database'
import * as userFactory from './factories/userFactory'
import * as testFactory from './factories/testFactory'

beforeEach(async () => {
    await client.$queryRaw`TRUNCATE TABLE users`
    await client.$disconnect()
})

describe('POST /login', () => {
    it('given a valid body it should return a token', async () => {
        await userFactory.createUser()

        const result = await supertest(app)
            .post('/login')
            .send(userFactory.body)

        expect(typeof result.text).toBe('string')
        expect(result.statusCode).toBe(200)
    })

    it('given a invalid body it should return 422', async () => {
        const result = await supertest(app).post('/login').send({})

        expect(result.statusCode).toBe(422)
    })
})

describe('POST /register', () => {
    it('given a valid body it should return 201', async () => {
        const result = await supertest(app)
            .post('/register')
            .send(userFactory.body)

        expect(result.statusCode).toBe(201)
    })

    it('given a valid register prisma return not null', async () => {
        await userFactory.createUser()

        const result = await client.user.findUnique({
            where: { email: userFactory.body.email },
        })
        expect(result).not.toBeNull()
    })

    it('given a invalid body it should return 422', async () => {
        const result = await supertest(app).post('/register').send({})

        expect(result.statusCode).toBe(422)
    })
})

describe('PATCH /tests/:testId', () => {
    it('given a valid headers it should return 200', async () => {
        const token = await testFactory.getToken()

        const { id } = await testFactory.createTest()

        const { views: before } = await testFactory.getTest(id)

        const result = await supertest(app)
            .patch(`/tests/${id}`)
            .set('Authorization', `Bearer ${token}`)

        const { views: after } = await testFactory.getTest(id)

        expect(result.statusCode).toBe(200)
        expect(after).toBeGreaterThan(before)
    })

    it('given a invalid headers it should return 401', async () => {
        const { id } = await testFactory.createTest()

        const { views: before } = await testFactory.getTest(id)

        const result = await supertest(app)
            .patch(`/tests/${id}`)
            .set('Authorization', `Bearer sdhf`)

        const { views: after } = await testFactory.getTest(id)

        expect(result.statusCode).toBe(401)
        expect(after).toBe(before)
    })
})
