# AI酒馆 🍺 - PromptX双重记忆系统演示

AI酒馆是一个基于PromptX协议的多Agent演示系统，专为展示PromptX的双重记忆系统和Agent概念设计。

## 🎯 核心特性

- **双重记忆系统**：LangChain短期记忆 + PromptX长期记忆协同工作
- **流式对话体验**：实时打字效果，模拟真人对话
- **角色化AI交互**：Aria(温柔型)、Morgan(理性型)、Sean(专家型)
- **可视化演示**：震撼的记忆系统可视化展示

## 🚀 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/your-username/AI-Tavern.git
cd AI-Tavern

# 安装PromptX
npm install -g @promptx/cli
```

### 2. 激活开发角色

```bash
# 激活集成协调者（开发开始时）
promptx action ai-tavern-integrator

# 激活前端开发者
promptx action ai-tavern-frontend

# 激活后端开发者
promptx action ai-tavern-backend
```

### 3. 启动服务

```bash
# 后端服务
cd backend
npm install
npm start

# 前端服务
cd frontend
python -m http.server 8080
```

## 📚 详细文档

- [开发指南](./AI_TAVERN_DEVELOPMENT_GUIDE.md) - 完整的开发流程和角色使用说明
- [API规范](./docs/API_SPECIFICATION.md) - 详细的API接口文档
- [集成计划](./docs/INTEGRATION_PLAN.md) - 前后端集成方案
- [演示脚本](./docs/DEMO_SCRIPT.md) - 5分钟演示流程

## 🏗️ 技术架构

- **前端**：HTML5 + TailwindCSS + Vanilla JavaScript
- **后端**：Node.js + Express + LangChain.js
- **AI集成**：OpenAI API + PromptX MCP协议
- **演示系统**：Server-Sent Events流式响应

## 🎭 内置角色

- **ai-tavern-frontend**：前端开发专家，TailwindCSS主题设计师
- **ai-tavern-backend**：后端开发专家，LangChain集成专家
- **ai-tavern-integrator**：全栈集成协调者，风险控制专家

## 📱 演示效果

5分钟完整演示流程：
1. **角色选择**：展示三个AI角色的差异化
2. **对话体验**：流式响应，情感记忆保存
3. **记忆演示**：双重记忆系统可视化对比
4. **技术亮点**：PromptX生态价值展示

## 🤝 贡献

欢迎提交Issue和Pull Request！详见[开发指南](./AI_TAVERN_DEVELOPMENT_GUIDE.md)

## 📄 许可证

MIT License

---

**🍺 把AI当人，不是软件 - Chat is All you Need！**