import { Router } from 'express'

import * as testController from '../controllers/testController.js'
import validateToken from '../middlewares/validateTokenMiddleware.js'

const testRouter = Router()

testRouter.get('/tests/terms', validateToken, testController.getTerms)
// testRouter.get(
//     '/tests/terms/:termId/disciplines',
//     validateToken,
//     testController.getDisciplines
// )
testRouter.get(
    '/tests/disciplines/:disciId',
    validateToken,
    testController.getTests
)

export default testRouter
