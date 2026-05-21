import React, { useEffect, useMemo, useState } from 'react'
import { fetchPublishedNewsArchive } from '../lib/news.js'

const SOURCE_LABELS = {
  'OpenAI News': 'OpenAI 资讯',
  'Google AI Blog': 'Google AI 博客',
  'Anthropic News Search': 'Anthropic 资讯搜索',
  'Microsoft AI Blog': '微软 AI 博客',
  'Nvidia AI Blog': 'NVIDIA AI 博客',
  'Meta AI News Search': 'Meta AI 资讯搜索',
  'MIT Technology Review AI': 'MIT 科技评论 AI',
  'TechCrunch AI': 'TechCrunch AI',
  'The Verge AI': 'The Verge AI',
  'VentureBeat AI': 'VentureBeat AI',
}

function formatNewsDate(value) {
  if (!value) return ''
  return value
}

function formatNewsTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function formatNewsAge(value) {
  if (!value) return ''

  const publishedAt = new Date(value)
  if (Number.isNaN(publishedAt.getTime())) return formatNewsTime(value)

  const elapsedMinutes = Math.max(0, Math.round((Date.now() - publishedAt.getTime()) / 60000))
  if (elapsedMinutes < 60) return `${Math.max(1, elapsedMinutes)} 分钟前`

  const elapsedHours = Math.round(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours} 小时前`

  return formatNewsTime(value)
}

function getNewsSummary(value, title) {
  if (!value) return ''

  const summary = value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const summaryStart = summary.toLowerCase().slice(0, 70)
  const titleStart = (title || '').toLowerCase().slice(0, 70)
  if (!summary || summary.includes('href=') || (titleStart && summaryStart === titleStart)) return ''

  return summary
}

function getNewsMark(item) {
  if (item.rank) return `#${item.rank}`
  return (item.source_name || item.title || 'AI').trim().slice(0, 2).toUpperCase()
}

function getSourceLabel(value) {
  return SOURCE_LABELS[value] || value || '未知来源'
}

function ArchiveDateButton({ group, isSelected, onToggle }) {
  return (
    <button
      className={`news-archive-day ${isSelected ? 'selected' : ''}`}
      type="button"
      aria-expanded={isSelected}
      onClick={() => onToggle(group.batchDate)}
    >
      <span className="news-calendar-mark" aria-hidden="true" />
      <span>
        <strong>{formatNewsDate(group.batchDate)}</strong>
        <small>{group.items.length} 条资讯</small>
      </span>
      <span className="news-archive-chevron" aria-hidden="true" />
    </button>
  )
}

export default function AiNewsArchive() {
  const [archiveGroups, setArchiveGroups] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let isActive = true

    fetchPublishedNewsArchive()
      .then((groups) => {
        if (!isActive) return
        setArchiveGroups(groups)
        setSelectedDate(groups[0]?.batchDate || '')
        setStatus('ready')
      })
      .catch(() => {
        if (!isActive) return
        setStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [])

  const latestDate = archiveGroups[0]?.batchDate
  const hasNews = useMemo(() => archiveGroups.some((group) => group.items.length), [archiveGroups])
  const selectedGroup = archiveGroups.find((group) => group.batchDate === selectedDate) || archiveGroups[0]
  const historyGroups = archiveGroups.filter((group) => group.batchDate !== latestDate)
  const totalArticles = useMemo(
    () => archiveGroups.reduce((total, group) => total + group.items.length, 0),
    [archiveGroups]
  )

  function toggleDate(batchDate) {
    setSelectedDate((currentDate) => (currentDate === batchDate ? latestDate : batchDate))
  }

  return (
    <section className="news-archive panel" aria-labelledby="ai-news-archive-title">
      <div className="section-header news-header">
        <div>
          <p className="eyebrow">资讯</p>
          <h2 id="ai-news-archive-title">AI 资讯归档</h2>
          <p className="muted">每日 AI 热点摘录，陪你持续学习</p>
        </div>
      </div>

      {status === 'loading' && <div className="empty-state news-empty">AI 资讯加载中...</div>}
      {status === 'error' && <div className="empty-state news-empty">AI 资讯加载失败。</div>}
      {status === 'ready' && !hasNews && <div className="empty-state news-empty">暂无 AI 资讯。</div>}

      {status === 'ready' && hasNews && (
        <div className="news-archive-layout">
          <article className={`news-featured-day ${selectedGroup?.batchDate === latestDate ? 'latest' : ''}`}>
            <header className="news-featured-header">
              <span className="news-calendar-mark" aria-hidden="true" />
              <strong>{formatNewsDate(selectedGroup?.batchDate)}</strong>
              {selectedGroup?.batchDate === latestDate && <span className="news-latest-pill">最新</span>}
              <span className="news-update-count">{selectedGroup?.items.length || 0} 条资讯</span>
            </header>

            <div className="news-story-list">
              {selectedGroup?.items.length ? (
                selectedGroup.items.map((item) => {
                  const summary = getNewsSummary(item.summary, item.title)

                  return (
                    <article className="news-story" key={item.id}>
                      <span className="news-story-mark" aria-hidden="true">
                        {getNewsMark(item)}
                      </span>
                      <div className="news-story-copy">
                        <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                        {summary && <p>{summary}</p>}
                      </div>
                      <div className="news-story-actions">
                        <div className="news-meta">
                          <span>{getSourceLabel(item.source_name)}</span>
                          {formatNewsAge(item.published_at || item.fetched_at) && (
                            <span>{formatNewsAge(item.published_at || item.fetched_at)}</span>
                          )}
                        </div>
                        <a className="news-source-button" href={item.source_url} target="_blank" rel="noopener noreferrer">
                          查看原文
                          <span className="news-source-arrow" aria-hidden="true" />
                        </a>
                      </div>
                    </article>
                  )
                })
              ) : (
                <div className="empty-state news-empty">当天暂无 AI 资讯。</div>
              )}
            </div>
          </article>

          <aside className="news-archive-rail" aria-label="AI 资讯归档历史">
            <section className="news-rail-block">
              <h3>往日归档</h3>
              <p>查看过去日期的 AI 资讯摘录。</p>
              <div className="news-history-list">
                {historyGroups.length ? (
                  historyGroups.map((group) => (
                    <ArchiveDateButton
                      group={group}
                      isSelected={selectedGroup?.batchDate === group.batchDate}
                      key={group.batchDate}
                      onToggle={toggleDate}
                    />
                  ))
                ) : (
                  <div className="empty-state news-empty">暂无更早的 AI 资讯。</div>
                )}
              </div>
            </section>

            <section className="news-rail-block news-archive-stats" aria-label="AI 资讯归档统计">
              <div>
                <span className="news-stat-mark calendar" aria-hidden="true" />
                <small>归档天数</small>
                <strong>{archiveGroups.length}</strong>
              </div>
              <div>
                <span className="news-stat-mark article" aria-hidden="true" />
                <small>资讯总数</small>
                <strong>{totalArticles}</strong>
              </div>
            </section>
          </aside>
        </div>
      )}
    </section>
  )
}
