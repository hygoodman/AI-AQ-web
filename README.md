# AI 知识问答小程序

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
