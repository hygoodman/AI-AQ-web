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
    weight: 34,
    signals: [
      'new model',
      'model release',
      'model launch',
      '新模型',
      '大模型',
      '模型发布',
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
      '发布',
      '上线',
      '更新',
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
      'ai 工具',
      '工具',
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
    weight: 30,
    signals: [
      'agent',
      '智能体',
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
      '编程',
      '代码',
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
      'ai 搜索',
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
      '工作流',
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
      '企业落地',
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
    name: 'model-release',
    weight: 64,
    signals: [
      'new model',
      '新模型',
      '大模型',
      '模型发布',
      'model release',
      'model launch',
      'introducing gemini',
      'introducing gpt',
      'introducing claude',
      'gemini 3.5',
      'gemini omni',
      'gpt-',
      'claude opus',
      'claude sonnet',
      'llama 4',
      'deepseek v',
      'deepseek r',
    ],
  },
  {
    name: 'agent-release',
    weight: 56,
    signals: [
      'new agent',
      '新智能体',
      '智能体发布',
      '智能体',
      'ai agent',
      'managed agents',
      'agent launch',
      'agent release',
      'agent product',
      'agent products',
      'agentic product',
      'agentic workflows',
      'computer use',
      'antigravity',
    ],
  },
  {
    name: 'coding-agent-product',
    weight: 34,
    signals: [
      'coding agent',
      '编程 agent',
      '编程智能体',
      '代码智能体',
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
      '产品更新',
      '新功能',
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
      'ai 搜索',
      'ai tool',
      'ai 工具',
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
    name: 'Official AI Model Releases Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28site%3Aopenai.com%20OR%20site%3Aanthropic.com%20OR%20site%3Ablog.google%20OR%20site%3Adeepmind.google%20OR%20site%3Aai.meta.com%20OR%20site%3Amicrosoft.com%29%20%28%22new%20model%22%20OR%20%22model%20release%22%20OR%20%22model%20launch%22%20OR%20%22Gemini%203.5%22%20OR%20%22Gemini%20Omni%22%20OR%20GPT%20OR%20Claude%20OR%20Llama%20OR%20DeepSeek%29&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 10,
    highAuthority: true,
    keywords: ['AI model', 'new model', 'model release', 'GPT', 'Claude', 'Gemini', 'Llama', 'DeepSeek'],
  },
  {
    name: 'Official AI Agent Releases Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28site%3Aopenai.com%20OR%20site%3Aanthropic.com%20OR%20site%3Ablog.google%20OR%20site%3Adeepmind.google%20OR%20site%3Aai.meta.com%20OR%20site%3Amicrosoft.com%29%20%28%22AI%20agent%22%20OR%20%22new%20agent%22%20OR%20%22managed%20agents%22%20OR%20agentic%20OR%20%22computer%20use%22%20OR%20Antigravity%20OR%20Codex%20OR%20%22Claude%20Code%22%29&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 10,
    highAuthority: true,
    keywords: ['AI agent', 'new agent', 'managed agents', 'agentic', 'computer use', 'Antigravity', 'Codex', 'Claude Code'],
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
export const FOCUSED_EXPANDED_NEWS_SOURCES: NewsSource[] = [
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

export const BROAD_EXPANDED_NEWS_SOURCES: NewsSource[] = [
  {
    name: 'Frontier AI Models Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28OpenAI%20OR%20Anthropic%20OR%20Google%20OR%20Gemini%20OR%20Meta%20OR%20Mistral%20OR%20xAI%20OR%20DeepSeek%20OR%20Qwen%29%20%28%22new%20AI%20model%22%20OR%20%22model%20release%22%20OR%20%22model%20launch%22%20OR%20%22latest%20model%22%20OR%20%22reasoning%20model%22%29&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 6,
    highAuthority: false,
    keywords: ['AI model', 'new AI model', 'model release', 'model launch', 'reasoning model'],
  },
  {
    name: 'AI Agent Products Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28OpenAI%20OR%20Anthropic%20OR%20Google%20OR%20Gemini%20OR%20Meta%20OR%20Microsoft%20OR%20xAI%20OR%20GitHub%29%20%28%22new%20AI%20agent%22%20OR%20%22agent%20product%22%20OR%20%22agent%20platform%22%20OR%20%22agentic%20workflow%22%20OR%20%22computer%20use%22%29&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 6,
    highAuthority: false,
    keywords: ['AI agent', 'agent product', 'agent platform', 'agentic workflow', 'computer use'],
  },
  {
    name: 'AI Developer Tools Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28GitHub%20OR%20Cursor%20OR%20Replit%20OR%20OpenAI%20OR%20Anthropic%20OR%20Google%20OR%20Claude%20OR%20Codex%29%20%28%22coding%20agent%22%20OR%20%22AI%20developer%20tool%22%20OR%20%22AI%20coding%20tool%22%20OR%20%22vibe%20coding%22%29&hl=en-US&gl=US&ceid=US:en',
    sourceWeight: 6,
    highAuthority: false,
    keywords: ['coding agent', 'AI developer tool', 'AI coding tool', 'vibe coding', 'Codex', 'Claude Code'],
  },
]

export const DOMESTIC_NEWS_SOURCES: NewsSource[] = [
  {
    name: 'China AI Models Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28AI%20OR%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%20OR%20%E5%A4%A7%E6%A8%A1%E5%9E%8B%29%20%28%E6%96%B0%E6%A8%A1%E5%9E%8B%20OR%20%E6%A8%A1%E5%9E%8B%E5%8F%91%E5%B8%83%20OR%20DeepSeek%20OR%20%E9%80%9A%E4%B9%89%20OR%20Kimi%20OR%20%E6%99%BA%E8%B0%B1%20OR%20%E8%B1%86%E5%8C%85%29&hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
    sourceWeight: 6,
    highAuthority: false,
    keywords: ['AI', '人工智能', '大模型', '新模型', '模型发布', 'DeepSeek', '通义', 'Kimi', '智谱', '豆包'],
  },
  {
    name: 'China AI Agents Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28AI%20OR%20%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%29%20%28AI%20Agent%20OR%20%E6%99%BA%E8%83%BD%E4%BD%93%20OR%20%E7%BC%96%E7%A8%8B%E6%99%BA%E8%83%BD%E4%BD%93%20OR%20%E5%B7%A5%E4%BD%9C%E6%B5%81%20OR%20%E4%BB%A3%E7%A0%81%E5%8A%A9%E6%89%8B%29&hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
    sourceWeight: 6,
    highAuthority: false,
    keywords: ['AI', '人工智能', 'AI Agent', '智能体', '编程智能体', '工作流', '代码助手'],
  },
  {
    name: 'China AI Media Search',
    feedUrl:
      'https://news.google.com/rss/search?q=%28site%3Aqbitai.com%20OR%20site%3Ajiqizhixin.com%20OR%20site%3A36kr.com%20OR%20site%3Aleiphone.com%29%20%28AI%20OR%20%E5%A4%A7%E6%A8%A1%E5%9E%8B%20OR%20%E6%99%BA%E8%83%BD%E4%BD%93%20OR%20%E6%96%B0%E6%A8%A1%E5%9E%8B%20OR%20%E5%B7%A5%E5%85%B7%29&hl=zh-CN&gl=CN&ceid=CN:zh-Hans',
    sourceWeight: 6,
    highAuthority: false,
    keywords: ['AI', '大模型', '智能体', '新模型', '工具', '编程'],
  },
]
