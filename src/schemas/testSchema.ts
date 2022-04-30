import joi from 'joi'

export interface CreateTest {
    title: string
    pdf: string
    category: number
    discipline: number
    instructor: number
}
const testSchema = joi.object<CreateTest>({
    title: joi.string().required(),
    pdf: joi.string().required(),
    category: joi.number().required(),
    discipline: joi.number().required(),
    instructor: joi.number().required(),
})

export { testSchema }
