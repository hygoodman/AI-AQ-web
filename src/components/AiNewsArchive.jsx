import React, { useEffect, useMemo, useState } from 'react'
import { fetchPublishedNewsArchive } from '../lib/news.js'

function formatNewsDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
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

export default function AiNewsArchive() {
  const [archiveGroups, setArchiveGroups] = useState([])
  const [expandedDates, setExpandedDates] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let isActive = true

    fetchPublishedNewsArchive()
      .then((groups) => {
        if (!isActive) return
        setArchiveGroups(groups)
        setExpandedDates(groups[0]?.batchDate ? [groups[0].batchDate] : [])
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

  function toggleDate(batchDate) {
    setExpandedDates((currentDates) =>
      currentDates.includes(batchDate)
        ? currentDates.filter((date) => date !== batchDate)
        : [...currentDates, batchDate]
    )
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
        <div className="news-group-list">
          {archiveGroups.map((group) => {
            const isExpanded = expandedDates.includes(group.batchDate)
            const isLatest = group.batchDate === latestDate

            return (
              <article className={`news-group ${isLatest ? 'latest' : ''}`} key={group.batchDate}>
                <button
                  className="news-date-row"
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => toggleDate(group.batchDate)}
                >
                  <span>{formatNewsDate(group.batchDate)}</span>
                  <span className="news-date-meta">{isLatest ? 'Latest archive' : isExpanded ? 'Collapse' : 'Expand'}</span>
                </button>

                {isExpanded && (
                  <div className="news-list">
                    {group.items.length ? (
                      group.items.map((item) => (
                        <article className="news-item" key={item.id}>
                          <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                          {item.summary && <p>{item.summary}</p>}
                          <div className="news-meta">
                            {item.rank && <span>Rank #{item.rank}</span>}
                            <span>{item.source_name || 'Unknown source'}</span>
                            {formatNewsTime(item.published_at || item.fetched_at) && (
                              <span>{formatNewsTime(item.published_at || item.fetched_at)}</span>
                            )}
                            {item.heat_score && <span>Heat {Math.round(item.heat_score)}</span>}
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="empty-state news-empty">No AI news for this day.</div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
