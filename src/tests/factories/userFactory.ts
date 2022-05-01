import supertest from 'supertest'
import app from '../../app'
import { faker } from '@faker-js/faker'

export async function createUser() {
    return await supertest(app)
        .post('/register')
        .send({
            ...body,
        })
}

export const body = {
    email: faker.internet.email(),
    password: faker.lorem.word(),
}
