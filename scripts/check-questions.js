const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const questionsPath = path.join(rootDir, 'data', 'questions.js')
const categoriesPath = path.join(rootDir, 'data', 'categories.js')

const requiredFields = [
  'id',
  'categoryId',
  'categoryName',
  'difficulty',
  'type',
  'question',
  'options',
  'answer',
  'explanation',
  'workExample',
  'tags',
  'createdAt',
]

function readQuestions() {
  try {
    return require(questionsPath).questions
  } catch (error) {
    fail(`题库文件无法读取：${error.message}`)
  }
}

function readCategories() {
  try {
    return require(categoriesPath).categories
  } catch (error) {
    fail(`分类文件无法读取：${error.message}`)
  }
}

function fail(message) {
  console.error(`\n[FAIL] ${message}`)
  process.exit(1)
}

function addIssue(issues, question, message) {
  const id = question && question.id ? question.id : '未知题目'
  issues.push(`${id}: ${message}`)
}

function validateQuestion(question, index, categoryIds, seenIds, issues) {
  if (!question || typeof question !== 'object' || Array.isArray(question)) {
    issues.push(`第 ${index + 1} 项不是合法题目对象`)
    return
  }

  requiredFields.forEach((field) => {
    if (question[field] === undefined || question[field] === null || question[field] === '') {
      addIssue(issues, question, `缺少必填字段 ${field}`)
    }
  })

  if (question.id) {
    if (seenIds.has(question.id)) {
      addIssue(issues, question, '题目 id 重复')
    }
    seenIds.add(question.id)
  }

  if (question.categoryId && !categoryIds.has(question.categoryId)) {
    addIssue(issues, question, `categoryId 不存在于分类表：${question.categoryId}`)
  }

  if (question.type !== 'single') {
    addIssue(issues, question, `当前 MVP 只支持 single 单选题，实际为：${question.type}`)
  }

  if (!Array.isArray(question.options)) {
    addIssue(issues, question, 'options 必须是数组')
    return
  }

  if (question.options.length !== 4) {
    addIssue(issues, question, `options 应为 4 个选项，实际为 ${question.options.length}`)
  }

  const optionKeys = new Set()
  question.options.forEach((option, optionIndex) => {
    if (!option || typeof option !== 'object') {
      addIssue(issues, question, `第 ${optionIndex + 1} 个选项不是对象`)
      return
    }

    if (!option.key) addIssue(issues, question, `第 ${optionIndex + 1} 个选项缺少 key`)
    if (!option.text) addIssue(issues, question, `选项 ${option.key || optionIndex + 1} 缺少 text`)
    if (option.key) {
      if (optionKeys.has(option.key)) addIssue(issues, question, `选项 key 重复：${option.key}`)
      optionKeys.add(option.key)
    }
  })

  if (question.answer && !optionKeys.has(question.answer)) {
    addIssue(issues, question, `正确答案 ${question.answer} 不存在于选项 key 中`)
  }

  if (!Array.isArray(question.tags)) {
    addIssue(issues, question, 'tags 必须是数组')
  }
}

function main() {
  const questions = readQuestions()
  const categories = readCategories()

  if (!Array.isArray(questions)) fail('questions.js 必须导出 questions 数组')
  if (!Array.isArray(categories)) fail('categories.js 必须导出 categories 数组')

  const issues = []
  const seenIds = new Set()
  const categoryIds = new Set(categories.map((category) => category.id))
  const counts = categories.reduce((result, category) => {
    result[category.id] = {
      name: category.name,
      expected: category.questionCount,
      actual: 0,
    }
    return result
  }, {})

  questions.forEach((question, index) => {
    validateQuestion(question, index, categoryIds, seenIds, issues)
    if (question && counts[question.categoryId]) {
      counts[question.categoryId].actual += 1
    }
  })

  const unknownCategoryQuestions = questions.filter((question) => question && !categoryIds.has(question.categoryId))

  console.log('\n题库检查结果')
  console.log('----------------')
  console.log(`题目总数：${questions.length}`)
  console.log(`分类总数：${categories.length}`)
  console.log(`未知分类题目：${unknownCategoryQuestions.length}`)
  console.log('\n分类题量：')

  Object.entries(counts).forEach(([categoryId, info]) => {
    const status = info.expected === info.actual ? 'OK' : '注意'
    console.log(`- ${categoryId} / ${info.name}: ${info.actual} 题，分类标注 ${info.expected} 题 [${status}]`)
  })

  if (issues.length) {
    console.log('\n发现问题：')
    issues.forEach((issue) => console.log(`- ${issue}`))
    fail(`题库检查未通过，共 ${issues.length} 个问题`)
  }

  console.log('\n[OK] 题库检查通过，可以继续使用。')
}

main()
