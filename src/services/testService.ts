import * as testReposiory from '../repositories/testReposiory.js'
import { CreateTest } from '../schemas/testSchema.js'
import nodemailer from 'nodemailer'
import { findUsersMails } from '../repositories/userRepository.js'

export async function getTerms() {
    return await testReposiory.findTerms()
}

interface TeacherResult {
    id: number
    name: string
    categories: any[]
}

export async function getByTeacher() {
    const teachers = (await testReposiory.findTeachers()) as TeacherResult[]
    const categories = await testReposiory.findCategories()

    teachers.map((teacher) => {
        categories.map((category) => {
            category.tests.map((test) => {
                if (test.teacherDiscipline.teacher.name === teacher.name) {
                    if (!teacher.categories) {
                        teacher.categories = [
                            { name: category.name, tests: [{ ...test }] },
                        ]
                        return
                    }
                    const element = teacher.categories.find(
                        (cat) => cat.name === category.name
                    )
                    if (element) {
                        element.tests.push({ ...test })
                    } else {
                        teacher.categories.push({
                            name: category.name,
                            tests: [{ ...test }],
                        })
                    }
                }
            })
        })
    })

    return teachers
}

export async function getTests(disciId: number) {
    const tests = await testReposiory.findTests(disciId)
    const arr = []
    tests.map((test) => {
        if (arr.length === 0) {
            const { categoryName, ...rest } = test
            arr.push({ categoryName, tests: [rest] })
            return
        }
        let c = true
        arr.map((v) => {
            if (v.categoryName === test.categoryName) {
                const { categoryName, ...rest } = test
                v.tests.push(rest)
                c = false
            }
        })
        if (c) {
            const { categoryName, ...rest } = test
            arr.push({ categoryName, tests: [rest] })
        }
    })
    return arr
}

export async function incView(testId: number) {
    await testReposiory.incView(testId)
}

export async function getCategories() {
    return testReposiory.getCategories()
}

export async function getDisciplines() {
    return testReposiory.getDisciplines()
}

export async function getTeachersByDiscipline(disciId: number) {
    return testReposiory.getTeachersByDiscipline(disciId)
}

export async function createTest(body: CreateTest) {
    const teacherDiscipline = await testReposiory.findTeacherDiscipline(
        body.instructor,
        body.discipline
    )
    await testReposiory.createTest(body, teacherDiscipline.id)

    await sendEmail(body)
}


async function sendEmail(body: CreateTest) {
    const transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '5bcac34d2b98a0',
            pass: '660f4fb7f08f59',
        },
        pool: true,
        maxConnections: 1,
        rateDelta: 20000,
        rateLimit: 5,
    })

    const users = await findUsersMails()
    const teacher = await testReposiory.findTeacherById(body.instructor)
    const category = await testReposiory.findCategoryById(body.category)
    const discipline = await testReposiory.findDisciplineById(body.discipline)

    users.map((user) => {
        const message = {
            from: 'sender@server.com',
            to: user.email,
            subject: 'Uma nova prova foi criada',
            text: `A seguinte prova foi adicionadas: ${teacher.name} ${
                category.name
            } ${new Date().getFullYear()} - ${body.title} (${discipline.name})`,
            html: `<p>A seguinte prova foi adicionadas: ${teacher.name} ${
                category.name
            } ${new Date().getFullYear()} - ${body.title} (${
                discipline.name
            })</p>`,
        }
        transport.sendMail(message, (err) => {
            if (err) {
                console.error(err)
            }
        })
    })
}
