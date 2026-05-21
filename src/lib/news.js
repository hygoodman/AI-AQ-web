import { supabase } from './supabase.js'

const NEWS_FIELDS =
  'id,title,summary,source_name,source_url,published_at,fetched_at,batch_date,status,is_featured,rank,heat_score,created_at'

function getNewsTime(newsItem) {
  return newsItem.published_at || newsItem.fetched_at || newsItem.created_at || ''
}

function sortNewsByDateDesc(left, right) {
  return getNewsTime(right).localeCompare(getNewsTime(left))
}

function sortNewsByRankAndHeat(left, right) {
  const leftRank = Number.isFinite(left.rank) ? left.rank : Number.MAX_SAFE_INTEGER
  const rightRank = Number.isFinite(right.rank) ? right.rank : Number.MAX_SAFE_INTEGER

  if (leftRank !== rightRank) return leftRank - rightRank
  if ((right.heat_score || 0) !== (left.heat_score || 0)) return (right.heat_score || 0) - (left.heat_score || 0)
  return sortNewsByDateDesc(left, right)
}

export async function fetchPublishedNewsArchive() {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('news')
    .select(NEWS_FIELDS)
    .eq('status', 'published')
    .order('batch_date', { ascending: false })
    .order('rank', { ascending: true, nullsFirst: false })
    .order('heat_score', { ascending: false })

  if (error) {
    throw error
  }

  const groupedByDate = (data || []).reduce((groups, item) => {
    const batchDate = item.batch_date || '未知日期'
    if (!groups.has(batchDate)) groups.set(batchDate, [])
    groups.get(batchDate).push(item)
    return groups
  }, new Map())

  return [...groupedByDate.entries()]
    .sort(([leftDate], [rightDate]) => rightDate.localeCompare(leftDate))
    .map(([batchDate, items]) => ({
      batchDate,
      items: items.sort(sortNewsByRankAndHeat).slice(0, 5),
    }))
}
