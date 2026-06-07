// 工作流数据
const ALL_WF = [
    { title:"短视频创作者", desc:"AI 帮你从脚本到成片", tools:["ChatGPT","Kling 2.0","ElevenLabs","Opus Clip"], flow:"写脚本 → 生成视频 → 配音 → 剪辑分发", cats:["video","audio"] },
    { title:"独立开发者栈", desc:"全栈开发 + UI + 部署", tools:["Cursor","v0.dev","Replit Agent","Claude"], flow:"AI 编程 → UI 生成 → 部署 → Code Review", cats:["code"] },
    { title:"设计师工作流", desc:"从品牌到内容一站式", tools:["Midjourney","Ideogram 3.0","Canva AI","Adobe Firefly"], flow:"概念图 → Logo → 排版 → 商用", cats:["image"] },
    { title:"内容营销全链路", desc:"写作 + 配图 + SEO", tools:["Claude","DALL·E 3","Surfer SEO","Gamma"], flow:"长文创作 → 配图 → SEO 优化 → PPT", cats:["write"] },
    { title:"学术研究加速器", desc:"文献分析 + 论文写作", tools:["NotebookLM","Perplexity","Claude","Grammarly"], flow:"文献问答 → 事实核查 → 深度写作 → 润色", cats:["chat","write"] },
    { title:"播客/音频制作", desc:"语音合成 + BGM + 母带", tools:["Descript","ElevenLabs","Suno v4.5","LANDR"], flow:"录制编辑 → TTS 配音 → BGM → 母带", cats:["audio"] },
    { title:"数据分析到报告", desc:"数据抓取 + 分析 + 可视化", tools:["Browse AI","Julius AI","Claude","Gamma"], flow:"抓取数据 → AI 分析 → 写报告 → PPT", cats:["data"] },
    { title:"个人效率系统", desc:"AI 自动化日常流程", tools:["Make","Zapier","Raycast AI","Notion AI"], flow:"自动化配置 → 触发 → AI 处理 → 通知", cats:["auto"] },
    { title:"AI Agent 开发栈", desc:"搭建你自己的 AI Agent", tools:["Dify","Coze 扣子","LangGraph","CrewAI"], flow:"设计工作流 → 搭建 Agent → 部署发布", cats:["agent"] }
];;