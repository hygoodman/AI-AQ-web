const { categories } = require('../../data/categories')

Page({
  data: {
    categories,
  },

  handleCategorySelect(event) {
    const { id } = event.detail
    wx.navigateTo({
      url: `/pages/quiz/quiz?categoryId=${id}`,
    })
  },
})
