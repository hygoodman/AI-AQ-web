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

function getWeekRange(batchDate) {
  const date = new Date(`${batchDate}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return null

  const mondayOffset = (date.getUTCDay() + 6) % 7
  const start = new Date(date)
  start.setUTCDate(date.getUTCDate() - mondayOffset)

  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 6)

  return {
    key: start.toISOString().slice(0, 10),
    label: `${start.toISOString().slice(0, 10)} 至 ${end.toISOString().slice(0, 10)}`,
  }
}

function groupArchiveWeeks(groups) {
  const weeks = groups.reduce((weekMap, group) => {
    const range = getWeekRange(group.batchDate)
    if (!range) return weekMap

    if (!weekMap.has(range.key)) {
      weekMap.set(range.key, { ...range, groups: [] })
    }

    weekMap.get(range.key).groups.push(group)
    return weekMap
  }, new Map())

  return [...weeks.values()].sort((left, right) => right.key.localeCompare(left.key))
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

function getCompanyKind(item) {
  const text = `${item.title || ''} ${item.summary || ''} ${item.source_name || ''}`.toLowerCase()
  if (text.includes('anthropic') || text.includes('claude')) return 'anthropic'
  if (text.includes('openai') || text.includes('chatgpt') || /\bgpt\b/.test(text)) return 'openai'
  if (text.includes('google') || text.includes('gemini') || text.includes('deepmind')) return 'google'
  if (text.includes('meta') || text.includes('llama')) return 'meta'
  if (text.includes('microsoft') || text.includes('copilot')) return 'microsoft'
  if (text.includes('nvidia')) return 'nvidia'
  return 'ai'
}

function NewsCompanyIcon({ item }) {
  const kind = getCompanyKind(item)

  return (
    <span className={`news-company-icon ${kind}`} aria-hidden="true">
      {kind === 'anthropic' && (
        <svg viewBox="0 0 64 64">
          <path d="M14 50 30 14h8l16 36h-9l-3.6-8.8H26.1L22.5 50Z" />
          <path className="cut" d="M29.3 34.3h8.6L33.6 23Z" />
        </svg>
      )}
      {kind === 'openai' && (
        <svg viewBox="0 0 64 64">
          <path d="M31.9 10c5.8 0 10.7 3.7 12.5 8.8 5.3 1 9.2 5.7 9.2 11.3 0 3.2-1.3 6.1-3.4 8.2.4 1.3.6 2.6.6 4 0 7-5.7 12.7-12.7 12.7-1.7 0-3.3-.3-4.8-1-2.1 1.8-4.8 2.8-7.8 2.8-5.8 0-10.7-3.7-12.5-8.8-5.3-1-9.2-5.7-9.2-11.3 0-3.2 1.3-6.1 3.4-8.2-.4-1.3-.6-2.6-.6-4 0-7 5.7-12.7 12.7-12.7 1.7 0 3.3.3 4.8 1 2.1-1.8 4.8-2.8 7.8-2.8Z" />
          <path className="cut" d="m22 22 10-5.8 10 5.8v11.5L32 39.3l-10-5.8Z" />
        </svg>
      )}
      {kind === 'google' && <span className="news-company-letter">G</span>}
      {kind === 'meta' && (
        <svg viewBox="0 0 64 64">
          <path d="M11 41c3.6-13.2 8.5-20 14.7-20 4.2 0 7.5 3.5 10.3 8.1C38.8 24.5 42.1 21 46.3 21 52.5 21 57.4 27.8 61 41h-9.2c-2.3-7.8-4.2-11.6-6.3-11.6-2.4 0-4.7 4.4-7.4 9.3l-2.1 3.8h-8l-2.1-3.8c-2.7-4.9-5-9.3-7.4-9.3-2.1 0-4 3.8-6.3 11.6Z" />
        </svg>
      )}
      {kind === 'microsoft' && (
        <svg viewBox="0 0 64 64">
          <path d="M11 11h19v19H11Zm23 0h19v19H34ZM11 34h19v19H11Zm23 0h19v19H34Z" />
        </svg>
      )}
      {kind === 'nvidia' && (
        <svg viewBox="0 0 64 64">
          <path d="M8 32c8.1-9 16.5-13.5 25.1-13.5 9.7 0 17.3 4.5 22.9 13.5-5.6 9-13.2 13.5-22.9 13.5C24.5 45.5 16.1 41 8 32Zm16.2 0a9.1 9.1 0 1 0 18.2 0 9.1 9.1 0 0 0-18.2 0Zm9.1-4.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
        </svg>
      )}
      {kind === 'ai' && <span className="news-company-letter">AI</span>}
    </span>
  )
}

function ExternalLinkIcon() {
  return (
    <svg className="news-source-arrow" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14 5h5v5" />
      <path d="m19 5-9 9" />
      <path d="M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
    </svg>
  )
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
  const recentHistoryGroups = historyGroups.slice(0, 3)
  const weeklyHistoryGroups = useMemo(() => groupArchiveWeeks(historyGroups.slice(3)), [historyGroups])
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
                      <NewsCompanyIcon item={item} />
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
                          <ExternalLinkIcon />
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
                  recentHistoryGroups.map((group) => (
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

            {weeklyHistoryGroups.length > 0 && (
              <details
                className="news-rail-block news-older-history"
                defaultOpen={weeklyHistoryGroups.some((week) =>
                  week.groups.some((group) => selectedGroup?.batchDate === group.batchDate)
                )}
              >
                <summary>
                  <span className="news-history-mark" aria-hidden="true" />
                  <span>
                    <strong>查看历史资讯</strong>
                    <small>浏览更早归档</small>
                  </span>
                  <span className="news-history-arrow" aria-hidden="true" />
                </summary>
                <div className="news-history-weeks">
                  {weeklyHistoryGroups.map((week) => (
                    <details
                      className="news-history-week"
                      defaultOpen={week.groups.some((group) => selectedGroup?.batchDate === group.batchDate)}
                      key={week.key}
                    >
                      <summary>
                        <span>{week.label}</span>
                        <small>{week.groups.length} 组归档</small>
                      </summary>
                      <div className="news-history-week-days">
                        {week.groups.map((group) => (
                          <ArchiveDateButton
                            group={group}
                            isSelected={selectedGroup?.batchDate === group.batchDate}
                            key={group.batchDate}
                            onToggle={toggleDate}
                          />
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </details>
            )}
          </aside>
        </div>
      )}
    </section>
  )
}
