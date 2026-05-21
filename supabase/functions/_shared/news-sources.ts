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

export type NewsInterestTheme = {
  name: string
  weight: number
  signals: string[]
}

// These themes keep the archive focused on learning and practical AI use,
// instead of ranking every company mention that happens to include an AI keyword.
export const AI_NEWS_INTEREST_THEMES: NewsInterestTheme[] = [
  {
    name: 'new-model',
    weight: 22,
    signals: [
      'new model',
      'model release',
      'model launch',
      'reasoning model',
      'multimodal model',
      'open-weight',
      'open weight',
      'gpt-',
      'claude 4',
      'claude opus',
      'claude sonnet',
      'gemini 2',
      'gemini 3',
      'llama 4',
      'qwen ',
      'deepseek v',
      'deepseek r',
    ],
  },
  {
    name: 'product-update',
    weight: 18,
    signals: [
      'new feature',
      'product update',
      'feature update',
      'rolling out',
      'rolls out',
      'launches',
      'released',
      'release',
      'preview',
      'generally available',
      'availability',
      'upgrades',
    ],
  },
  {
    name: 'tool-usability',
    weight: 18,
    signals: [
      'ai tool',
      'tools',
      'api',
      'app',
      'extension',
      'workspace',
      'automation',
      'available to',
      'workflow',
      'productivity',
      'users',
    ],
  },
  {
    name: 'agent',
    weight: 24,
    signals: [
      'agent',
      'agentic',
      'computer use',
      'tool use',
      'task automation',
      'orchestration',
      'mcp',
      'model context protocol',
    ],
  },
  {
    name: 'coding-tool',
    weight: 24,
    signals: [
      'coding',
      'code ',
      'developer',
      'programming',
      'codex',
      'claude code',
      'code assistant',
      'coding assistant',
      'ide',
      'github copilot',
    ],
  },
  {
    name: 'ai-search',
    weight: 22,
    signals: [
      'ai search',
      'search',
      'deep research',
      'research assistant',
      'answer engine',
      'browser',
    ],
  },
  {
    name: 'everyday-workflow',
    weight: 16,
    signals: [
      'workflow',
      'productivity',
      'workplace',
      'office',
      'creator',
      'everyday',
      'teams',
      'students',
      'learning',
    ],
  },
  {
    name: 'enterprise-adoption',
    weight: 14,
    signals: [
      'enterprise ai',
      'enterprise',
      'deploy',
      'deployment',
      'adoption',
      'case study',
      'customers',
      'integrate',
      'integration',
      'rollout',
    ],
  },
  {
    name: 'industry-shift',
    weight: 14,
    signals: [
      'inference',
      'gpu',
      'chip',
      'infrastructure',
      'open source',
      'regulation',
      'safety standard',
      'platform',
      'benchmark',
    ],
  },
]

export const AI_NEWS_LOW_INTEREST_SIGNALS = [
  'profit',
  'revenue',
  'valuation',
  'value soars',
  'funding',
  'raises ',
  'series ',
  'earnings',
  'stock ',
  'share price',
  'lawsuit',
  'trial',
  'jury',
  'rumor',
]

export type NewsPreference = {
  name: string
  weight: number
  signals: string[]
}

// Stories closer to hands-on learning and useful AI product changes
// should outrank general AI business coverage.
export const AI_NEWS_PREFERRED_STORIES: NewsPreference[] = [
  {
    name: 'coding-agent-product',
    weight: 34,
    signals: [
      'coding agent',
      'agent product',
      'agent products',
      'claude code',
      'codex',
      'github copilot',
      'coding assistant',
      'developer tool',
      'software development',
    ],
  },
  {
    name: 'usable-product-change',
    weight: 24,
    signals: [
      'product update',
      'new feature',
      'rolls out',
      'rolling out',
      'launches',
      'released',
      'generally available',
      'available to',
      'workflow',
      'workspace',
    ],
  },
  {
    name: 'everyday-ai-application',
    weight: 18,
    signals: [
      'ai search',
      'ai tool',
      'automation',
      'productivity',
      'workflows',
      'for users',
      'for developers',
      'for teams',
      'small businesses',
    ],
  },
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

// These broader searches are only used after the primary feeds cannot fill
// the daily archive with enough preferred AI learning/application stories.
export const EXPANDED_NEWS_SOURCES: NewsSource[] = [
  {
    name: 'AI Coding Tools Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28AI%20OR%20OpenAI%20OR%20Anthropic%20OR%20Claude%20OR%20Gemini%29%20%28Codex%20OR%20%22Claude%20Code%22%20OR%20%22coding%20agent%22%20OR%20%22AI%20coding%20tool%22%20OR%20Copilot%29&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 6,
    highAuthority: false,
    keywords: ['AI', 'Codex', 'Claude Code', 'coding agent', 'AI coding tool', 'Copilot'],
  },
  {
    name: 'AI Product Updates Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28OpenAI%20OR%20Anthropic%20OR%20Claude%20OR%20%22Google%20AI%22%20OR%20Gemini%20OR%20%22Microsoft%20Copilot%22%20OR%20DeepSeek%20OR%20%22Meta%20AI%22%29%20%28%22product%20update%22%20OR%20%22new%20feature%22%20OR%20%22AI%20tool%22%20OR%20workflow%20OR%20automation%29&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 6,
    highAuthority: false,
    keywords: ['AI', 'AI tool', 'product update', 'new feature', 'workflow', 'automation'],
  },
  {
    name: 'AI Agents Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28AI%20OR%20OpenAI%20OR%20Anthropic%20OR%20Gemini%29%20%28%22AI%20agent%22%20OR%20agentic%20OR%20%22agent%20product%22%20OR%20%22computer%20use%22%29&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 6,
    highAuthority: false,
    keywords: ['AI', 'AI agent', 'agentic', 'agent product', 'computer use'],
  },
]
