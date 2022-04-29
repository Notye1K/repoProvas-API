import { Router } from 'express'

import * as testController from '../controllers/testController.js'
import validateToken from '../middlewares/validateTokenMiddleware.js'

const testRouter = Router()

testRouter.get('/tests/terms', validateToken, testController.getTerms)
testRouter.get('/tests/teachers', validateToken, testController.getByTeacher)
testRouter.get(
    '/tests/disciplines/:disciId',
    validateToken,
    testController.getTests
)
testRouter.patch('/tests/:testId', validateToken, testController.incView)

export default testRouter
