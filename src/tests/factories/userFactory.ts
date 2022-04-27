import supertest from 'supertest'
import app from '../../app'

export async function createUser() {
    await supertest(app).post('/register').send({
        email: 'test@example.com',
        password: 'test',
    })
}
