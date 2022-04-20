import { NextFunction, Request, Response } from 'express'

export default function validateSchema(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validation = schema.validate(req.body, { abortEarly: false })
        if (validation.error) {
            const errors = validation.error.details.map((v: any) => v.message)
            return res.status(422).send(errors)
        }
        next()
    }
}
