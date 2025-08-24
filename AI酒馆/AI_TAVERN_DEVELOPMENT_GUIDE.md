# AI酒馆开发指南 🍺

## 📋 项目概述

AI酒馆是一个基于PromptX协议的多Agent演示系统，专为48小时黑客松设计，核心目标是展示PromptX的双重记忆系统和Agent概念的强大能力。

### 🎯 核心价值
- **MCP标准化集成**：基于MCP协议的标准化PromptX服务集成，展示MCP生态价值
- **PromptX记忆演示**：通过MCP Client调用PromptX记忆服务，展示长期记忆能力
- **流式响应体验**：实时打字效果，模拟真人对话体验
- **角色化AI交互**：Aria(温柔型)、Morgan(理性型)、Sean(专家型)三个差异化角色
- **技术架构展示**：前端TailwindCSS + 后端MCP Client + PromptX MCP Server通信

## 🏗️ 项目架构

```
AI-Tavern/
├── README.md                          # 项目说明
├── AI_TAVERN_DEVELOPMENT_GUIDE.md     # 本开发指南
├── .promptx/                          # PromptX角色系统
│   └── resource/
│       └── role/
│           ├── ai-tavern-frontend/     # 前端开发者角色
│           ├── ai-tavern-backend/      # 后端开发者角色
│           └── ai-tavern-integrator/   # 集成协调者角色
├── frontend/                          # 前端代码
│   ├── index.html
│   ├── assets/
│   │   ├── css/custom.css
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   ├── config.js
│   │   │   ├── api-client.js
│   │   │   └── components/
│   │   └── images/
│   └── README.md
├── backend/                           # 后端代码 (MCP Client为核心)
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── lib/
│   │   ├── mcp-client.js              # 核心MCP客户端
│   │   ├── promptx-connection.js      # PromptX MCP Server连接
│   │   ├── memory-client.js          # 记忆服务MCP调用
│   │   ├── agent-client.js           # Agent角色MCP调用
│   │   └── stream-controller.js      # 流式响应控制
│   └── README.md
├── docs/                             # 项目文档
│   ├── API_SPECIFICATION.md
│   ├── INTEGRATION_PLAN.md
│   └── DEMO_SCRIPT.md
└── scripts/                          # 辅助脚本
    ├── setup.sh
    ├── test-integration.sh
    └── deploy.sh
```

## 🚀 快速开始

**⭐ 首次使用？请先查看详细配置指南：[CONFIG_GUIDE.md](./CONFIG_GUIDE.md)**

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/jiangxia/meetup.git
cd meetup/AI酒馆

# 安装PromptX（如果未安装）
npm install -g @promptx/cli

# 后端环境准备
cd backend
npm install express cors dotenv
cp .env.example .env
# 编辑.env文件，设置OPENAI_API_KEY (详见CONFIG_GUIDE.md)

# 前端环境准备（可选，使用静态服务器）
cd ../frontend
python -m http.server 8080
# 或使用 live-server, http-server 等
```

### 2. 激活开发角色

```bash
# 在项目根目录下，激活PromptX角色系统
promptx init  # 如果是新环境

# 激活集成协调者角色（开发开始时）
promptx action ai-tavern-integrator
# 询问：请制定详细的API规范和开发计划

# 激活前端开发者角色
promptx action ai-tavern-frontend
# 询问：请开始TailwindCSS项目搭建

# 激活后端开发者角色
promptx action ai-tavern-backend
# 询问：请开始LangChain项目搭建
```

### 3. 开发流程

#### Phase 1: 基础准备（0-4小时）
1. **激活集成协调者**，制定API规范
2. 搭建Mock服务器环境
3. 创建基础项目结构
4. 协调前后端开发计划

#### Phase 2: 并行开发（4-20小时）
1. **前端开发**：TailwindCSS主题 → 角色界面 → 对话系统 → 流式响应
2. **后端开发**：LangChain集成 → PromptX桥接 → API服务 → 流式API
3. **每4小时集成检查**：API对接验证，问题及时修复

#### Phase 3: 集成调试（20-32小时）
1. 前后端API对接调试
2. 流式响应集成验证
3. 双重记忆系统联调
4. 端到端功能测试

#### Phase 4: 演示准备（32-48小时）
1. 演示环境部署验证
2. 演示脚本排练
3. 应急预案准备
4. 最终压力测试

## 🎭 角色使用说明

### 🎨 前端开发者角色 (`ai-tavern-frontend`)

**专业领域**：TailwindCSS主题设计、流式响应界面、记忆演示可视化

**使用场景**：
```bash
# 开发前端功能时激活
promptx action ai-tavern-frontend

