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

export async function incView(req: Request, res: Response) {
    const testId = parseInt(req.params.testId)
    validateId(testId)

    await testService.incView(testId)

    res.sendStatus(200)
}

export async function getCategories(req: Request, res: Response) {
    const categories = await testService.getCategories()

    res.send(categories)
}

export async function getDisciplines(req: Request, res: Response) {
    const disciplenes = await testService.getDisciplines()

    res.send(disciplenes)
}

export async function getTeachersByDiscipline(req: Request, res: Response) {
    const disciId = parseInt(req.params.disciId)
    validateId(disciId)

    const disciplenes = await testService.getTeachersByDiscipline(disciId)

    res.send(disciplenes)
}

export async function createTest(req: Request, res: Response) {
    await testService.createTest(req.body)
    res.sendStatus(201)
}

function validateId(id: number) {
    if (id < 1 || isNaN(id)) {
        throw { type: 'user', message: 'invalid id', status: 422 }
    }
}
