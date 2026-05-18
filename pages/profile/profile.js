const { questions } = require('../../data/questions')
const { getFavorites, getQuizRecords, removeFavorite } = require('../../utils/storage')

Page({
  data: {
    records: [],
    favorites: [],
  },

  onShow() {
    this.refreshProfile()
  },

  refreshProfile() {
    const favorites = getFavorites()
      .map((item) => {
        const question = questions.find((questionItem) => questionItem.id === item.questionId)
        return question
          ? {
              ...item,
              question,
            }
          : null
      })
      .filter(Boolean)

    this.setData({
      records: getQuizRecords().map((item) => ({
        ...item,
        displayName: item.categoryName || (item.quizType === 'daily' ? '今日快问快答' : '分类练习'),
      })),
      favorites,
    })
  },

  removeFavoriteItem(event) {
    const { id } = event.currentTarget.dataset
    removeFavorite(id)
    wx.showToast({ title: '已取消收藏', icon: 'none' })
    this.refreshProfile()
  },
})
