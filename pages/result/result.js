Page({
  data: {
    total: 0,
    correct: 0,
    wrong: 0,
    accuracy: 0,
    comment: '今天又多懂了一点 AI，继续保持。',
    continueUrl: '/pages/quiz/quiz?type=daily',
    continueText: '再练一组',
    resultTitle: '今日快问快答',
  },

  onLoad(options) {
    const total = Number(options.total || 0)
    const correct = Number(options.correct || 0)
    const wrong = Number(options.wrong || 0)
    const accuracy = Number(options.accuracy || 0)
    const quizType = options.quizType || 'daily'
    const categoryId = options.categoryId || ''
    let comment = '今天又多懂了一点 AI，继续保持。'
    let continueUrl = '/pages/quiz/quiz?type=daily'
    let continueText = '再练一组'
    let resultTitle = '今日快问快答'

    if (accuracy >= 90) comment = '很棒，你已经掌握得很扎实。'
    if (accuracy >= 60 && accuracy < 90) comment = '不错，建议顺手复习一下错题。'
    if (accuracy < 60) comment = '答错也没关系，错题就是进步点。'
    if (quizType === 'category' && categoryId) {
      continueUrl = `/pages/quiz/quiz?categoryId=${categoryId}`
      continueText = '继续本类练习'
      resultTitle = '分类练习'
    }
    if (quizType === 'wrong') {
      continueUrl = '/pages/quiz/quiz?type=wrong'
      continueText = '继续练错题'
      resultTitle = '错题重新练习'
    }

    this.setData({
      total,
      correct,
      wrong,
      accuracy,
      comment,
      continueUrl,
      continueText,
      resultTitle,
    })
  },

  goHome() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  goWrongbook() {
    wx.navigateTo({
      url: '/pages/wrongbook/wrongbook',
    })
  },

  continueQuiz() {
    wx.redirectTo({
      url: this.data.continueUrl,
    })
  },
})
