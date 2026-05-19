import { createClient } from 'npm:@supabase/supabase-js@2'
import { AI_NEWS_KEYWORDS, NEWS_SOURCES, type NewsSource } from '../_shared/news-sources.ts'

type RawNewsItem = {
  title: string
  summary: string
  source_name: string
  source_url: string
  published_at: string
  batch_date: string
  heat_score: number
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

function getNodeText(parent: Element, names: string[]) {
  const child = Array.from(parent.children).find((node) => names.includes(node.localName.toLowerCase()))
  return child?.textContent?.trim() || ''
}

function getItemLink(item: Element) {
  const atomLink = Array.from(item.children).find((node) => node.localName.toLowerCase() === 'link' && node.getAttribute('href'))
  if (atomLink?.getAttribute('href')) return atomLink.getAttribute('href') || ''
  return getNodeText(item, ['link', 'guid', 'id'])
}

function stripHtml(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, '')
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

function getFreshnessScore(publishedAt: Date, now: Date) {
  const ageHours = Math.max(0, (now.getTime() - publishedAt.getTime()) / 36e5)
  return Math.max(0, 30 - ageHours * 1.25)
}

function scoreItem(source: NewsSource, title: string, summary: string, publishedAt: Date, now: Date) {
  const searchableText = `${title} ${summary}`
  const sourceMatches = countKeywordMatches(searchableText, source.keywords)
  const globalMatches = countKeywordMatches(searchableText, AI_NEWS_KEYWORDS)
  return Number(
    (
      source.sourceWeight * 10 +
      getFreshnessScore(publishedAt, now) +
      Math.min(30, (sourceMatches * 5) + (globalMatches * 3)) +
      (source.highAuthority ? 12 : 0)
    ).toFixed(2)
  )
}

function isFreshEnough(publishedAt: Date, now: Date, batchDate: string) {
  if (getBatchDate(publishedAt) === batchDate) return true
  const ageHours = (now.getTime() - publishedAt.getTime()) / 36e5
  return ageHours >= 0 && ageHours <= 36
}

async function fetchSource(source: NewsSource, batchDate: string, now: Date): Promise<{ items: RawNewsItem[]; result: SourceResult }> {
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
    const doc = new DOMParser().parseFromString(xml, 'application/xml')
    if (doc.querySelector('parsererror')) throw new Error('Invalid RSS/XML feed')

    const nodes = Array.from(doc.querySelectorAll('item, entry'))
    result.fetched = nodes.length

    const items = nodes
      .map((node) => {
        const title = stripHtml(getNodeText(node, ['title']))
        const sourceUrl = normalizeUrl(getItemLink(node))
        const rawPublishedAt = getNodeText(node, ['pubdate', 'published', 'updated', 'date']) || now.toISOString()
        const publishedAt = new Date(rawPublishedAt)
        const rawSummary = getNodeText(node, ['description', 'summary', 'content', 'encoded'])
        const summary = buildSummary(rawSummary, title)

        if (!title || !sourceUrl || Number.isNaN(publishedAt.getTime())) return null
        if (!isFreshEnough(publishedAt, now, batchDate)) return null
        if (!countKeywordMatches(`${title} ${summary}`, [...AI_NEWS_KEYWORDS, ...source.keywords])) return null

        return {
          title,
          summary,
          source_name: source.name,
          source_url: sourceUrl,
          published_at: publishedAt.toISOString(),
          batch_date: batchDate,
          heat_score: scoreItem(source, title, summary, publishedAt, now),
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

  return [...byUrl.values()]
    .sort((left, right) => {
      if (right.heat_score !== left.heat_score) return right.heat_score - left.heat_score
      return right.published_at.localeCompare(left.published_at)
    })
    .slice(0, 5)
    .map((item, index) => ({
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
    const sourceResults: SourceResult[] = []
    const collectedItems: RawNewsItem[] = []

    for (const source of NEWS_SOURCES) {
      const { items, result } = await fetchSource(source, batchDate, startedAt)
      sourceResults.push(result)
      collectedItems.push(...items)
    }

    const topItems = selectTopItems(collectedItems)
    const supabase = createClient(requireEnv('SUPABASE_URL'), getServiceRoleKey(), {
      auth: { persistSession: false },
    })

    let upserted = 0
    if (topItems.length) {
      const { error: upsertError } = await supabase.from('news').upsert(topItems, {
        onConflict: 'source_url',
      })

      if (upsertError) throw upsertError
      upserted = topItems.length
    }

    const finishedAt = new Date()
    const payload = {
      ok: true,
      batch_date: batchDate,
      started_at: startedAt.toISOString(),
      finished_at: finishedAt.toISOString(),
      source_count: NEWS_SOURCES.length,
      candidate_count: collectedItems.length,
      unique_candidate_count: new Set(collectedItems.map((item) => item.source_url)).size,
      top_count: topItems.length,
      upserted,
      top_items: topItems.map((item) => ({
        rank: item.rank,
        title: item.title,
        source_name: item.source_name,
        source_url: item.source_url,
        heat_score: item.heat_score,
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
