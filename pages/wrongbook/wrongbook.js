const { categories } = require('../../data/categories')
const { questions } = require('../../data/questions')
const { getWrongQuestions, removeWrongQuestion } = require('../../utils/storage')

Page({
  data: {
    allWrongItems: [],
    wrongItems: [],
    filters: [],
    activeCategoryId: 'all',
  },

  onShow() {
    this.refreshWrongbook()
  },

  refreshWrongbook() {
    const allWrongItems = getWrongQuestions()
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
    const hasActiveCategory =
      this.data.activeCategoryId === 'all' ||
      allWrongItems.some((item) => item.categoryId === this.data.activeCategoryId)
    const nextCategoryId = hasActiveCategory ? this.data.activeCategoryId : 'all'

    this.setData({
      allWrongItems,
    })
    this.applyFilter(nextCategoryId)
  },

  applyFilter(categoryId) {
    const allWrongItems = this.data.allWrongItems
    const wrongItems =
      categoryId === 'all'
        ? allWrongItems
        : allWrongItems.filter((item) => item.categoryId === categoryId)
    const filters = [
      {
        id: 'all',
          name: '全部',
          count: allWrongItems.length,
          active: categoryId === 'all',
          className: categoryId === 'all' ? 'filter-chip active' : 'filter-chip',
        },
      ...categories
        .map((category) => ({
          id: category.id,
          name: category.name,
          count: allWrongItems.filter((item) => item.categoryId === category.id).length,
          active: categoryId === category.id,
          className: categoryId === category.id ? 'filter-chip active' : 'filter-chip',
        }))
        .filter((item) => item.count > 0),
    ]

    this.setData({
      wrongItems,
      filters,
      activeCategoryId: categoryId,
    })
  },

  switchFilter(event) {
    const { id } = event.currentTarget.dataset
    this.applyFilter(id)
  },

  practiceWrong() {
    const { activeCategoryId } = this.data
    const categoryQuery = activeCategoryId === 'all' ? '' : `&categoryId=${activeCategoryId}`
    wx.navigateTo({
      url: `/pages/quiz/quiz?type=wrong${categoryQuery}`,
    })
  },

  markMastered(event) {
    const { id } = event.currentTarget.dataset
    removeWrongQuestion(id)
    wx.showToast({ title: '已移出错题本', icon: 'success' })
    this.refreshWrongbook()
  },
})
