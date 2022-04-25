import bcrypt from 'bcrypt'

import { CreateUser } from '../schemas/userSchema.js'
import * as userRepository from '../repositories/userRepository.js'

export async function create(body: CreateUser) {
    await validateEmail(body.email)
    changePassword(body)
    await userRepository.create(body)
}

export async function login(body: CreateUser) {
    const user = await findEmail(body.email)
    validatePassword(user.password, body.password)
    return user
}

export async function find(token: { id: number; email: string }) {
    return await userRepository.findByToken(token)
}

export async function loginGit(email: string) {
    const user = await validateEmailGit(email)
    if (user) {
        return user
    }
    await userRepository.create({ email, password: 'git' })

    return await findEmail(email)
}

async function validateEmail(email: string) {
    const user = await userRepository.findOne(email)
    if (user) {
        throw { type: 'user', status: 409, message: 'email already exist' }
    }
}

async function validateEmailGit(email: string) {
    const user = await userRepository.findOne(email)
    if (user) {
        return user
    }
    return false
}

function changePassword(body: CreateUser) {
    body.password = bcrypt.hashSync(body.password, 8)
}

async function findEmail(email: string) {
    const user = await userRepository.findOne(email)
    if (!user) {
        throw { type: 'user', status: 404, message: 'email do not exist' }
    }
    return user
}

function validatePassword(userPassword: string, bodyPassword: string) {
    const isSamePassword = bcrypt.compareSync(bodyPassword, userPassword)
    if (!isSamePassword) {
        throw { type: 'user', status: 401, message: 'wrong password' }
    }
}
