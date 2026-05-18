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
