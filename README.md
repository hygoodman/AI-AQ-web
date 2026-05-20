# AI 知识问答 Web MVP

这是从微信小程序版本改造出的轻量 Web 版本，目标是部署到 Vercel 后生成链接，方便同事直接在手机或电脑浏览器中使用。

当前 Web MVP 保留了核心功能：

- 今日练习
- 分类练习
- 答题反馈与结果页
- 错题本
- 收藏题目
- 练习记录
- 浏览器本地存储

不包含微信登录、微信小程序 API、小程序云开发。

## 本地运行

首次运行先安装依赖：

```bash
npm install
```

启动本地网页：

```bash
npm run dev
```

打开：

```bash
http://localhost:5173/
```

## 构建与检查

题库检查：

```bash
npm run check:questions
```

生产构建：

```bash
npm run build
```

完整验证：

```bash
npm run validate
```

Vercel 默认使用：

- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: `Vite`

项目已包含 `vercel.json`，Vercel 导入仓库后通常会自动识别。

## 提交到 GitHub

确认当前分支：

```bash
git branch
```

查看改动：

```bash
git status
git diff
```

提交：

```bash
git add .
git commit -m "Build Vercel web MVP"
git push -u origin web-vercel-mvp
```

## 部署到 Vercel

1. 将 `web-vercel-mvp` 分支推送到 GitHub。
2. 在 Vercel 新建项目，选择这个 GitHub 仓库。
3. 选择要部署的分支 `web-vercel-mvp`。
4. 保持构建命令为 `npm run build`，输出目录为 `dist`。
5. 部署完成后，把 Vercel 生成的链接发给同事即可。

## AI News Archive

首页包含 `AI News Archive` 板块，会从 Supabase `public.news` 读取 `status = 'published'` 的资讯，按 `batch_date` 从新到旧分组。最新日期默认展开，每天最多展示排名前 5 条。

前端需要在本地 `.env.local` 和 Vercel 环境变量里配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 数据库 migration

先在 Supabase SQL Editor 运行结构检查：

```sql
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'news'
order by ordinal_position;
```

再执行：

```sql
alter table public.news
  add column if not exists batch_date date,
  add column if not exists rank integer,
  add column if not exists heat_score numeric,
  add column if not exists summary text,
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists published_at timestamptz,
  add column if not exists created_at timestamptz default now(),
  add column if not exists fetched_at timestamptz default now(),
  add column if not exists status text default 'published';

create unique index if not exists news_source_url_unique on public.news (source_url);
create index if not exists news_batch_rank_idx on public.news (batch_date desc, rank asc);
```

同样的 SQL 已保存到 `supabase/migrations/202605190001_ai_news_daily_archive.sql`。

### 每日自动抓取

Edge Function 文件在 `supabase/functions/daily-ai-news/index.ts`，新闻源集中放在 `supabase/functions/_shared/news-sources.ts`。当前使用 RSS 源真实抓取，不使用 mock 数据，也不需要第三方新闻 API key。

函数服务端需要配置这些 Supabase Edge Function secrets：

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEWS_JOB_SECRET=
NEWS_TIME_ZONE=Asia/Shanghai
```

`SUPABASE_SERVICE_ROLE_KEY` 只能放在 Supabase Edge Function secrets 中，不能放到前端或 Vercel 浏览器环境变量里。

本地手动测试：

```bash
supabase functions serve daily-ai-news --env-file supabase/functions/.env.local
```

另开一个终端触发：

```bash
curl -X POST "http://127.0.0.1:54321/functions/v1/daily-ai-news" \
  -H "content-type: application/json" \
  -H "x-news-job-secret: your-secret" \
  -d '{"date":"2026-05-19"}'
```

只测试真实 RSS 抓取、去重、评分和 Top 5 结果，不写入数据库：

```bash
curl -X POST "http://127.0.0.1:54321/functions/v1/daily-ai-news" \
  -H "content-type: application/json" \
  -H "x-news-job-secret: your-secret" \
  -d '{"date":"2026-05-19","dryRun":true}'
```

部署函数：

```bash
supabase functions deploy daily-ai-news
supabase secrets set NEWS_JOB_SECRET=your-secret
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set NEWS_TIME_ZONE=Asia/Shanghai
```

Supabase hosted Edge Functions 默认已有 `SUPABASE_URL`。如果你的项目没有自动注入，也可以手动设置：

```bash
supabase secrets set SUPABASE_URL=https://your-project-ref.supabase.co
```

### Supabase Cron

在 Supabase SQL Editor 启用 `pg_cron` 和 `pg_net` 后，可每天定时调用 Edge Function。把 URL 和 secret 替换成自己的值：

```sql
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'daily-ai-news',
  '0 0 * * *',
  $$
  select net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/daily-ai-news',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'x-news-job-secret', 'your-secret'
    ),
    body := jsonb_build_object('trigger', 'cron')
  ) as request_id;
  $$
);
```

如果资讯没有出现，优先检查：

- Supabase `public.news` 是否已执行 migration。
- `source_url` 唯一索引是否创建成功。
- Edge Function logs 是否有 RSS 单源失败、环境变量缺失或 upsert 错误。
- `NEWS_JOB_SECRET` 是否和 Cron/manual curl 请求头一致。
- 前端 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 是否已配置并重新部署。
- `public.news` 是否允许 anon 读取 `status = 'published'` 的记录。

## 题库维护

题库文件：

- `data/questions.js`

手动删题或改题后，运行：

```bash
npm run check:questions
```

这个命令会检查：

- 题库文件是否能读取
- 每道题是否有必填字段
- 每道题是否有 4 个选项
- 正确答案是否存在于选项中
- 分类 ID 是否存在
- 题目 ID 是否重复
- 每个分类当前有多少题

完整检查命令：

```bash
npm run check
```

Web 端运行和构建前会自动从 `data/questions.js` 与 `data/categories.js` 生成浏览器可用的数据文件。日常维护仍然只需要改原始题库文件。
