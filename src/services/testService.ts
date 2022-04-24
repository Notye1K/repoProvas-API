import { Discipline, Teacher, TeacherDiscipline, Test } from '@prisma/client'
import * as testReposiory from '../repositories/testReposiory.js'

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