# 常见询问：
"请开始TailwindCSS酒馆主题设计"
"如何实现Server-Sent Events流式响应的前端集成？"
"设计双重记忆系统的可视化界面"
"优化移动端响应式布局"
```

**核心能力**：
- 酒馆风格的TailwindCSS主题系统
- 实时打字效果和流式响应集成
- 双重记忆可视化演示界面
- 响应式设计和用户体验优化

### ⚙️ 后端开发者角色 (`ai-tavern-backend`)

**专业领域**：MCP Client架构、PromptX MCP集成、流式API服务

**使用场景**：
```bash
# 开发后端功能时激活
promptx action ai-tavern-backend

# 常见询问：
"请搭建标准MCP Client架构"
"如何连接和调用PromptX MCP Server？" 
"实现基于MCP协议的流式API"
"设计MCP工具调用的错误处理机制"
```

**核心能力**：
- 标准MCP Client架构设计和实现
- PromptX MCP Server连接和工具调用
- 基于MCP协议的高性能API服务
- MCP通信的错误处理和重连机制

### 🔧 集成协调者角色 (`ai-tavern-integrator`)

**专业领域**：前后端集成、API规范制定、风险控制

**使用场景**：
```bash
# 项目协调和集成时激活
promptx action ai-tavern-integrator

# 常见询问：
"制定完整的API接口规范"
"分析当前的集成风险和解决方案"
"设计分阶段集成验证计划"
"准备演示应急预案"
```

**核心能力**：
- 全栈技术架构统筹规划
- API接口规范制定和验证
- 集成风险识别和控制管理
- 演示效果保障和应急处理

## 📊 开发检查点

### 2小时检查点 (MCP 优先验证)
- [ ] PromptX MCP Server连接成功
- [ ] 基础MCP工具调用验证通过
- [ ] MCP Client架构搭建完成
- [ ] 错误处理和重连机制ready

### 4小时检查点
- [ ] API规范文档完整 (基于MCP协议)
- [ ] MCP集成环境搭建完成
- [ ] 前后端基础架构ready
- [ ] PromptX服务调用正常

### 8小时检查点  
- [ ] 基础UI界面可用
- [ ] 基础API接口可用
- [ ] 简单对话功能正常
- [ ] CORS跨域配置正确

### 16小时检查点
- [ ] 前端核心功能完整
- [ ] 后端LangChain集成完成
- [ ] API基础对接成功
- [ ] 角色差异化体现明显

### 32小时检查点
- [ ] 所有功能开发完成
- [ ] 流式响应集成成功
- [ ] 双重记忆演示正常
- [ ] 端到端测试通过

## 🚨 应急预案

### Plan A: 完整功能演示（理想状态）
- 所有功能正常工作
- 实时LLM对话 + 流式响应
- 双重记忆系统完整演示
- 角色推荐功能正常

### Plan B: 核心功能演示（可接受）
- 基础对话功能正常
- PromptX记忆Mock演示
- 去掉流式效果，使用基础对话
- 核心技术亮点保留

### Plan C: 演示脚本方案（保底）
- 预录制关键演示片段
- 准备固定的对话脚本
- 手动切换演示场景
- 重点展示技术架构

### Plan D: 概念演示（最后备选）
- PPT + 架构图展示
- 代码片段现场演示
- 技术原理深度讲解
- 强调PromptX价值主张

## 🧪 测试验证

### 本地开发测试
```bash
# MCP连接测试 (优先级最高)
cd backend
npm start
curl http://localhost:3001/mcp/health

# PromptX MCP Server连接验证
curl -X POST http://localhost:3001/mcp/test-connection \
  -H "Content-Type: application/json" \
  -d '{"tool": "promptx_remember"}'

# API功能测试
curl -X POST http://localhost:3001/api/chat/aria \
  -H "Content-Type: application/json" \
  -d '{"message": "你好"}'

