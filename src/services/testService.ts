import * as testReposiory from '../repositories/testReposiory.js'

export async function getTerms() {
    return await testReposiory.findTerms()
}

// export async function getDisciplines(termId: number) {
//     return await testReposiory.findDisciplines(termId)
// }

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
