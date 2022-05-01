import client from '../src/database.js'

async function main() {
    const { id: category } = await client.category.upsert({
        where: { name: 'p1' },
        update: {},
        create: {
            name: 'p1',
        },
        select: { id: true },
    })

    const { id: term } = await client.term.upsert({
        where: { number: 1 },
        update: {},
        create: { number: 1 },
        select: { id: true },
    })

    const { id: discipline } = await client.discipline.upsert({
        where: { name: 'css' },
        update: {},
        create: { name: 'css', termId: term },
        select: { id: true },
    })

    const { id: teacher } = await client.teacher.upsert({
        where: { name: 'Dina' },
        update: {},
        create: {
            name: 'Dina',
        },
        select: { id: true },
    })

    await client.teacherDiscipline.upsert({
        where: { id: 1 },
        update: {},
        create: { disciplineId: discipline, teacherId: teacher },
    })
}

main()
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })
    .finally(async () => {
        await client.$disconnect()
    })
