import express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import 'express-async-errors'

import handleErrorMiddleware from './middlewares/handleErrorMiddleware.js'
import router from './routers/index.js'

const app = express()

app.use(cors())
app.use(json())

app.use(router)
app.use(handleErrorMiddleware)

app.listen(process.env.PORT, () =>
    console.log('listening on port ' + process.env.PORT)
)
