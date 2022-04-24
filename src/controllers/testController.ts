import { Request, Response } from 'express'

import * as testService from '../services/testService.js'

export async function getTerms(req: Request, res: Response) {
    const terms = await testService.getTerms()
    res.send(terms)
}

export async function getByTeacher(req: Request, res: Response) {
    const teachers = await testService.getByTeacher()

    res.send(teachers)
}

export async function getTests(req: Request, res: Response) {
    const disciId = parseInt(req.params.disciId)
    validateId(disciId)

    const tests = await testService.getTests(disciId)

    res.send(tests)
}

function validateId(id: number) {
    if (id < 1 || isNaN(id)) {
        throw { type: 'user', message: 'invalid id', status: 422 }
    }
}
