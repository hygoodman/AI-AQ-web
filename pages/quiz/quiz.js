const { categories } = require('../../data/categories')
const { questions } = require('../../data/questions')
const { pickQuestions, pickDailyQuestions, getAccuracy } = require('../../utils/quiz')
const { formatDate } = require('../../utils/date')
const {
  saveQuizRecord,
  saveWrongQuestion,
  getWrongQuestions,
  removeWrongQuestion,
  saveFavorite,
  getFavorites,
  removeFavorite,
} = require('../../utils/storage')

Page({
  data: {
    title: '今日 AI 快问快答',
    quizType: 'daily',
    categoryId: '',
    quizQuestions: [],
    currentIndex: 0,
    currentQuestion: null,
    selectedAnswer: '',
    isAnswered: false,
    isCorrect: false,
    isLastQuestion: false,
    isCurrentFavorited: false,
    favoriteText: '收藏',
    nextButtonText: '下一题',
    progressText: '第 1 / 5 题',
    answerStatusText: '',
    answerStatusClass: '',
    favoriteQuestionIds: [],
    answers: [],
    optionViews: [],
  },

  onLoad(options) {
    const quizType = options.type || 'category'
    const categoryId = options.categoryId || ''
    const category = categories.find((item) => item.id === categoryId)
    const title = category ? category.name : '今日 AI 快问快答'
    let quizQuestions = quizType === 'daily' ? pickDailyQuestions(questions, 5) : pickQuestions(questions, 5, categoryId)

    if (quizType === 'wrong') {
      const wrongIds = getWrongQuestions().map((item) => item.questionId)
      quizQuestions = pickQuestions(
        questions.filter((item) => {
          const isWrongQuestion = wrongIds.includes(item.id)
          const matchesCategory = categoryId ? item.categoryId === categoryId : true
          return isWrongQuestion && matchesCategory
        }),
        5
      )
    }

    this.setData(
      {
        title: quizType === 'wrong' ? '错题重新练习' : title,
        quizType,
        categoryId,
        quizQuestions,
        favoriteQuestionIds: getFavorites().map((item) => item.questionId),
      },
      () => this.setCurrentQuestion(0)
    )

    if (options.categoryId) {
      wx.setNavigationBarTitle({
        title,
      })
    }
  },

  setCurrentQuestion(index) {
    const currentQuestion = this.data.quizQuestions[index]
    if (!currentQuestion) return

    this.setData({
      currentIndex: index,
      currentQuestion,
      selectedAnswer: '',
      isAnswered: false,
      isCorrect: false,
      isLastQuestion: index + 1 === this.data.quizQuestions.length,
      isCurrentFavorited: this.data.favoriteQuestionIds.includes(currentQuestion.id),
      favoriteText: this.data.favoriteQuestionIds.includes(currentQuestion.id) ? '已收藏' : '收藏',
      nextButtonText: index + 1 === this.data.quizQuestions.length ? '查看结果' : '下一题',
      progressText: `第 ${index + 1} / ${this.data.quizQuestions.length} 题`,
      answerStatusText: '',
      answerStatusClass: '',
      optionViews: this.buildOptionViews(currentQuestion, ''),
    })
  },

  buildOptionViews(question, selectedAnswer) {
    const isAnswered = Boolean(selectedAnswer)
    return question.options.map((option) => {
      let status = ''
      if (isAnswered && option.key === question.answer) status = 'correct'
      if (isAnswered && option.key === selectedAnswer && option.key !== question.answer) status = 'wrong'
      return {
        ...option,
        status,
      }
    })
  },

  handleOptionSelect(event) {
    if (this.data.isAnswered) return

    const selectedAnswer = event.detail.key
    const { currentQuestion, answers } = this.data
    const isCorrect = selectedAnswer === currentQuestion.answer
    const answerItem = {
      questionId: currentQuestion.id,
      categoryId: currentQuestion.categoryId,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect,
    }

    if (!isCorrect) {
      saveWrongQuestion({
        questionId: currentQuestion.id,
        categoryId: currentQuestion.categoryId,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.answer,
        wrongAt: formatDate(),
        mastered: false,
      })
    } else if (this.data.quizType === 'wrong') {
      removeWrongQuestion(currentQuestion.id)
    }

    this.setData({
      selectedAnswer,
      isAnswered: true,
      isCorrect,
      answerStatusText: isCorrect ? '回答正确' : '回答错误',
      answerStatusClass: isCorrect ? 'right' : 'error',
      answers: [...answers, answerItem],
      optionViews: this.buildOptionViews(currentQuestion, selectedAnswer),
    })
  },

  toggleFavorite() {
    const { currentQuestion, favoriteQuestionIds } = this.data
    if (!currentQuestion) return

    const isFavorited = favoriteQuestionIds.includes(currentQuestion.id)
    if (isFavorited) {
      removeFavorite(currentQuestion.id)
      this.setData({
        favoriteQuestionIds: favoriteQuestionIds.filter((id) => id !== currentQuestion.id),
        isCurrentFavorited: false,
        favoriteText: '收藏',
      })
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      saveFavorite({
        questionId: currentQuestion.id,
        categoryId: currentQuestion.categoryId,
        favoritedAt: formatDate(),
      })
      this.setData({
        favoriteQuestionIds: [...favoriteQuestionIds, currentQuestion.id],
        isCurrentFavorited: true,
        favoriteText: '已收藏',
      })
      wx.showToast({ title: '已收藏', icon: 'success' })
    }
  },

  nextQuestion() {
    if (!this.data.isAnswered) {
      wx.showToast({ title: '请先选择一个答案', icon: 'none' })
      return
    }

    const nextIndex = this.data.currentIndex + 1
    if (nextIndex < this.data.quizQuestions.length) {
      this.setCurrentQuestion(nextIndex)
      return
    }

    this.finishQuiz()
  },

  finishQuiz() {
    const { answers, quizQuestions, categoryId, quizType, title } = this.data
    const correct = answers.filter((item) => item.isCorrect).length
    const total = quizQuestions.length
    const wrong = total - correct
    const accuracy = getAccuracy(correct, total)
    const record = {
      id: `record_${Date.now()}`,
      date: formatDate(),
      categoryId,
      categoryName: this.getRecordTitle(quizType, title),
      quizType,
      total,
      correct,
      wrong,
      accuracy,
      questionIds: quizQuestions.map((item) => item.id),
      wrongQuestionIds: answers.filter((item) => !item.isCorrect).map((item) => item.questionId),
      answers,
    }

    saveQuizRecord(record)
    wx.navigateTo({
      url: `/pages/result/result?total=${total}&correct=${correct}&wrong=${wrong}&accuracy=${accuracy}&quizType=${quizType}&categoryId=${categoryId}`,
    })
  },

  getRecordTitle(quizType, title) {
    if (quizType === 'daily') return '今日快问快答'
    if (quizType === 'wrong') return '错题重新练习'
    return title || '分类练习'
  },

  exitQuiz() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }

    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})
