import { NextFunction, Request, Response } from 'express'

export default function handleErrorMiddleware(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error.type === 'user') {
        res.status(error.status).send(error.message)
    } else {
        console.log(error)
        res.sendStatus(500)
    }
}
