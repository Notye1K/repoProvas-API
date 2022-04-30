import { Router } from 'express'

import * as testController from '../controllers/testController.js'
import validateSchema from '../middlewares/validateSchemaMiddleware.js'
import validateToken from '../middlewares/validateTokenMiddleware.js'
import { testSchema } from '../schemas/testSchema.js'

const testRouter = Router()

testRouter.get('/tests/terms', validateToken, testController.getTerms)
testRouter.get('/tests/teachers', validateToken, testController.getByTeacher)
testRouter.get(
    '/tests/disciplines/:disciId',
    validateToken,
    testController.getTests
)
testRouter.patch('/tests/:testId', validateToken, testController.incView)
testRouter.get('/tests/categories', validateToken, testController.getCategories)
testRouter.get(
    '/tests/disciplines',
    validateToken,
    testController.getDisciplines
)
testRouter.get(
    '/tests/teachers/:disciId',
    validateToken,
    testController.getTeachersByDiscipline
)
testRouter.post(
    '/tests',
    validateToken,
    validateSchema(testSchema),
    testController.createTest
)

export default testRouter
