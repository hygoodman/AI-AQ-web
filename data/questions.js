const questions = [
  {
    "id": "q_ai_basic_001",
    "categoryId": "ai_basic",
    "categoryName": "AI 基础知识",
    "difficulty": "easy",
    "type": "single",
    "question": "生成式 AI 主要指的是什么？",
    "options": [
      {
        "key": "A",
        "text": "只能用来搜索网页的工具"
      },
      {
        "key": "B",
        "text": "可以根据输入生成文本、图片、音频或视频等内容的 AI 技术"
      },
      {
        "key": "C",
        "text": "只能用于计算数学题的软件"
      },
      {
        "key": "D",
        "text": "只能由程序员使用的开发工具"
      }
    ],
    "answer": "B",
    "explanation": "生成式 AI 可以根据用户输入生成新的内容，比如文本、图片、音频、视频和代码。",
    "workExample": "你可以用生成式 AI 写文案、整理表格、生成图片提示词、修改邮件和分析评论数据。",
    "tags": [
      "生成式AI",
      "AI基础",
      "入门"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_ai_basic_002",
    "categoryId": "ai_basic",
    "categoryName": "AI 基础知识",
    "difficulty": "easy",
    "type": "single",
    "question": "大语言模型更擅长处理哪类任务？",
    "options": [
      {
        "key": "A",
        "text": "理解和生成自然语言内容"
      },
      {
        "key": "B",
        "text": "直接维修电脑硬件"
      },
      {
        "key": "C",
        "text": "保证所有回答永远正确"
      },
      {
        "key": "D",
        "text": "替用户自动完成线下工作"
      }
    ],
    "answer": "A",
    "explanation": "大语言模型擅长理解、总结、改写、生成和推理文字内容，但不代表它不会出错。",
    "workExample": "写邮件、总结会议、生成提纲、改写表达，都是大语言模型常见的办公用法。",
    "tags": [
      "大语言模型",
      "文本生成"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_ai_basic_003",
    "categoryId": "ai_basic",
    "categoryName": "AI 基础知识",
    "difficulty": "easy",
    "type": "single",
    "question": "AI 回答中常说的“幻觉”是什么意思？",
    "options": [
      {
        "key": "A",
        "text": "AI 运行速度变慢"
      },
      {
        "key": "B",
        "text": "AI 编造了看起来像真的内容"
      },
      {
        "key": "C",
        "text": "AI 只能回答图片问题"
      },
      {
        "key": "D",
        "text": "AI 自动删除了数据"
      }
    ],
    "answer": "B",
    "explanation": "AI 幻觉是指模型生成了不准确甚至不存在的信息，但表达得很像事实。",
    "workExample": "涉及数据、法律、医疗、政策和引用来源时，要用可靠资料二次核查。",
    "tags": [
      "幻觉",
      "事实核查"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_ai_basic_004",
    "categoryId": "ai_basic",
    "categoryName": "AI 基础知识",
    "difficulty": "easy",
    "type": "single",
    "question": "为什么给 AI 提供上下文很重要？",
    "options": [
      {
        "key": "A",
        "text": "可以让 AI 更了解任务背景和目标"
      },
      {
        "key": "B",
        "text": "可以让 AI 不需要任何指令"
      },
      {
        "key": "C",
        "text": "可以保证 AI 永远不出错"
      },
      {
        "key": "D",
        "text": "可以让 AI 自动联网搜索所有资料"
      }
    ],
    "answer": "A",
    "explanation": "上下文越清楚，AI 越容易判断你的目标、对象、限制条件和输出方式。",
    "workExample": "让 AI 写活动文案时，补充产品、用户、渠道和活动目标，结果通常更可用。",
    "tags": [
      "上下文",
      "任务描述"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_ai_basic_005",
    "categoryId": "ai_basic",
    "categoryName": "AI 基础知识",
    "difficulty": "easy",
    "type": "single",
    "question": "使用 AI 时，下面哪种态度更合理？",
    "options": [
      {
        "key": "A",
        "text": "完全照搬 AI 的全部输出"
      },
      {
        "key": "B",
        "text": "把 AI 当作辅助工具，并进行人工判断"
      },
      {
        "key": "C",
        "text": "只要 AI 说了就一定正确"
      },
      {
        "key": "D",
        "text": "让 AI 代替所有专业决策"
      }
    ],
    "answer": "B",
    "explanation": "AI 很适合辅助生成、整理和启发，但重要内容仍需要人工判断和复核。",
    "workExample": "发布商业文案前，可以先让 AI 出草稿，再由人检查事实、品牌语气和合规风险。",
    "tags": [
      "AI常识",
      "人工审核"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_prompt_001",
    "categoryId": "prompt",
    "categoryName": "提示词技巧",
    "difficulty": "easy",
    "type": "single",
    "question": "下面哪一种提示词写法更容易让 AI 输出可用结果？",
    "options": [
      {
        "key": "A",
        "text": "帮我写一下"
      },
      {
        "key": "B",
        "text": "随便写一个"
      },
      {
        "key": "C",
        "text": "请按照目标、背景、要求、格式四部分输出"
      },
      {
        "key": "D",
        "text": "你自己看着办"
      }
    ],
    "answer": "C",
    "explanation": "清晰的提示词通常包含目标、背景、具体要求和输出格式，AI 更容易理解任务。",
    "workExample": "写短视频脚本时，可以告诉 AI 产品、目标用户、视频时长、风格和输出格式。",
    "tags": [
      "提示词",
      "输出格式"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_prompt_002",
    "categoryId": "prompt",
    "categoryName": "提示词技巧",
    "difficulty": "easy",
    "type": "single",
    "question": "想让 AI 输出表格，提示词中最好补充什么？",
    "options": [
      {
        "key": "A",
        "text": "只说“整理一下”"
      },
      {
        "key": "B",
        "text": "明确表格列名和每列含义"
      },
      {
        "key": "C",
        "text": "让 AI 自己决定所有内容"
      },
      {
        "key": "D",
        "text": "不提供任何原始资料"
      }
    ],
    "answer": "B",
    "explanation": "明确列名、字段含义和输出格式，可以减少返工，让结果更容易复制使用。",
    "workExample": "例如要求输出“用户痛点、对应卖点、推荐标题、适用渠道”四列。",
    "tags": [
      "表格",
      "结构化输出"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_prompt_003",
    "categoryId": "prompt",
    "categoryName": "提示词技巧",
    "difficulty": "easy",
    "type": "single",
    "question": "让 AI 扮演角色的主要作用是什么？",
    "options": [
      {
        "key": "A",
        "text": "限制 AI 只能说一句话"
      },
      {
        "key": "B",
        "text": "帮助 AI 按某种专业视角和语气回答"
      },
      {
        "key": "C",
        "text": "让 AI 跳过任务说明"
      },
      {
        "key": "D",
        "text": "保证内容一定没有错误"
      }
    ],
    "answer": "B",
    "explanation": "角色设定可以帮助 AI 选择更合适的视角、判断标准和表达方式。",
    "workExample": "你可以让 AI 扮演“资深电商运营”，来优化商品详情页卖点。",
    "tags": [
      "角色设定",
      "专业视角"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_prompt_004",
    "categoryId": "prompt",
    "categoryName": "提示词技巧",
    "difficulty": "easy",
    "type": "single",
    "question": "如果 AI 第一次回答不理想，最好的做法通常是？",
    "options": [
      {
        "key": "A",
        "text": "直接放弃"
      },
      {
        "key": "B",
        "text": "补充限制条件和修改方向继续迭代"
      },
      {
        "key": "C",
        "text": "删除所有背景信息"
      },
      {
        "key": "D",
        "text": "只回复“重写”两个字"
      }
    ],
    "answer": "B",
    "explanation": "AI 输出可以通过追问和补充要求持续优化，具体反馈越清楚，修改越稳定。",
    "workExample": "你可以说“语气再口语化一点，标题控制在 16 字内，增加 3 个版本”。",
    "tags": [
      "迭代",
      "修改要求"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_prompt_005",
    "categoryId": "prompt",
    "categoryName": "提示词技巧",
    "difficulty": "easy",
    "type": "single",
    "question": "给 AI 示例的好处是什么？",
    "options": [
      {
        "key": "A",
        "text": "让 AI 模仿你需要的格式和风格"
      },
      {
        "key": "B",
        "text": "让 AI 不需要回答问题"
      },
      {
        "key": "C",
        "text": "让 AI 自动知道所有事实"
      },
      {
        "key": "D",
        "text": "让 AI 只能输出英文"
      }
    ],
    "answer": "A",
    "explanation": "示例可以让 AI 更直观地理解你想要的结构、语气、长度和表达方式。",
    "workExample": "做标题改写时，给 2 到 3 个喜欢的标题示例，AI 更容易贴近你的风格。",
    "tags": [
      "示例",
      "风格模仿"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_office_001",
    "categoryId": "office",
    "categoryName": "AI 办公效率",
    "difficulty": "easy",
    "type": "single",
    "question": "用 AI 写工作邮件时，最好先提供什么？",
    "options": [
      {
        "key": "A",
        "text": "收件人、目的、关键信息和语气要求"
      },
      {
        "key": "B",
        "text": "只写“帮我写邮件”"
      },
      {
        "key": "C",
        "text": "只提供一个表情"
      },
      {
        "key": "D",
        "text": "完全不说明背景"
      }
    ],
    "answer": "A",
    "explanation": "邮件需要明确对象、目的、事实信息和语气，否则很容易写得空泛。",
    "workExample": "给 AI 说明“发给客户、通知延期、语气诚恳、附补偿方案”，邮件会更贴近真实场景。",
    "tags": [
      "邮件",
      "办公"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_office_002",
    "categoryId": "office",
    "categoryName": "AI 办公效率",
    "difficulty": "easy",
    "type": "single",
    "question": "让 AI 总结会议纪要时，哪种输出结构更实用？",
    "options": [
      {
        "key": "A",
        "text": "参会人、核心结论、待办事项、负责人、截止时间"
      },
      {
        "key": "B",
        "text": "只输出一段长文"
      },
      {
        "key": "C",
        "text": "只输出会议标题"
      },
      {
        "key": "D",
        "text": "只输出随机观点"
      }
    ],
    "answer": "A",
    "explanation": "会议纪要的关键是让后续行动清楚，待办、负责人和时间尤其重要。",
    "workExample": "会议结束后把语音转写稿给 AI，让它整理成待办清单，可以显著节省时间。",
    "tags": [
      "会议纪要",
      "待办"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_office_003",
    "categoryId": "office",
    "categoryName": "AI 办公效率",
    "difficulty": "easy",
    "type": "single",
    "question": "用 AI 写周报时，最有帮助的输入是什么？",
    "options": [
      {
        "key": "A",
        "text": "本周完成事项、数据、问题和下周计划"
      },
      {
        "key": "B",
        "text": "只说“写得高级点”"
      },
      {
        "key": "C",
        "text": "只输入公司名"
      },
      {
        "key": "D",
        "text": "不提供任何工作内容"
      }
    ],
    "answer": "A",
    "explanation": "周报需要基于真实工作信息，AI 更适合帮你组织结构和优化表达。",
    "workExample": "先列出本周 5 个事项，再让 AI 按“进展、结果、风险、计划”整理。",
    "tags": [
      "周报",
      "表达优化"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_office_004",
    "categoryId": "office",
    "categoryName": "AI 办公效率",
    "difficulty": "easy",
    "type": "single",
    "question": "AI 做资料分析前，用户最好先说明什么？",
    "options": [
      {
        "key": "A",
        "text": "分析目标和希望得到的结论类型"
      },
      {
        "key": "B",
        "text": "让 AI 随机发挥"
      },
      {
        "key": "C",
        "text": "只要求字数越多越好"
      },
      {
        "key": "D",
        "text": "只要求语气活泼"
      }
    ],
    "answer": "A",
    "explanation": "分析目标决定 AI 应该看哪些信息、提炼什么重点，以及如何组织结论。",
    "workExample": "分析用户评论时，可以要求 AI 提炼高频问题、购买顾虑和可优化卖点。",
    "tags": [
      "资料分析",
      "目标"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_office_005",
    "categoryId": "office",
    "categoryName": "AI 办公效率",
    "difficulty": "easy",
    "type": "single",
    "question": "让 AI 生成 PPT 大纲时，最好包含什么？",
    "options": [
      {
        "key": "A",
        "text": "汇报对象、主题、页数、重点和风格"
      },
      {
        "key": "B",
        "text": "只说“做个 PPT”"
      },
      {
        "key": "C",
        "text": "只给一个颜色"
      },
      {
        "key": "D",
        "text": "只让 AI 输出图片"
      }
    ],
    "answer": "A",
    "explanation": "PPT 大纲需要围绕受众和汇报目的组织信息，页数和重点能帮助控制结构。",
    "workExample": "做项目复盘 PPT 时，可以要求按“目标、过程、数据、问题、改进”生成 8 页大纲。",
    "tags": [
      "PPT",
      "大纲"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_marketing_001",
    "categoryId": "marketing",
    "categoryName": "AI 营销运营",
    "difficulty": "easy",
    "type": "single",
    "question": "让 AI 写社媒文案时，哪项信息最关键？",
    "options": [
      {
        "key": "A",
        "text": "产品卖点、目标用户、平台和文案风格"
      },
      {
        "key": "B",
        "text": "只告诉 AI 今天星期几"
      },
      {
        "key": "C",
        "text": "只要求越长越好"
      },
      {
        "key": "D",
        "text": "不说明发布场景"
      }
    ],
    "answer": "A",
    "explanation": "社媒文案要贴合平台、用户和目标动作，缺少这些信息会变得泛泛而谈。",
    "workExample": "小红书、视频号和公众号的文案节奏不同，提示词里要说明渠道。",
    "tags": [
      "社媒",
      "文案"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_marketing_002",
    "categoryId": "marketing",
    "categoryName": "AI 营销运营",
    "difficulty": "easy",
    "type": "single",
    "question": "用 AI 提炼用户痛点时，最好输入什么材料？",
    "options": [
      {
        "key": "A",
        "text": "用户评论、客服记录或调研反馈"
      },
      {
        "key": "B",
        "text": "随机广告语"
      },
      {
        "key": "C",
        "text": "空白内容"
      },
      {
        "key": "D",
        "text": "只输入产品价格"
      }
    ],
    "answer": "A",
    "explanation": "痛点来自真实用户表达，AI 可以帮你从评论和反馈中归纳高频问题。",
    "workExample": "把电商差评和咨询记录给 AI，它可以整理出用户最担心的购买障碍。",
    "tags": [
      "用户痛点",
      "评论分析"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_marketing_003",
    "categoryId": "marketing",
    "categoryName": "AI 营销运营",
    "difficulty": "easy",
    "type": "single",
    "question": "AI 生成广告标题时，为什么要让它给多个版本？",
    "options": [
      {
        "key": "A",
        "text": "方便比较不同角度并筛选"
      },
      {
        "key": "B",
        "text": "为了让内容更混乱"
      },
      {
        "key": "C",
        "text": "为了避免人工判断"
      },
      {
        "key": "D",
        "text": "为了保证每个标题都能爆火"
      }
    ],
    "answer": "A",
    "explanation": "多个版本可以覆盖利益点、痛点、场景、数字化表达等不同方向，便于筛选。",
    "workExample": "可以要求 AI 输出 10 个标题，并按“痛点型、利益型、场景型”分组。",
    "tags": [
      "广告标题",
      "多版本"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_marketing_004",
    "categoryId": "marketing",
    "categoryName": "AI 营销运营",
    "difficulty": "easy",
    "type": "single",
    "question": "用 AI 做竞品分析时，不应该怎么做？",
    "options": [
      {
        "key": "A",
        "text": "把 AI 输出当成唯一事实来源"
      },
      {
        "key": "B",
        "text": "提供竞品资料和对比维度"
      },
      {
        "key": "C",
        "text": "要求输出表格"
      },
      {
        "key": "D",
        "text": "让 AI 标出待核查信息"
      }
    ],
    "answer": "A",
    "explanation": "竞品分析涉及事实和数据，AI 可以辅助整理，但来源必须核查。",
    "workExample": "你可以让 AI 先产出对比框架，再人工补充官网、店铺和公开资料。",
    "tags": [
      "竞品分析",
      "事实核查"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_marketing_005",
    "categoryId": "marketing",
    "categoryName": "AI 营销运营",
    "difficulty": "easy",
    "type": "single",
    "question": "短视频脚本提示词中，哪项最有利于控制结果？",
    "options": [
      {
        "key": "A",
        "text": "视频时长、目标用户、产品卖点、镜头结构"
      },
      {
        "key": "B",
        "text": "只说“拍一个爆款”"
      },
      {
        "key": "C",
        "text": "只输入产品名"
      },
      {
        "key": "D",
        "text": "只要求押韵"
      }
    ],
    "answer": "A",
    "explanation": "短视频脚本需要控制节奏、镜头、卖点和目标用户，信息越明确越容易落地。",
    "workExample": "可以要求 AI 按“开头钩子、痛点、解决方案、行动引导”输出。",
    "tags": [
      "短视频",
      "脚本"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_image_001",
    "categoryId": "image",
    "categoryName": "AI 图片生成",
    "difficulty": "easy",
    "type": "single",
    "question": "图片提示词中通常最应该描述什么？",
    "options": [
      {
        "key": "A",
        "text": "主体、场景、风格、光线和构图"
      },
      {
        "key": "B",
        "text": "只写“好看一点”"
      },
      {
        "key": "C",
        "text": "只输入一个标点"
      },
      {
        "key": "D",
        "text": "完全不说明画面内容"
      }
    ],
    "answer": "A",
    "explanation": "图片生成需要清楚描述画面元素，主体、场景、风格和光线会直接影响结果。",
    "workExample": "生成海报图时，可以说明产品主体、背景场景、配色、镜头角度和画面比例。",
    "tags": [
      "图片提示词",
      "构图"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_image_002",
    "categoryId": "image",
    "categoryName": "AI 图片生成",
    "difficulty": "easy",
    "type": "single",
    "question": "负面提示词的主要作用是什么？",
    "options": [
      {
        "key": "A",
        "text": "说明不希望画面出现什么"
      },
      {
        "key": "B",
        "text": "让图片变成纯文字"
      },
      {
        "key": "C",
        "text": "自动提高网速"
      },
      {
        "key": "D",
        "text": "删除所有主体"
      }
    ],
    "answer": "A",
    "explanation": "负面提示词用于减少不想要的元素、风格或常见问题。",
    "workExample": "例如生成产品图时，可以加入“不要变形、不要多余文字、不要低清晰度”。",
    "tags": [
      "负面提示词",
      "图片生成"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_image_003",
    "categoryId": "image",
    "categoryName": "AI 图片生成",
    "difficulty": "easy",
    "type": "single",
    "question": "想让 AI 图片更适合电商主图，提示词应强调什么？",
    "options": [
      {
        "key": "A",
        "text": "产品清晰、背景干净、卖点突出"
      },
      {
        "key": "B",
        "text": "画面越复杂越好"
      },
      {
        "key": "C",
        "text": "主体越小越好"
      },
      {
        "key": "D",
        "text": "文字越多越好"
      }
    ],
    "answer": "A",
    "explanation": "电商图重点是让用户看清产品和卖点，画面不能喧宾夺主。",
    "workExample": "可以要求“白色简洁背景、产品居中、细节清晰、商业摄影质感”。",
    "tags": [
      "电商图",
      "产品"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_image_004",
    "categoryId": "image",
    "categoryName": "AI 图片生成",
    "difficulty": "easy",
    "type": "single",
    "question": "参考图在图片生成中的常见作用是什么？",
    "options": [
      {
        "key": "A",
        "text": "帮助模型理解主体、风格或构图方向"
      },
      {
        "key": "B",
        "text": "保证生成结果完全一样"
      },
      {
        "key": "C",
        "text": "让提示词不再需要文字"
      },
      {
        "key": "D",
        "text": "自动解决所有版权问题"
      }
    ],
    "answer": "A",
    "explanation": "参考图可以提供视觉方向，但生成结果仍会受模型能力和提示词影响。",
    "workExample": "做品牌视觉延展时，参考图可以帮助保持配色、风格和画面气质。",
    "tags": [
      "参考图",
      "视觉风格"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_image_005",
    "categoryId": "image",
    "categoryName": "AI 图片生成",
    "difficulty": "easy",
    "type": "single",
    "question": "控制画面比例有什么用？",
    "options": [
      {
        "key": "A",
        "text": "让图片适配海报、封面、详情页等不同场景"
      },
      {
        "key": "B",
        "text": "让图片一定没有瑕疵"
      },
      {
        "key": "C",
        "text": "让 AI 自动写文案"
      },
      {
        "key": "D",
        "text": "让图片只能黑白显示"
      }
    ],
    "answer": "A",
    "explanation": "不同平台和用途需要不同画面比例，提前指定可以减少后期裁切。",
    "workExample": "公众号封面、短视频封面和电商详情页通常需要不同尺寸比例。",
    "tags": [
      "画面比例",
      "适配"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_video_001",
    "categoryId": "video",
    "categoryName": "AI 视频生成",
    "difficulty": "easy",
    "type": "single",
    "question": "视频提示词比图片提示词通常更需要补充什么？",
    "options": [
      {
        "key": "A",
        "text": "动作、镜头运动和时间变化"
      },
      {
        "key": "B",
        "text": "只补充一个颜色"
      },
      {
        "key": "C",
        "text": "只补充文件名"
      },
      {
        "key": "D",
        "text": "完全不用描述场景"
      }
    ],
    "answer": "A",
    "explanation": "视频有时间维度，需要描述人物动作、镜头移动、节奏和场景变化。",
    "workExample": "例如“镜头缓慢推进，人物拿起产品微笑展示，背景光线柔和”。",
    "tags": [
      "视频提示词",
      "镜头"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_video_002",
    "categoryId": "video",
    "categoryName": "AI 视频生成",
    "difficulty": "easy",
    "type": "single",
    "question": "分镜写法的主要价值是什么？",
    "options": [
      {
        "key": "A",
        "text": "把视频拆成多个清楚的镜头段落"
      },
      {
        "key": "B",
        "text": "让视频不需要主题"
      },
      {
        "key": "C",
        "text": "让所有画面随机变化"
      },
      {
        "key": "D",
        "text": "让视频只保留声音"
      }
    ],
    "answer": "A",
    "explanation": "分镜能让每个镜头的画面、动作、时长和目的更明确，方便生成和修改。",
    "workExample": "广告视频可以拆成“痛点、产品出现、功能演示、行动引导”四个分镜。",
    "tags": [
      "分镜",
      "短视频"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_video_003",
    "categoryId": "video",
    "categoryName": "AI 视频生成",
    "difficulty": "easy",
    "type": "single",
    "question": "视频生成中“场景一致性”指什么？",
    "options": [
      {
        "key": "A",
        "text": "不同镜头中的人物、环境和物体保持连贯"
      },
      {
        "key": "B",
        "text": "每一帧都换一个主题"
      },
      {
        "key": "C",
        "text": "只生成静态图片"
      },
      {
        "key": "D",
        "text": "画面必须没有颜色"
      }
    ],
    "answer": "A",
    "explanation": "场景一致性是指视频前后画面不突兀，人物、产品、环境和风格尽量保持统一。",
    "workExample": "做产品展示视频时，要避免上一秒是黑色水杯，下一秒突然变成白色水杯。",
    "tags": [
      "场景一致性",
      "连贯性"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_video_004",
    "categoryId": "video",
    "categoryName": "AI 视频生成",
    "difficulty": "easy",
    "type": "single",
    "question": "描述人物表情和动作的好处是什么？",
    "options": [
      {
        "key": "A",
        "text": "让画面表现更符合剧情或广告目的"
      },
      {
        "key": "B",
        "text": "让视频自动变长"
      },
      {
        "key": "C",
        "text": "让声音更大"
      },
      {
        "key": "D",
        "text": "让模型不需要主体"
      }
    ],
    "answer": "A",
    "explanation": "表情和动作会影响视频情绪和叙事，让画面更有方向。",
    "workExample": "例如“人物惊喜地看向产品，然后点头微笑”，比“一个人在房间里”更明确。",
    "tags": [
      "人物动作",
      "表情"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_video_005",
    "categoryId": "video",
    "categoryName": "AI 视频生成",
    "difficulty": "easy",
    "type": "single",
    "question": "AI 视频常见翻车问题不包括哪一项？",
    "options": [
      {
        "key": "A",
        "text": "人物手部变形"
      },
      {
        "key": "B",
        "text": "产品结构变化"
      },
      {
        "key": "C",
        "text": "场景前后不一致"
      },
      {
        "key": "D",
        "text": "提示词写得太清楚"
      }
    ],
    "answer": "D",
    "explanation": "提示词写清楚通常会改善结果，常见问题反而是动作、结构和一致性控制不好。",
    "workExample": "生成前先写清楚主体细节、镜头运动和禁止变化的内容，可以减少翻车。",
    "tags": [
      "翻车问题",
      "质量控制"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_coding_001",
    "categoryId": "coding",
    "categoryName": "AI 编程辅助",
    "difficulty": "easy",
    "type": "single",
    "question": "让 AI 修改代码前，最好提供什么？",
    "options": [
      {
        "key": "A",
        "text": "目标、相关文件、报错信息和验收标准"
      },
      {
        "key": "B",
        "text": "只说“改好”"
      },
      {
        "key": "C",
        "text": "只提供项目名"
      },
      {
        "key": "D",
        "text": "不说明问题"
      }
    ],
    "answer": "A",
    "explanation": "代码任务需要明确问题、范围和判断完成的标准，AI 才不容易改偏。",
    "workExample": "让 AI 修 bug 时，贴出复现步骤、错误日志和期望行为，会更高效。",
    "tags": [
      "编程辅助",
      "任务说明"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_coding_002",
    "categoryId": "coding",
    "categoryName": "AI 编程辅助",
    "difficulty": "easy",
    "type": "single",
    "question": "为什么复杂开发任务要拆分模块？",
    "options": [
      {
        "key": "A",
        "text": "降低风险，便于逐步验证"
      },
      {
        "key": "B",
        "text": "让文件数量越多越好"
      },
      {
        "key": "C",
        "text": "避免写验收标准"
      },
      {
        "key": "D",
        "text": "让 AI 随机决定功能"
      }
    ],
    "answer": "A",
    "explanation": "拆分任务可以减少一次性改动范围，让每一步都更容易检查和回滚。",
    "workExample": "先做页面骨架，再做数据，再做交互，比一次性做完整系统更稳。",
    "tags": [
      "任务拆分",
      "开发流程"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_coding_003",
    "categoryId": "coding",
    "categoryName": "AI 编程辅助",
    "difficulty": "easy",
    "type": "single",
    "question": "让 AI 读代码时，最有效的问题通常是？",
    "options": [
      {
        "key": "A",
        "text": "请说明这个模块的数据流和关键入口"
      },
      {
        "key": "B",
        "text": "这个项目怎么样"
      },
      {
        "key": "C",
        "text": "随便看看"
      },
      {
        "key": "D",
        "text": "你猜哪里有问题"
      }
    ],
    "answer": "A",
    "explanation": "具体问题能引导 AI 聚焦入口、数据流、状态和风险点，回答更有用。",
    "workExample": "接手项目时，可以先让 AI 找出路由、状态管理和核心业务模块。",
    "tags": [
      "读代码",
      "数据流"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_coding_004",
    "categoryId": "coding",
    "categoryName": "AI 编程辅助",
    "difficulty": "easy",
    "type": "single",
    "question": "验收标准的作用是什么？",
    "options": [
      {
        "key": "A",
        "text": "说明怎样才算完成"
      },
      {
        "key": "B",
        "text": "让任务更模糊"
      },
      {
        "key": "C",
        "text": "替代所有测试"
      },
      {
        "key": "D",
        "text": "只用于写标题"
      }
    ],
    "answer": "A",
    "explanation": "验收标准能帮助 AI 和开发者对齐结果，减少“看起来做了但不能用”的情况。",
    "workExample": "例如“点击分类进入答题页，完成 5 题后显示正确率，刷新后错题仍保留”。",
    "tags": [
      "验收标准",
      "测试"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_coding_005",
    "categoryId": "coding",
    "categoryName": "AI 编程辅助",
    "difficulty": "easy",
    "type": "single",
    "question": "为了避免 AI 改坏项目，哪种做法更好？",
    "options": [
      {
        "key": "A",
        "text": "限定修改范围并运行检查"
      },
      {
        "key": "B",
        "text": "让 AI 重写全部项目"
      },
      {
        "key": "C",
        "text": "不看改动直接发布"
      },
      {
        "key": "D",
        "text": "删除所有测试"
      }
    ],
    "answer": "A",
    "explanation": "限定范围、逐步修改和运行检查，可以降低引入新问题的概率。",
    "workExample": "可以要求 AI 只修改答题页和工具函数，并在完成后检查语法和页面配置。",
    "tags": [
      "安全开发",
      "检查"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_safety_001",
    "categoryId": "safety",
    "categoryName": "AI 安全与常识",
    "difficulty": "easy",
    "type": "single",
    "question": "下面哪类信息不应该随便输入 AI 工具？",
    "options": [
      {
        "key": "A",
        "text": "身份证号、密码、客户隐私等敏感信息"
      },
      {
        "key": "B",
        "text": "公开的产品介绍"
      },
      {
        "key": "C",
        "text": "普通学习问题"
      },
      {
        "key": "D",
        "text": "通用写作要求"
      }
    ],
    "answer": "A",
    "explanation": "敏感信息一旦输入第三方工具，可能带来隐私和安全风险。",
    "workExample": "处理客户资料时，应先脱敏，再让 AI 做分类或总结。",
    "tags": [
      "隐私",
      "安全"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_safety_002",
    "categoryId": "safety",
    "categoryName": "AI 安全与常识",
    "difficulty": "easy",
    "type": "single",
    "question": "API Key 为什么不能放在小程序前端？",
    "options": [
      {
        "key": "A",
        "text": "容易被别人看到并盗用"
      },
      {
        "key": "B",
        "text": "会让按钮变小"
      },
      {
        "key": "C",
        "text": "会让页面颜色改变"
      },
      {
        "key": "D",
        "text": "会让题目数量减少"
      }
    ],
    "answer": "A",
    "explanation": "前端代码可能被查看或逆向，API Key 暴露后可能产生费用和安全风险。",
    "workExample": "正确做法是把 Key 放在云函数或后端，由前端请求后端接口。",
    "tags": [
      "API Key",
      "后端"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_safety_003",
    "categoryId": "safety",
    "categoryName": "AI 安全与常识",
    "difficulty": "easy",
    "type": "single",
    "question": "医疗、法律、投资类 AI 建议应该如何处理？",
    "options": [
      {
        "key": "A",
        "text": "只当参考，并咨询专业人士"
      },
      {
        "key": "B",
        "text": "直接照做"
      },
      {
        "key": "C",
        "text": "转发给所有人"
      },
      {
        "key": "D",
        "text": "不用看来源"
      }
    ],
    "answer": "A",
    "explanation": "高风险领域的错误建议可能造成严重后果，必须谨慎核查。",
    "workExample": "AI 可以帮你整理问题清单，但最终判断应交给医生、律师或持牌专业人士。",
    "tags": [
      "高风险领域",
      "专业判断"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_safety_004",
    "categoryId": "safety",
    "categoryName": "AI 安全与常识",
    "difficulty": "easy",
    "type": "single",
    "question": "使用 AI 生成商业图片时，需要注意什么？",
    "options": [
      {
        "key": "A",
        "text": "版权、授权、肖像和品牌合规风险"
      },
      {
        "key": "B",
        "text": "只要好看就能随便商用"
      },
      {
        "key": "C",
        "text": "不需要检查人物和商标"
      },
      {
        "key": "D",
        "text": "必须所有图都公开发布"
      }
    ],
    "answer": "A",
    "explanation": "商业使用要关注版权、素材来源、人物肖像、商标和平台规则。",
    "workExample": "用于广告投放前，最好确认生成平台的商用规则，并人工检查图片细节。",
    "tags": [
      "版权",
      "商用"
    ],
    "createdAt": "2026-05-14"
  },
  {
    "id": "q_safety_005",
    "categoryId": "safety",
    "categoryName": "AI 安全与常识",
    "difficulty": "easy",
    "type": "single",
    "question": "判断 AI 回答是否可靠，下面哪种做法更好？",
    "options": [
      {
        "key": "A",
        "text": "查看来源并用可靠资料交叉验证"
      },
      {
        "key": "B",
        "text": "只看语气是否肯定"
      },
      {
        "key": "C",
        "text": "只看回答是否很长"
      },
      {
        "key": "D",
        "text": "只看排版是否整齐"
      }
    ],
    "answer": "A",
    "explanation": "AI 回答看起来专业不代表一定正确，可靠来源和交叉验证更重要。",
    "workExample": "做行业报告时，可以让 AI 生成框架，但关键数据要回到官方或可信来源核查。",
    "tags": [
      "事实核查",
      "可靠性"
    ],
    "createdAt": "2026-05-14"
  }
]

module.exports = {
  questions,
}
