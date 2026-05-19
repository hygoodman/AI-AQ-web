import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import AiNewsArchive from './components/AiNewsArchive.jsx'
import { categories, questions } from './generated/quiz-data.js'
import './styles.css'

const STORAGE_KEYS = {
  records: 'ai_quiz_records',
  wrongQuestions: 'ai_wrong_questions',
  favorites: 'ai_favorites',
}

function getStoredList(key) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

function setStoredList(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5)
}

function pickQuestions(count = 5, categoryId = '') {
  const pool = categoryId ? questions.filter((item) => item.categoryId === categoryId) : questions
  return shuffle(pool).slice(0, count)
}

function pickDailyQuestions(count = 5) {
  const grouped = questions.reduce((result, item) => {
    if (!result[item.categoryId]) result[item.categoryId] = []
    result[item.categoryId].push(item)
    return result
  }, {})
  const selected = shuffle(Object.keys(grouped))
    .map((categoryId) => shuffle(grouped[categoryId])[0])
    .filter(Boolean)
    .slice(0, count)

  if (selected.length >= count) return shuffle(selected)

  const selectedIds = new Set(selected.map((item) => item.id))
  const rest = shuffle(questions.filter((item) => !selectedIds.has(item.id))).slice(0, count - selected.length)
  return shuffle([...selected, ...rest])
}

function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function getAccuracy(correct, total) {
  if (!total) return 0
  return Math.round((correct / total) * 100)
}

function buildQuestionSet(mode, categoryId) {
  if (mode === 'daily') return pickDailyQuestions(5)

  if (mode === 'wrong') {
    const wrongIds = getStoredList(STORAGE_KEYS.wrongQuestions).map((item) => item.questionId)
    const pool = questions.filter((item) => {
      const isWrongQuestion = wrongIds.includes(item.id)
      const matchesCategory = categoryId ? item.categoryId === categoryId : true
      return isWrongQuestion && matchesCategory
    })
    return shuffle(pool).slice(0, 5)
  }

  return pickQuestions(5, categoryId)
}

