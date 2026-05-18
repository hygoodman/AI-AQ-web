const { categories } = require('../../data/categories')
const { getQuizRecords, getWrongQuestions } = require('../../utils/storage')
const { formatDate } = require('../../utils/date')

function countStudyStreak(records) {
  const dates = Array.from(new Set(records.map((item) => item.date))).sort().reverse()
  if (!dates.length) return 0

  let streak = 0
  const cursor = new Date(`${formatDate()}T00:00:00`)
  const dateSet = new Set(dates)

  while (dateSet.has(formatDate(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

Page({
  data: {
    categories,
    dailyStatus: '5 道题 · 预计 2 分钟完成',
    dailyButtonText: '开始今日答题',
    stats: [
      { label: '已答题', value: '0' },
      { label: '正确率', value: '0%' },
      { label: '连续学习', value: '0天' },
      { label: '错题数', value: '0' },
    ],
  },

  onShow() {
    this.refreshStats()
  },

  refreshStats() {
    const records = getQuizRecords()
    const wrongQuestions = getWrongQuestions()
    const today = formatDate()
    const todayDailyRecord = records.find((item) => item.date === today && item.quizType === 'daily')
    const total = records.reduce((sum, item) => sum + (item.total || 0), 0)
    const correct = records.reduce((sum, item) => sum + (item.correct || 0), 0)
    const accuracy = total ? Math.round((correct / total) * 100) : 0
    const streak = countStudyStreak(records)

    this.setData({
      dailyStatus: todayDailyRecord
        ? `今日已完成 · 正确率 ${todayDailyRecord.accuracy}%`
        : '5 道题 · 预计 2 分钟完成',
      dailyButtonText: todayDailyRecord ? '再练一组' : '开始今日答题',
      stats: [
        { label: '已答题', value: String(total) },
        { label: '正确率', value: `${accuracy}%` },
        { label: '连续学习', value: `${streak}天` },
        { label: '错题数', value: String(wrongQuestions.length) },
      ],
    })
  },

  startDailyQuiz() {
    wx.navigateTo({
      url: '/pages/quiz/quiz?type=daily',
    })
  },

  handleCategorySelect(event) {
    const { id } = event.detail
    wx.navigateTo({
      url: `/pages/quiz/quiz?categoryId=${id}`,
    })
  },

  goCategories() {
    wx.navigateTo({
      url: '/pages/categories/categories',
    })
  },

  goWrongbook() {
    wx.navigateTo({
      url: '/pages/wrongbook/wrongbook',
    })
  },

  goProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile',
    })
  },
})
