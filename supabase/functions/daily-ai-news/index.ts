import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  AI_NEWS_INTEREST_THEMES,
  AI_NEWS_KEYWORDS,
  AI_NEWS_LOW_INTEREST_SIGNALS,
  NEWS_SOURCES,
  type NewsSource,
} from '../_shared/news-sources.ts'

type RawNewsItem = {
  title: string
  summary: string
  source_name: string
  source_url: string
  published_at: string
  batch_date: string
  heat_score: number
  topic_score: number
  topic_names: string[]
  company_key: string
}

type SourceResult = {
  source: string
  fetched: number
  accepted: number
  errors: string[]
}

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: JSON_HEADERS,
  })
}

function requireEnv(name: string) {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function getServiceRoleKey() {
  const legacyKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (legacyKey) return legacyKey

  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (secretKeys) {
    const parsed = JSON.parse(secretKeys)
    if (parsed.default) return parsed.default
  }

  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEYS.default')
}

function getBatchDate(date = new Date(), timeZone = Deno.env.get('NEWS_TIME_ZONE') || 'Asia/Shanghai') {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value
  return `${year}-${month}-${day}`
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getFeedNodeText(item: string, names: string[]) {
  for (const name of names) {
    const escapedName = escapeRegExp(name)
    const match = item.match(new RegExp(`<${escapedName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedName}>`, 'i'))
    if (match?.[1]) return match[1].trim()
  }
  return ''
}

function getFeedItems(xml: string) {
  return [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].map((match) => match[2])
}

function getItemLink(item: string) {
  const atomLink = item.match(/<link\b[^>]*\bhref=(?:"([^"]+)"|'([^']+)')[^>]*\/?>/i)
  if (atomLink?.[1] || atomLink?.[2]) return atomLink[1] || atomLink[2]
  return getFeedNodeText(item, ['link', 'guid', 'id'])
}

function stripHtml(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function buildSummary(value: string, title: string) {
  const cleaned = stripHtml(value || title)
  if (cleaned.length < 80 && title && !cleaned.includes(title)) {
    return `${cleaned} ${title}`.trim().slice(0, 150)
  }
  if (cleaned.length <= 150) return cleaned
  const excerpt = cleaned.slice(0, 147).trim()
  return `${excerpt}...`
}

function normalizeUrl(value: string) {
  const cleaned = stripHtml(value)
  if (!cleaned) return ''

  try {
    const url = new URL(cleaned)
    url.hash = ''
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith('utm_') || ['fbclid', 'gclid', 'mc_cid', 'mc_eid'].includes(key)) {
        url.searchParams.delete(key)
      }
    }
    return url.toString()
  } catch {
    return ''
  }
}

function hasChineseText(value: string) {
  return /[\u3400-\u9fff]/.test(value)
}

function countKeywordMatches(text: string, keywords: string[]) {
  const lowerText = text.toLowerCase()
  return keywords.reduce((count, keyword) => {
    const lowerKeyword = keyword.toLowerCase()
    if (lowerKeyword.length <= 2) {
      const escapedKeyword = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(`\\b${escapedKeyword}\\b`, 'i').test(text) ? count + 1 : count
    }
    return lowerText.includes(lowerKeyword) ? count + 1 : count
  }, 0)
}

function hasSignal(text: string, signal: string) {
  const lowerText = text.toLowerCase()
  const lowerSignal = signal.toLowerCase()
  const trimmedSignal = lowerSignal.trim()
  if (/^[a-z0-9]+$/.test(trimmedSignal) && trimmedSignal.length <= 4) {
    return new RegExp(`\\b${escapeRegExp(trimmedSignal)}\\b`, 'i').test(text)
  }
  return lowerText.includes(lowerSignal)
}

function assessInterestTopic(title: string, summary: string) {
  const searchableText = `${title} ${summary}`
  const matchedThemes = AI_NEWS_INTEREST_THEMES.filter((theme) =>
    theme.signals.some((signal) => hasSignal(searchableText, signal))
  )
  const lowInterestMatches = AI_NEWS_LOW_INTEREST_SIGNALS.filter((signal) => hasSignal(searchableText, signal))
  const positiveScore = matchedThemes.reduce((score, theme) => score + theme.weight, 0)
  const lowInterestPenalty = Math.min(28, lowInterestMatches.length * 9)

  return {
    names: matchedThemes.map((theme) => theme.name),
    score: Math.max(0, positiveScore - lowInterestPenalty),
    lowInterestMatches,
  }
}

function getCompanyKey(source: NewsSource, title: string, summary: string) {
  const text = `${source.name} ${title} ${summary}`.toLowerCase()
  if (text.includes('anthropic') || text.includes('claude')) return 'anthropic'
  if (text.includes('openai') || text.includes('chatgpt') || /\bgpt\b/.test(text)) return 'openai'
  if (text.includes('google') || text.includes('gemini') || text.includes('deepmind')) return 'google'
  if (text.includes('meta') || text.includes('llama')) return 'meta'
  if (text.includes('microsoft') || text.includes('copilot')) return 'microsoft'
  if (text.includes('nvidia')) return 'nvidia'
  if (text.includes('deepseek')) return 'deepseek'
  return source.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function getFreshnessScore(publishedAt: Date, now: Date) {
  const ageHours = Math.max(0, (now.getTime() - publishedAt.getTime()) / 36e5)
  return Math.max(0, 30 - ageHours * 1.25)
}

function scoreItem(source: NewsSource, title: string, summary: string, topicScore: number, publishedAt: Date, now: Date) {
  const searchableText = `${title} ${summary}`
  const sourceMatches = countKeywordMatches(searchableText, source.keywords)
  const globalMatches = countKeywordMatches(searchableText, AI_NEWS_KEYWORDS)
  return Number(
    (
      source.sourceWeight * 10 +
      getFreshnessScore(publishedAt, now) +
      Math.min(30, (sourceMatches * 5) + (globalMatches * 3)) +
      Math.min(54, topicScore) +
      (source.highAuthority ? 12 : 0)
    ).toFixed(2)
  )
}

function isFreshEnough(publishedAt: Date, now: Date, batchDate: string, allowRecentWindow: boolean) {
  if (getBatchDate(publishedAt) === batchDate) return true
  if (!allowRecentWindow) return false
  const ageHours = (now.getTime() - publishedAt.getTime()) / 36e5
  return ageHours >= 0 && ageHours <= 36
}

async function fetchSource(
  source: NewsSource,
  batchDate: string,
  now: Date,
  allowRecentWindow: boolean
): Promise<{ items: RawNewsItem[]; result: SourceResult }> {
  const result: SourceResult = { source: source.name, fetched: 0, accepted: 0, errors: [] }

  try {
    const response = await fetch(source.feedUrl, {
      headers: {
        accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        'user-agent': 'ai-quiz-web-vercel-news-bot/1.0',
      },
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const xml = await response.text()
    const nodes = getFeedItems(xml)
    if (!nodes.length) throw new Error('No RSS/Atom items found')
    result.fetched = nodes.length

    const items = nodes
      .map((node) => {
        const title = stripHtml(getFeedNodeText(node, ['title']))
        const sourceUrl = normalizeUrl(getItemLink(node))
        const rawPublishedAt = getFeedNodeText(node, ['pubdate', 'published', 'updated', 'date']) || now.toISOString()
        const publishedAt = new Date(rawPublishedAt)
        const rawSummary = getFeedNodeText(node, ['description', 'summary', 'content', 'encoded'])
        const summary = buildSummary(rawSummary, title)
        const topic = assessInterestTopic(title, summary)

        if (!title || !sourceUrl || Number.isNaN(publishedAt.getTime())) return null
        if (!isFreshEnough(publishedAt, now, batchDate, allowRecentWindow)) return null
        if (!countKeywordMatches(`${title} ${summary}`, [...AI_NEWS_KEYWORDS, ...source.keywords])) return null
        if (!topic.names.length || topic.score < 14) return null

        return {
          title,
          summary,
          source_name: source.name,
          source_url: sourceUrl,
          published_at: publishedAt.toISOString(),
          batch_date: batchDate,
          heat_score: scoreItem(source, title, summary, topic.score, publishedAt, now),
          topic_score: topic.score,
          topic_names: topic.names,
          company_key: getCompanyKey(source, title, summary),
        }
      })
      .filter((item): item is RawNewsItem => Boolean(item))

    result.accepted = items.length
    return { items, result }
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : String(error))
    return { items: [], result }
  }
}

function selectTopItems(items: RawNewsItem[]) {
  const byUrl = new Map<string, RawNewsItem>()

  for (const item of items) {
    const existing = byUrl.get(item.source_url)
    if (!existing || item.heat_score > existing.heat_score) {
      byUrl.set(item.source_url, item)
    }
  }

  const rankedItems = [...byUrl.values()]
    .sort((left, right) => {
      if (right.heat_score !== left.heat_score) return right.heat_score - left.heat_score
      return right.published_at.localeCompare(left.published_at)
    })
  const selectedItems: RawNewsItem[] = []
  const sourceCounts = new Map<string, number>()
  const companyCounts = new Map<string, number>()

  for (const item of rankedItems) {
    if ((sourceCounts.get(item.source_name) || 0) >= 2) continue
    if ((companyCounts.get(item.company_key) || 0) >= 2) continue

    selectedItems.push(item)
    sourceCounts.set(item.source_name, (sourceCounts.get(item.source_name) || 0) + 1)
    companyCounts.set(item.company_key, (companyCounts.get(item.company_key) || 0) + 1)
    if (selectedItems.length === 5) break
  }

  return selectedItems.map((item, index) => ({
      ...item,
      rank: index + 1,
      status: 'published',
      fetched_at: new Date().toISOString(),
    }))
}

Deno.serve(async (request) => {
  try {
    if (request.method === 'GET') {
      return jsonResponse({ ok: true, function: 'daily-ai-news' })
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405)
    }

    const expectedSecret = requireEnv('NEWS_JOB_SECRET')
    if (request.headers.get('x-news-job-secret') !== expectedSecret) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    }

    const startedAt = new Date()
    const body = await request.json().catch(() => ({}))
    const batchDate = typeof body.date === 'string' && body.date ? body.date : getBatchDate(startedAt)
    const allowRecentWindow = !body.date
    const dryRun = body.dryRun === true
    const sourceResults: SourceResult[] = []
    const collectedItems: RawNewsItem[] = []

    for (const source of NEWS_SOURCES) {
      const { items, result } = await fetchSource(source, batchDate, startedAt, allowRecentWindow)
      sourceResults.push(result)
      collectedItems.push(...items)
    }

    const topItems = selectTopItems(collectedItems)
    let upserted = 0
    let archived = 0

    if (!dryRun) {
      const supabase = createClient(requireEnv('SUPABASE_URL'), getServiceRoleKey(), {
        auth: { persistSession: false },
      })

      if (topItems.length) {
        const topUrls = topItems.map((item) => item.source_url)
        const { data: existingRows, error: existingRowsError } = await supabase
          .from('news')
          .select('source_url,title')
          .in('source_url', topUrls)

        if (existingRowsError) throw existingRowsError

        const localizedTitles = new Map(
          (existingRows || [])
            .filter((row) => hasChineseText(row.title || ''))
            .map((row) => [row.source_url, row.title])
        )
        const persistedItems = topItems.map(({ topic_score, topic_names, company_key, ...item }) => ({
          ...item,
          title: localizedTitles.get(item.source_url) || item.title,
        }))
        const { error: upsertError } = await supabase.from('news').upsert(persistedItems, {
          onConflict: 'source_url',
        })

        if (upsertError) throw upsertError
        upserted = topItems.length
      }

      const topUrls = new Set(topItems.map((item) => item.source_url))
      const { data: sameDateRows, error: sameDateError } = await supabase
        .from('news')
        .select('id,source_url')
        .eq('batch_date', batchDate)
        .eq('status', 'published')

      if (sameDateError) throw sameDateError

      const staleIds = (sameDateRows || [])
        .filter((row) => !topUrls.has(row.source_url))
        .map((row) => row.id)

      if (staleIds.length) {
        const { error: archiveError } = await supabase
          .from('news')
          .update({ status: 'archived', rank: null })
          .in('id', staleIds)

        if (archiveError) throw archiveError
        archived = staleIds.length
      }
    }

    const finishedAt = new Date()
    const payload = {
      ok: true,
      batch_date: batchDate,
      dry_run: dryRun,
      started_at: startedAt.toISOString(),
      finished_at: finishedAt.toISOString(),
      source_count: NEWS_SOURCES.length,
      candidate_count: collectedItems.length,
      unique_candidate_count: new Set(collectedItems.map((item) => item.source_url)).size,
      top_count: topItems.length,
      upserted,
      archived,
      top_items: topItems.map((item) => ({
        rank: item.rank,
        title: item.title,
        source_name: item.source_name,
        source_url: item.source_url,
        heat_score: item.heat_score,
        topic_score: item.topic_score,
        topic_names: item.topic_names,
        company_key: item.company_key,
      })),
      source_results: sourceResults,
    }

    console.log(JSON.stringify(payload))
    return jsonResponse(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(JSON.stringify({ ok: false, error: message }))
    return jsonResponse({ ok: false, error: message }, 500)
  }
})
