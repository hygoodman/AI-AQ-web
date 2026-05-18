const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const { questions } = require(path.join(rootDir, 'data', 'questions.js'))
const { categories } = require(path.join(rootDir, 'data', 'categories.js'))

const outputDir = path.join(rootDir, 'src', 'generated')
const outputPath = path.join(outputDir, 'quiz-data.js')

fs.mkdirSync(outputDir, { recursive: true })

const file = `// This file is generated from data/questions.js and data/categories.js.
// Edit the source data files, then run npm run dev or npm run build.
export const categories = ${JSON.stringify(categories, null, 2)}

export const questions = ${JSON.stringify(questions, null, 2)}
`

fs.writeFileSync(outputPath, file)
console.log(`Generated ${path.relative(rootDir, outputPath)} with ${questions.length} questions.`)
