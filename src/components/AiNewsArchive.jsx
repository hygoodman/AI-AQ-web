import React, { useEffect, useMemo, useState } from 'react'
import { fetchPublishedNewsArchive } from '../lib/news.js'

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
  if (elapsedMinutes < 60) return `${Math.max(1, elapsedMinutes)}m ago`

  const elapsedHours = Math.round(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours}h ago`

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
        <small>{group.items.length} updates</small>
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
          <p className="eyebrow">News</p>
          <h2 id="ai-news-archive-title">AI News Archive</h2>
          <p className="muted">Daily AI updates collected for your learning</p>
        </div>
      </div>

      {status === 'loading' && <div className="empty-state news-empty">Loading AI news...</div>}
      {status === 'error' && <div className="empty-state news-empty">Failed to load AI news.</div>}
      {status === 'ready' && !hasNews && <div className="empty-state news-empty">No AI news available yet.</div>}

      {status === 'ready' && hasNews && (
        <div className="news-archive-layout">
          <article className={`news-featured-day ${selectedGroup?.batchDate === latestDate ? 'latest' : ''}`}>
            <header className="news-featured-header">
              <span className="news-calendar-mark" aria-hidden="true" />
              <strong>{formatNewsDate(selectedGroup?.batchDate)}</strong>
              {selectedGroup?.batchDate === latestDate && <span className="news-latest-pill">Latest</span>}
              <span className="news-update-count">{selectedGroup?.items.length || 0} updates</span>
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
                          <span>{item.source_name || 'Unknown source'}</span>
                          {formatNewsAge(item.published_at || item.fetched_at) && (
                            <span>{formatNewsAge(item.published_at || item.fetched_at)}</span>
                          )}
                        </div>
                        <a className="news-source-button" href={item.source_url} target="_blank" rel="noopener noreferrer">
                          View Source
                          <span className="news-source-arrow" aria-hidden="true" />
                        </a>
                      </div>
                    </article>
                  )
                })
              ) : (
                <div className="empty-state news-empty">No AI news for this day.</div>
              )}
            </div>
          </article>

          <aside className="news-archive-rail" aria-label="AI news archive history">
            <section className="news-rail-block">
              <h3>Archive</h3>
              <p>Browse past days of AI news updates.</p>
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
                  <div className="empty-state news-empty">No older AI news yet.</div>
                )}
              </div>
            </section>

            <section className="news-rail-block news-archive-stats" aria-label="AI news archive totals">
              <div>
                <span className="news-stat-mark calendar" aria-hidden="true" />
                <small>Total days</small>
                <strong>{archiveGroups.length}</strong>
              </div>
              <div>
                <span className="news-stat-mark article" aria-hidden="true" />
                <small>Total articles</small>
                <strong>{totalArticles}</strong>
              </div>
            </section>
          </aside>
        </div>
      )}
    </section>
  )
}
