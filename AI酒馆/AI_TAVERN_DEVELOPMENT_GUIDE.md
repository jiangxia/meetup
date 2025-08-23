# AI酒馆开发指南 🍺

## 📋 项目概述

AI酒馆是一个基于PromptX协议的多Agent演示系统，专为48小时黑客松设计，核心目标是展示PromptX的双重记忆系统和Agent概念的强大能力。

### 🎯 核心价值
- **PromptX记忆演示**：展示LangChain短期记忆 + PromptX长期记忆的协同工作
- **流式响应体验**：实时打字效果，模拟真人对话体验
- **角色化AI交互**：Aria(温柔型)、Morgan(理性型)、Sean(专家型)三个差异化角色
- **技术架构展示**：前端TailwindCSS + 后端LangChain + PromptX MCP集成

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
├── backend/                           # 后端代码
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── lib/
│   │   ├── langchain-config.js
│   │   ├── promptx-bridge.js
│   │   └── memory-manager.js
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

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/your-username/AI-Tavern.git
cd AI-Tavern

# 安装PromptX（如果未安装）
npm install -g @promptx/cli

# 后端环境准备
cd backend
npm install
cp .env.example .env
# 编辑.env文件，设置OPENAI_API_KEY

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

**专业领域**：LangChain集成、PromptX桥接、流式API服务

**使用场景**：
```bash
# 开发后端功能时激活
promptx action ai-tavern-backend

# 常见询问：
"请搭建LangChain对话链架构"
"如何集成PromptX MCP桥接器？" 
"实现Server-Sent Events流式API"
"设计双重记忆系统架构"
```

**核心能力**：
- LangChain.js框架深度集成
- PromptX MCP协议桥接实现
- 高性能流式API服务设计
- 双重记忆系统协调管理

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

### 4小时检查点
- [ ] API规范文档完整
- [ ] Mock环境搭建完成
- [ ] 前后端基础架构ready
- [ ] 开发环境配置正常

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
# 后端服务测试
cd backend
npm start
curl http://localhost:3001/health

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
1. **API优先**：接口规范先定义，避免对接问题
2. **并行开发**：前后端基于Mock数据同步开发
3. **分阶段集成**：每4小时验证，及时发现问题
4. **演示导向**：所有功能服务于最终演示效果

### 代码规范
1. **错误处理**：所有API调用必须有try-catch
2. **日志记录**：关键操作要有详细日志
3. **配置外置**：敏感信息使用环境变量
4. **注释充分**：复杂逻辑要有清晰注释

### 性能优化
1. **响应时间**：API响应 < 2秒，界面响应 < 100ms
2. **内存管理**：及时释放资源，避免内存泄漏
3. **网络优化**：合理使用缓存，减少重复请求
4. **用户体验**：加载状态、错误提示要友好

## 🎯 演示脚本

### 5分钟演示流程
```
00:00-01:00  项目介绍：PromptX双重记忆系统价值
01:00-02:00  角色选择：激活Aria角色，展示差异化
02:00-03:30  对话体验：流式响应，情感记忆保存
03:30-04:00  记忆演示：双重记忆可视化对比
04:00-05:00  技术亮点：PromptX生态价值展示
```

### 关键演示点
- **技术创新**：双重记忆系统的协同工作
- **用户体验**：流式响应的真人对话感
- **角色差异**：三个AI角色的个性化体现  
- **生态价值**：PromptX系统的扩展能力

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