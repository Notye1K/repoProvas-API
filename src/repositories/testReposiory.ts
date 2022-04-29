import client from '../database.js'

export async function findTerms() {
    return await client.term.findMany({
        include: {
            disciplines: {
                include: {
                    teacherDiscipline: {
                        include: {
                            test: {
                                include: {
                                    category: true,
                                },
                            },
                            teacher: true,
                        },
                    },
                },
            },
        },
    })
}

export async function findTeachers() {
    return await client.teacher.findMany()
}

export async function findCategories() {
    return await client.category.findMany({
        include: {
            tests: {
                include: {
                    teacherDiscipline: {
                        include: {
                            teacher: true,
                            discipline: true,
                        },
                    },
                },
            },
        },
    })
}

export interface Test {
    categoryName: string
    id: number
    name: string
    pdfUrl: string
    categoryId: number
    teacherDisciplineId: number
    createdAt: string
    teacherName: number
}

export async function findTests(disciId: number): Promise<Test[]> {
    return await client.$queryRaw`SELECT c.name as "categoryName", t.*, te.name as "teacherName" FROM categories c
    JOIN tests t ON c.id=t."categoryId"
    JOIN "teachersDisciplines" td ON t."teacherDisciplineId"=td.id
    JOIN teachers te ON te.id=td."teacherId"
    WHERE td."disciplineId"=${disciId}
    `
}

export async function incView(testId: number) {
    await client.test.update({
        where: { id: testId },
        data: {
            views: {
                increment: 1,
            },
        },
    })
}