# 前端界面测试
cd frontend
open http://localhost:8080
```

### 集成测试
```bash
# 使用集成测试脚本
./scripts/test-integration.sh

# 或手动验证关键流程：
# 1. 角色选择 → 激活
# 2. 发送消息 → 接收回复  
# 3. 记忆演示 → 可视化展示
# 4. 页面刷新 → 记忆回调
```

## 📱 部署说明

### 开发环境部署
```bash
# 后端服务
cd backend && npm start

# 前端服务  
cd frontend && python -m http.server 8080
```

### 演示环境部署
```bash
# 使用部署脚本
./scripts/deploy.sh

# 或Docker容器化部署
docker-compose up -d
```

## 🔍 故障排除

### 常见问题

#### MCP连接问题 (最高优先级)
```bash
# 检查PromptX MCP Server状态
promptx --version
promptx status

# 测试MCP连接
node -e "console.log('Testing MCP connection...')"

# 检查MCP工具可用性
curl -X POST http://localhost:3001/mcp/list-tools
```

#### PromptX角色无法激活
```bash
# 检查PromptX安装
promptx --version

# 重新初始化
promptx init

# 检查角色文件路径
ls -la .promptx/resource/role/
```

#### API跨域问题
```javascript
// backend/server.js 确保CORS配置
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));
```

#### LangChain集成失败
```bash
# 检查OpenAI API Key
echo $OPENAI_API_KEY

# 检查依赖版本
npm list langchain @langchain/openai
```

#### 流式响应连接失败
```javascript
// 检查SSE响应头设置
res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Access-Control-Allow-Origin': '*'
});
```

## 💡 最佳实践

### 开发原则
1. **MCP优先**：优先验证MCP连接，确保PromptX服务可用
2. **标准协议**：严格遵循MCP协议规范，避免自定义实现
3. **分阶段集成**：每2小时验证MCP连接，每4小时验证功能集成
4. **演示导向**：所有功能服务于展示MCP标准化集成价值

### 代码规范
1. **错误处理**：所有API调用必须有try-catch
2. **日志记录**：关键操作要有详细日志
3. **配置外置**：敏感信息使用环境变量
4. **注释充分**：复杂逻辑要有清晰注释

### MCP集成规范
1. **连接管理**：使用连接池，自动重连机制
2. **工具调用**：统一的MCP工具调用封装，标准错误处理
3. **协议遵循**：严格按照MCP协议规范实现，确保兼容性
4. **性能优化**：MCP调用 < 1秒，连接重试 < 3次

### 性能优化
1. **响应时间**：MCP调用 < 1秒，API响应 < 2秒，界面响应 < 100ms
2. **内存管理**：及时释放MCP连接资源，避免内存泄漏
3. **网络优化**：MCP连接复用，减少重复连接开销
4. **用户体验**：MCP调用状态展示，错误提示要友好

## 🎯 演示脚本

### 5分钟演示流程
```
00:00-01:00  项目介绍：MCP标准化集成，PromptX生态价值
01:00-02:00  MCP连接演示：展示实时MCP Server通信
02:00-03:30  对话体验：通过MCP调用PromptX记忆和Agent服务
03:30-04:00  记忆演示：MCP记忆服务可视化展示
04:00-05:00  技术亮点：标准化MCP协议的集成优势
```

### 关键演示点
- **标准化集成**：展示MCP协议的标准化价值和易用性
- **实时通信**：MCP Client与PromptX Server的无缝连接
- **服务调用**：统一的MCP工具调用，简化集成复杂度  
- **生态价值**：基于MCP的PromptX服务生态扩展能力

## 🤝 贡献指南

### 代码贡献
1. Fork项目到个人仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交代码：`git commit -m "Add new feature"`
4. 推送分支：`git push origin feature/new-feature`
5. 创建Pull Request

### 问题报告
1. 使用GitHub Issues报告问题
2. 详细描述问题复现步骤
3. 提供系统环境信息
4. 附上相关日志和截图

## 📞 联系方式

- **项目维护者**：AI酒馆开发团队
- **技术支持**：通过GitHub Issues
- **紧急联系**：黑客松现场协调

---

**🍺 祝你在AI酒馆的开发之旅中收获满满！记住：Chat is All you Need - 把AI当人，不是软件！**