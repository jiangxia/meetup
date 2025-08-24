# Story 0.1: Node.js服务器搭建

## O (Objective)
创建AI酒馆项目的Node.js后端服务器，建立API基础架构

## E (Environment)
- **技术栈**: Node.js + Express.js
- **开发工具**: VS Code, Postman (API测试)
- **依赖管理**: npm
- **CORS配置**: 支持前端跨域调用

## S (Success Criteria)

### 及格标准
- ✅ Express服务器正常启动
- ✅ 基础路由响应正常
- ✅ CORS配置正确
- ✅ 错误处理中间件就绪

### 优秀标准
- ✅ 完整的中间件配置
- ✅ 环境变量配置
- ✅ 日志记录系统
- ✅ 开发/生产环境区分

## 具体任务分解

### Task 0.1.1: 项目初始化和依赖安装
**预估时间**: 20分钟
**具体内容**:
- 创建后端项目目录
- 初始化package.json
- 安装基础依赖

**package.json配置**:
```json
{
  "name": "ai-tavern-backend",
  "version": "1.0.0",
  "description": "AI酒馆后端服务",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"No tests yet\""
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Task 0.1.2: 基础服务器架构搭建
**预估时间**: 30分钟
**具体内容**:
- 创建主服务器文件
- 配置中间件
- 设置基础路由

**server.js基础结构**:
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 基础路由
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI酒馆服务器运行中',
    timestamp: new Date().toISOString()
  });
});

// API路由组
app.use('/api/chat', require('./routes/chat'));
app.use('/api/promptx', require('./routes/promptx'));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API接口不存在' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🍺 AI酒馆后端服务启动成功!`);
  console.log(`📍 服务器地址: http://localhost:${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/health`);
});
```

### Task 0.1.3: 环境配置和目录结构
**预估时间**: 15分钟
**具体内容**:
- 创建.env配置文件
- 建立项目目录结构

**项目目录结构**:
```
backend/
├── server.js              # 服务器入口
├── package.json           # 依赖配置
├── .env                   # 环境变量
├── .env.example           # 环境变量示例
├── routes/
│   ├── chat.js           # 对话API路由
│   └── promptx.js        # PromptX工具路由
├── middleware/
│   ├── auth.js           # 认证中间件
│   ├── rateLimit.js      # 限流中间件
│   └── validation.js     # 数据验证
├── lib/
│   ├── openai-client.js  # 原生OpenAI客户端
│   ├── mcp-client.js     # MCP客户端
│   └── promptx-service.js # PromptX服务封装
├── utils/
│   ├── errors.js         # 错误处理工具
│   ├── response.js       # 响应格式化
│   └── validation.js     # 数据验证工具
└── logs/                 # 日志文件目录
```

**.env示例文件**:
```
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# MCP配置
MCP_TRANSPORT=stdio
MCP_SERVER_COMMAND=promptx mcp
```

## 验收标准
1. 服务器成功启动在指定端口
2. /health接口正常响应
3. CORS配置允许前端访问
4. 错误处理中间件正常工作
5. 项目结构清晰，便于后续开发

## 后续衔接
完成后可以立即开始API路由的具体实现，为LLM集成和PromptX集成提供基础。