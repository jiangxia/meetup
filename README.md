# AI酒馆 MVP 🍺

基于PromptX的AI酒馆演示系统，**极简MVP版本**，专注核心价值验证。

## 🎯 MVP核心目标
验证3个关键假设，5-8分钟演示流程：
1. **用户喜欢角色化AI对话吗？**
2. **AI记忆功能是否有吸引力？**  
3. **AI酒馆概念是否有趣？**

## 🚀 快速开始

### 前端启动
```bash
cd frontend/
# 直接打开 index.html 或
npm start
```

### 后端启动  
```bash
cd backend/
npm install
npm start
# 访问 http://localhost:3001
```

## 📁 项目结构 (极简版)

```
ai-tavern-mvp/
├── frontend/
│   ├── index.html          # 单页面应用
│   ├── style.css           # 酒馆主题样式
│   ├── app.js              # 所有前端逻辑
│   └── config.js           # API配置
└── backend/
    ├── server.js           # 单文件服务器
    ├── package.json        # 极简依赖
    ├── .env                # API密钥
    └── README.md           # 启动说明
```

## ⚡ 技术选型 (专业级MVP)

```javascript
const OptimizedTechStack = {
  前端: "HTML5 + TailwindCSS + Vanilla JS",
  后端: "Node.js + Express + LangChain.js",
  AI框架: "LangChain (ConversationChain + BufferMemory)",
  记忆系统: "LangChain Memory + PromptX MCP双重记忆",
  流式响应: "Server-Sent Events + 实时打字效果",
  部署: "本地运行 + Docker容器化"
}
```

## 📋 MVP演示流程

**5分钟演示脚本**：
1. **角色选择** (1分钟) - 选择Aria调酒师
2. **基础对话** (2分钟) - 表达工作压力
3. **记忆演示** (2分钟) - AI记住并回忆用户情况

## 🎯 MVP验证指标

### 核心假设验证
- **假设1**: 观众能感受角色差异
- **假设2**: 记忆演示获得"哇"反应  
- **假设3**: 有人询问如何使用

### 开发成功标准
- **总开发时间**: ≤ 12小时 (前端5.5h + 后端6.5h)
- **技术栈升级**: LangChain + TailwindCSS专业框架
- **演示效果**: 流式响应 + 双重记忆可视化
- **视觉质量**: 酒馆主题专业设计

详见：[MVP成功指标](./AI_Tavern_Tasks/MVP_Success_Metrics.md)

## 📁 任务文档 (已升级为专业版)

### 详细任务分解
- **前端详细任务**: [TailwindCSS前端详细任务分解](./AI_Tavern_Tasks/Frontend_Tasks/Epic0_前端基础设施/TailwindCSS_Frontend_Tasks.md)
- **后端详细任务**: [LangChain后端详细任务分解](./AI_Tavern_Tasks/Backend_Tasks/Epic0_后端基础设施/LangChain_Backend_Tasks.md)

### 概览文档
- **前端MVP概览**: [Frontend MVP Task](./AI_Tavern_Tasks/Frontend_Tasks/Epic0_前端基础设施/Story0.1_前端项目搭建/MVP_Task.md)
- **后端MVP概览**: [Backend MVP Updated](./AI_Tavern_Tasks/Backend_Tasks/Epic0_后端基础设施/MVP_Backend_Updated.md)
- **开发计划**: [开发计划和优先级](./AI_Tavern_Tasks/开发计划和优先级.md)
- **演示检查清单**: [演示检查清单](./AI_Tavern_Tasks/演示检查清单.md)

## ⚡ MVP vs 完整版

| 功能 | 专业版MVP | 说明 |
|------|----------|------|
| 前端 | TailwindCSS组件化 | 专业视觉 + 响应式 |
| 后端 | LangChain框架 | 流式响应 + 双重记忆 |
| 记忆 | LangChain + PromptX | 对话级 + 长期记忆 |
| 角色 | 动态激活3个 | MCP工具激活 |
| 演示 | 可视化记忆展示 | 震撼演示效果 |

## 🚀 专业级开发

```bash
# 1. 前端开发 (5.5小时)
# TailwindCSS + 酒馆主题 + 组件化架构
mkdir frontend && cd frontend
# 按照 TailwindCSS_Frontend_Tasks.md 执行

# 2. 后端开发 (6.5小时)  
mkdir backend && cd backend
npm init -y
npm install langchain @langchain/openai express cors helmet dotenv
# 按照 LangChain_Backend_Tasks.md 执行

# 3. 集成测试 (缓冲时间)
# 前后端联调 + 演示准备

# 总计：12小时完成专业级MVP！
```

## 🎯 技术升级价值

### 开发效率提升
- **LangChain框架**: 节省4小时AI开发时间
- **TailwindCSS框架**: 节省2小时UI开发时间  
- **专业工具链**: 减少调试和维护成本

### 演示效果增强
- **流式响应**: 实时打字效果，用户体验专业
- **双重记忆可视化**: 震撼的技术演示效果
- **酒馆主题设计**: 专业级视觉呈现

### 技术说服力
- **成熟框架**: 展示技术选型的专业性
- **架构设计**: 体现工程化思维
- **可扩展性**: 为后续发展奠定基础

---

**升级原则**: 专业工具 + 震撼演示 + 高效开发  
**开发模式**: 框架驱动的专业级原型