function App() {
  const [view, setView] = useState('home')
  const [toast, setToast] = useState('')
  const [quizSession, setQuizSession] = useState(null)
  const [records, setRecords] = useState(() => getStoredList(STORAGE_KEYS.records))
  const [wrongQuestions, setWrongQuestions] = useState(() => getStoredList(STORAGE_KEYS.wrongQuestions))
  const [favorites, setFavorites] = useState(() => getStoredList(STORAGE_KEYS.favorites))
  const [lastResult, setLastResult] = useState(null)

  const favoriteIds = useMemo(() => favorites.map((item) => item.questionId), [favorites])
  const wrongQuestionViews = useMemo(
    () =>
      wrongQuestions
        .map((item) => {
          const question = questions.find((questionItem) => questionItem.id === item.questionId)
          const category = categories.find((categoryItem) => categoryItem.id === item.categoryId)
          return question ? { ...item, question, categoryName: category?.name || '未分类' } : null
        })
        .filter(Boolean),
    [wrongQuestions]
  )
  const favoriteViews = useMemo(
    () =>
      favorites
        .map((item) => {
          const question = questions.find((questionItem) => questionItem.id === item.questionId)
          const category = categories.find((categoryItem) => categoryItem.id === question?.categoryId)
          return question ? { ...item, question, categoryName: category?.name || '未分类' } : null
        })
        .filter(Boolean),
    [favorites]
  )

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  function persistRecords(nextRecords) {
    setRecords(nextRecords)
    setStoredList(STORAGE_KEYS.records, nextRecords)
  }

  function persistWrongQuestions(nextWrongQuestions) {
    setWrongQuestions(nextWrongQuestions)
    setStoredList(STORAGE_KEYS.wrongQuestions, nextWrongQuestions)
  }

  function persistFavorites(nextFavorites) {
    setFavorites(nextFavorites)
    setStoredList(STORAGE_KEYS.favorites, nextFavorites)
  }

  function startQuiz(mode = 'daily', categoryId = '') {
    const category = categories.find((item) => item.id === categoryId)
    const quizQuestions = buildQuestionSet(mode, categoryId)

    if (!quizQuestions.length) {
      showToast(mode === 'wrong' ? '当前没有可练习的错题' : '这个分类暂时没有题目')
      return
    }

    setQuizSession({
      mode,
      categoryId,
      title: mode === 'wrong' ? '错题重新练习' : category?.name || '今日 AI 快问快答',
      questions: quizQuestions,
      currentIndex: 0,
      selectedAnswer: '',
      isAnswered: false,
      answers: [],
    })
    setLastResult(null)
    setView('quiz')
  }

  function selectAnswer(answerKey) {
    if (!quizSession || quizSession.isAnswered) return

    const currentQuestion = quizSession.questions[quizSession.currentIndex]
    const isCorrect = answerKey === currentQuestion.answer
    const answerItem = {
      questionId: currentQuestion.id,
      categoryId: currentQuestion.categoryId,
      userAnswer: answerKey,
      correctAnswer: currentQuestion.answer,
      isCorrect,
    }

    if (!isCorrect) {
      const nextWrongQuestions = [
        {
          questionId: currentQuestion.id,
          categoryId: currentQuestion.categoryId,
          userAnswer: answerKey,
          correctAnswer: currentQuestion.answer,
          wrongAt: formatDate(),
          mastered: false,
        },
        ...wrongQuestions.filter((item) => item.questionId !== currentQuestion.id),
      ]
      persistWrongQuestions(nextWrongQuestions)
    } else if (quizSession.mode === 'wrong') {
      persistWrongQuestions(wrongQuestions.filter((item) => item.questionId !== currentQuestion.id))
    }

    setQuizSession({
      ...quizSession,
      selectedAnswer: answerKey,
      isAnswered: true,
      answers: [...quizSession.answers, answerItem],
    })
  }

  function toggleFavorite(question) {
    const isFavorited = favoriteIds.includes(question.id)

    if (isFavorited) {
      persistFavorites(favorites.filter((item) => item.questionId !== question.id))
      showToast('已取消收藏')
      return
    }

    persistFavorites([
      {
        questionId: question.id,
        categoryId: question.categoryId,
        favoritedAt: formatDate(),
      },
      ...favorites,
    ])
    showToast('已收藏')
  }

  function nextQuestion() {
    if (!quizSession?.isAnswered) {
      showToast('请先选择一个答案')
      return
    }

    const nextIndex = quizSession.currentIndex + 1
    if (nextIndex < quizSession.questions.length) {
      setQuizSession({
        ...quizSession,
        currentIndex: nextIndex,
        selectedAnswer: '',
        isAnswered: false,
      })
      return
    }

    finishQuiz()
  }

  function finishQuiz() {
    const correct = quizSession.answers.filter((item) => item.isCorrect).length
    const total = quizSession.questions.length
    const result = {
      id: `record_${Date.now()}`,
      date: formatDate(),
      categoryId: quizSession.categoryId,
      categoryName:
        quizSession.mode === 'daily' ? '今日快问快答' : quizSession.mode === 'wrong' ? '错题重新练习' : quizSession.title,
      quizType: quizSession.mode,
      total,
      correct,
      wrong: total - correct,
      accuracy: getAccuracy(correct, total),
      questionIds: quizSession.questions.map((item) => item.id),
      wrongQuestionIds: quizSession.answers.filter((item) => !item.isCorrect).map((item) => item.questionId),
      answers: quizSession.answers,
    }

    persistRecords([result, ...records])
    setLastResult(result)
    setQuizSession(null)
    setView('result')
  }

  function removeWrongQuestion(questionId) {
    persistWrongQuestions(wrongQuestions.filter((item) => item.questionId !== questionId))
    showToast('已移出错题本')
  }

  function renderHome() {
    const lastRecord = records[0]

    return (
      <>
        <section className="hero">
          <div>
            <p className="eyebrow">AI Knowledge Quiz</p>
            <h1>AI 知识问答</h1>
            <p className="lead">轻量练习、错题复盘、收藏回看。部署到 Vercel 后，同事打开链接即可使用。</p>
          </div>
          <button className="primary-button" onClick={() => startQuiz('daily')}>
            开始今日练习
          </button>
        </section>

        <section className="stats-grid" aria-label="学习概览">
          <Stat label="题库数量" value={questions.length} />
          <Stat label="练习记录" value={records.length} />
          <Stat label="错题数量" value={wrongQuestions.length} />
          <Stat label="收藏题目" value={favorites.length} />
        </section>

        {lastRecord && (
          <section className="panel compact-panel">
            <div>
              <p className="eyebrow">最近一次</p>
              <h2>{lastRecord.categoryName}</h2>
              <p className="muted">
                {lastRecord.date}，正确 {lastRecord.correct}/{lastRecord.total}，正确率 {lastRecord.accuracy}%
              </p>
            </div>
            <button className="ghost-button" onClick={() => setView('profile')}>
              查看记录
            </button>
          </section>
        )}

        <section className="section-header">
          <div>
            <p className="eyebrow">Categories</p>
            <h2>选择分类练习</h2>
          </div>
          <button className="text-button" onClick={() => setView('categories')}>
            查看全部
          </button>
        </section>

        <div className="category-grid">
          {categories.slice(0, 4).map((category) => (
            <CategoryCard key={category.id} category={category} onStart={() => startQuiz('category', category.id)} />
          ))}
        </div>

        <AiNewsArchive />
      </>
    )
  }

  function renderCategories() {
    return (
      <>
        <PageTitle eyebrow="Categories" title="全部分类" onBack={() => setView('home')} />
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} onStart={() => startQuiz('category', category.id)} />
          ))}
        </div>
      </>
    )
  }

  function renderQuiz() {
    if (!quizSession) return null

    const question = quizSession.questions[quizSession.currentIndex]
    const progress = quizSession.currentIndex + 1
    const isFavorited = favoriteIds.includes(question.id)
    const category = categories.find((item) => item.id === question.categoryId)

    return (
      <>
        <PageTitle eyebrow={quizSession.title} title={`第 ${progress} / ${quizSession.questions.length} 题`} onBack={() => setView('home')} />
        <section className="quiz-card">
          <div className="quiz-meta">
            <span>{category?.name || 'AI 知识'}</span>
            <button className="small-button" onClick={() => toggleFavorite(question)}>
              {isFavorited ? '已收藏' : '收藏'}
            </button>
          </div>
          <h2>{question.title}</h2>
          <div className="options">
            {question.options.map((option) => {
              const isSelected = option.key === quizSession.selectedAnswer
              const isCorrect = option.key === question.answer
              const status = quizSession.isAnswered && isCorrect ? 'correct' : quizSession.isAnswered && isSelected ? 'wrong' : ''

              return (
                <button key={option.key} className={`option-button ${status}`} onClick={() => selectAnswer(option.key)}>
                  <span>{option.key}</span>
                  {option.text}
                </button>
              )
            })}
          </div>

          {quizSession.isAnswered && (
            <div className={`answer-box ${quizSession.selectedAnswer === question.answer ? 'right' : 'error'}`}>
              <strong>{quizSession.selectedAnswer === question.answer ? '回答正确' : '回答错误'}</strong>
              <p>{question.explanation}</p>
            </div>
          )}

          <button className="primary-button full-button" onClick={nextQuestion}>
            {progress === quizSession.questions.length ? '查看结果' : '下一题'}
          </button>
        </section>
      </>
    )
  }

  function renderResult() {
    if (!lastResult) return renderHome()

    return (
      <>
        <PageTitle eyebrow="Result" title="练习结果" onBack={() => setView('home')} />
        <section className="result-panel">
          <div className="score-ring" style={{ '--score': `${lastResult.accuracy}%` }}>
            {lastResult.accuracy}%
          </div>
          <h2>{lastResult.categoryName}</h2>
          <p className="muted">
            共 {lastResult.total} 题，答对 {lastResult.correct} 题，答错 {lastResult.wrong} 题
          </p>
          <div className="action-row">
            <button className="primary-button" onClick={() => startQuiz(lastResult.quizType, lastResult.categoryId)}>
              再练一次
            </button>
            <button className="ghost-button" onClick={() => setView('wrongbook')}>
              查看错题
            </button>
          </div>
        </section>
      </>
    )
  }

  function renderWrongbook() {
    return (
      <>
        <PageTitle eyebrow="Review" title="错题本" onBack={() => setView('home')} />
        <section className="panel compact-panel">
          <p className="muted">当前共有 {wrongQuestionViews.length} 道错题。</p>
          <button className="primary-button" onClick={() => startQuiz('wrong')}>
            错题重练
          </button>
        </section>
        <QuestionList items={wrongQuestionViews} emptyText="暂无错题" onRemove={removeWrongQuestion} />
      </>
    )
  }

  function renderProfile() {
    return (
      <>
        <PageTitle eyebrow="Profile" title="记录与收藏" onBack={() => setView('home')} />
        <section className="section-header">
          <div>
            <p className="eyebrow">History</p>
            <h2>练习记录</h2>
          </div>
        </section>
        <div className="record-list">
          {records.length ? (
            records.slice(0, 10).map((record) => (
              <article className="list-item" key={record.id}>
                <div>
                  <h3>{record.categoryName}</h3>
                  <p className="muted">
                    {record.date} · {record.correct}/{record.total} · {record.accuracy}%
                  </p>
                </div>
              </article>
            ))
          ) : (
            <EmptyState text="暂无练习记录" />
          )}
        </div>

        <section className="section-header">
          <div>
            <p className="eyebrow">Favorites</p>
            <h2>收藏题目</h2>
          </div>
        </section>
        <QuestionList
          items={favoriteViews}
          emptyText="暂无收藏题目"
          onRemove={(questionId) => {
            persistFavorites(favorites.filter((item) => item.questionId !== questionId))
            showToast('已取消收藏')
          }}
        />
      </>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView('home')}>
          AI 知识问答
        </button>
        <nav>
          <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>
            首页
          </button>
          <button className={view === 'wrongbook' ? 'active' : ''} onClick={() => setView('wrongbook')}>
            错题
          </button>
          <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}>
            记录
          </button>
        </nav>
      </header>

      <main>
        {view === 'home' && renderHome()}
        {view === 'categories' && renderCategories()}
        {view === 'quiz' && renderQuiz()}
        {view === 'result' && renderResult()}
        {view === 'wrongbook' && renderWrongbook()}
        {view === 'profile' && renderProfile()}
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function PageTitle({ eyebrow, title, onBack }) {
  return (
    <section className="page-title">
      <button className="ghost-button" onClick={onBack}>
        返回
      </button>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <article className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  )
}

function CategoryCard({ category, onStart }) {
  return (
    <article className="category-card">
      <div className="category-icon">{category.icon}</div>
      <div>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
      <div className="card-footer">
        <span>{category.difficulty}</span>
        <button className="small-button" onClick={onStart}>
          开始
        </button>
      </div>
    </article>
  )
}

function QuestionList({ items, emptyText, onRemove }) {
  if (!items.length) return <EmptyState text={emptyText} />

  return (
    <div className="question-list">
      {items.map((item) => (
        <article className="list-item" key={item.question.id}>
          <div>
            <p className="eyebrow">{item.categoryName}</p>
            <h3>{item.question.title}</h3>
            <p className="muted">正确答案：{item.question.answer}</p>
          </div>
          <button className="small-button" onClick={() => onRemove(item.question.id)}>
            移除
          </button>
        </article>
      ))}
    </div>
  )
}

function EmptyState({ text }) {
  return <section className="empty-state">{text}</section>
}

createRoot(document.getElementById('root')).render(<App />)
