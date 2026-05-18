function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5)
}

function pickQuestions(questions, count = 5, categoryId) {
  const pool = categoryId ? questions.filter((item) => item.categoryId === categoryId) : questions
  return shuffle(pool).slice(0, count)
}

function pickDailyQuestions(questions, count = 5) {
  const grouped = questions.reduce((result, item) => {
    if (!result[item.categoryId]) result[item.categoryId] = []
    result[item.categoryId].push(item)
    return result
  }, {})
  const categoryIds = shuffle(Object.keys(grouped))
  const selected = categoryIds
    .map((categoryId) => shuffle(grouped[categoryId])[0])
    .filter(Boolean)
    .slice(0, count)

  if (selected.length >= count) return shuffle(selected)

  const selectedIds = new Set(selected.map((item) => item.id))
  const rest = shuffle(questions.filter((item) => !selectedIds.has(item.id))).slice(0, count - selected.length)
  return shuffle([...selected, ...rest])
}

function getAccuracy(correct, total) {
  if (!total) return 0
  return Math.round((correct / total) * 100)
}

module.exports = {
  pickQuestions,
  pickDailyQuestions,
  getAccuracy,
}
