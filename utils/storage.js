const KEYS = {
  records: 'ai_quiz_records',
  wrongQuestions: 'ai_wrong_questions',
  favorites: 'ai_favorites',
}

function getList(key) {
  return wx.getStorageSync(key) || []
}

function setList(key, value) {
  wx.setStorageSync(key, value)
}

function saveQuizRecord(record) {
  const records = getQuizRecords()
  records.unshift(record)
  setList(KEYS.records, records)
}

function getQuizRecords() {
  return getList(KEYS.records)
}

function saveWrongQuestion(item) {
  const list = getWrongQuestions().filter((wrong) => wrong.questionId !== item.questionId)
  list.unshift(item)
  setList(KEYS.wrongQuestions, list)
}

function getWrongQuestions() {
  return getList(KEYS.wrongQuestions)
}

function removeWrongQuestion(questionId) {
  const list = getWrongQuestions().filter((item) => item.questionId !== questionId)
  setList(KEYS.wrongQuestions, list)
}

function saveFavorite(item) {
  const favoriteItem = typeof item === 'string' ? { questionId: item, favoritedAt: new Date().toISOString() } : item
  const list = getFavorites().filter((favorite) => favorite.questionId !== favoriteItem.questionId)
  list.unshift(favoriteItem)
  setList(KEYS.favorites, list)
}

function getFavorites() {
  return getList(KEYS.favorites)
}

function removeFavorite(questionId) {
  const list = getFavorites().filter((item) => item.questionId !== questionId)
  setList(KEYS.favorites, list)
}

module.exports = {
  saveQuizRecord,
  getQuizRecords,
  saveWrongQuestion,
  getWrongQuestions,
  removeWrongQuestion,
  saveFavorite,
  getFavorites,
  removeFavorite,
}
