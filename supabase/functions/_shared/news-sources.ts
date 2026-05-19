export type NewsSource = {
  name: string
  feedUrl: string
  sourceWeight: number
  highAuthority: boolean
  keywords: string[]
}

export const AI_NEWS_KEYWORDS = [
  'AI',
  'artificial intelligence',
  'OpenAI',
  'ChatGPT',
  'Google AI',
  'Anthropic',
  'Claude',
  'Meta AI',
  'Microsoft Copilot',
  'Nvidia AI',
  'AI tools',
  'AI model',
]

export const NEWS_SOURCES: NewsSource[] = [
  {
    name: 'OpenAI News',
    feedUrl: 'https://openai.com/news/rss.xml',
    sourceWeight: 9,
    highAuthority: true,
    keywords: ['OpenAI', 'ChatGPT', 'AI model', 'Sora', 'GPT'],
  },
  {
    name: 'Google AI Blog',
    feedUrl: 'https://blog.google/technology/ai/rss/',
    sourceWeight: 9,
    highAuthority: true,
    keywords: ['Google AI', 'Gemini', 'DeepMind', 'AI model'],
  },
  {
    name: 'Anthropic News Search',
    feedUrl:
      'https://news.google.com/rss/search?q=Anthropic%20Claude%20AI&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 8,
    highAuthority: true,
    keywords: ['Anthropic', 'Claude', 'AI model'],
  },
  {
    name: 'Microsoft AI Blog',
    feedUrl: 'https://blogs.microsoft.com/ai/feed/',
    sourceWeight: 8,
    highAuthority: true,
    keywords: ['Microsoft Copilot', 'Copilot', 'Azure AI', 'AI tools'],
  },
  {
    name: 'Nvidia AI Blog',
    feedUrl: 'https://blogs.nvidia.com/blog/category/deep-learning/feed/',
    sourceWeight: 8,
    highAuthority: true,
    keywords: ['Nvidia AI', 'GPU', 'AI model', 'deep learning'],
  },
  {
    name: 'Meta AI News Search',
    feedUrl: 'https://news.google.com/rss/search?q=Meta%20AI%20Llama&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 7,
    highAuthority: true,
    keywords: ['Meta AI', 'Llama', 'AI model'],
  },
  {
    name: 'MIT Technology Review AI',
    feedUrl: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
    sourceWeight: 8,
    highAuthority: true,
    keywords: ['AI', 'artificial intelligence', 'AI tools', 'AI model'],
  },
  {
    name: 'TechCrunch AI',
    feedUrl: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    sourceWeight: 7,
    highAuthority: true,
    keywords: ['AI', 'artificial intelligence', 'OpenAI', 'Anthropic'],
  },
  {
    name: 'The Verge AI',
    feedUrl: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    sourceWeight: 7,
    highAuthority: true,
    keywords: ['AI', 'artificial intelligence', 'AI tools', 'AI model'],
  },
  {
    name: 'VentureBeat AI',
    feedUrl: 'https://venturebeat.com/category/ai/feed/',
    sourceWeight: 7,
    highAuthority: true,
    keywords: ['AI', 'artificial intelligence', 'enterprise AI', 'AI tools'],
  },
]
