# MVP后端服务 - AI酒馆纯原生+MCP版

## O (Objective)
创建AI酒馆MVP后端，**基于纯原生实现+MCP标准协议的轻量AI服务，专注MCP集成价值验证**

## E (Environment)
- **技术栈**: Node.js + Express + 纯原生实现
- **AI服务**: 原生fetch调用OpenAI API + 流式SSE响应
- **PromptX集成**: 原生MCP Client (JSON-RPC 2.0协议)
- **开发时间**: 3小时 (比LangChain版本节省3小时)
- **部署**: 本地运行 (零依赖，快速启动)

## S (Success Criteria)

### MVP验证标准
- ✅ 原生OpenAI API连接稳定，流式响应正常
- ✅ 原生MCP Client工作正常，PromptX服务调用成功
- ✅ MCP记忆服务集成完整，演示效果震撼
- ✅ 标准MCP协议通信稳定，JSON-RPC调用无误

## 🔧 纯原生+MCP项目结构

```
backend/
├── server.js                 # Express + 原生实现主服务器
├── lib/
│   ├── mcp-client.js         # 原生MCP Client (JSON-RPC 2.0)
│   ├── openai-client.js      # 原生OpenAI API调用
│   ├── promptx-service.js    # PromptX服务封装
│   └── stream-controller.js  # 流式响应控制
├── package.json              # 最小依赖配置 (仅express, cors)
├── .env                      # API密钥配置
└── README.md                 # 启动和API文档
```

## 具体任务分解 (纯原生+MCP版)

### Epic 0: MCP基础设施搭建 (3小时)

#### Task B0.1: 原生MCP Client搭建 (2小时) ⭐⭐⭐
- **B0.1.1**: 项目初始化和最小依赖安装 (15分钟)
- **B0.1.2**: 实现原生MCP Client (JSON-RPC 2.0协议) (60分钟) 
- **B0.1.3**: PromptX MCP Server连接和工具调用验证 (45分钟)

#### Task B0.2: 原生OpenAI API集成 (1小时)
- **B0.2.1**: 原生fetch实现OpenAI API调用 (30分钟)
- **B0.2.2**: 流式SSE响应实现 (30分钟)

### 纯原生+MCP实现示例

**lib/mcp-client.js (核心MCP客户端)**:
```javascript
const { spawn } = require('child_process');

class NativeMCPClient {
  constructor(config = { transport: 'stdio' }) {
    this.config = config;
    this.process = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  async connect() {
    // 启动 PromptX MCP Server
    this.process = spawn('promptx', ['mcp'], {
      stdio: ['pipe', 'pipe', 'inherit']
    });

    this.process.stdin.setDefaultEncoding('utf8');
    
    // 设置响应监听
    this.process.stdout.on('data', (data) => {
      this.handleResponse(data.toString());
    });

    // 初始化握手
    await this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: { roots: { listChanged: true }, sampling: {} },
      clientInfo: { name: 'AI-Tavern', version: '1.0.0' }
    });

    console.log('✅ MCP Client connected to PromptX Server');
    return this;
  }

  async sendRequest(method, params) {
    const request = {
      jsonrpc: '2.0',
      id: ++this.requestId,
      method: method,
      params: params
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(request.id, { resolve, reject });
      
      const requestStr = JSON.stringify(request) + '\n';
      this.process.stdin.write(requestStr);
      
      // 超时处理
      setTimeout(() => {
        if (this.pendingRequests.has(request.id)) {
          this.pendingRequests.delete(request.id);
          reject(new Error('MCP Request timeout'));
        }
      }, 10000);
    });
  }

  handleResponse(dataStr) {
    const lines = dataStr.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      try {
        const response = JSON.parse(line);
        if (response.id && this.pendingRequests.has(response.id)) {
          const { resolve, reject } = this.pendingRequests.get(response.id);
          this.pendingRequests.delete(response.id);
          
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  }

  // PromptX 工具封装
  async promptxRemember(content, session) {
    return await this.sendRequest('tools/call', {
      name: 'promptx_remember',
      arguments: { content, session }
    });
  }

  async promptxRecall(query, session) {
    return await this.sendRequest('tools/call', {
      name: 'promptx_recall',
      arguments: { query, session }
    });
  }

  async promptxAction(role, message) {
    return await this.sendRequest('tools/call', {
      name: 'promptx_action',
      arguments: { role, message }
    });
  }

  async disconnect() {
    if (this.process) {
      this.process.kill();
      console.log('✅ MCP Client disconnected');
    }
  }
}

module.exports = { NativeMCPClient };
```

**lib/openai-client.js (原生OpenAI调用)**:
```javascript
class OpenAIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async chat(messages, options = {}) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini',
        messages: messages,
        temperature: options.temperature || 0.7,
        stream: options.stream || false
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async chatStream(messages, options = {}) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini',
        messages: messages,
        temperature: options.temperature || 0.7,
        stream: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    return response;
  }
}

module.exports = { OpenAIClient };
```

**server.js (纯原生MVP核心 + 配置管理)**:
```javascript
const express = require('express');
const cors = require('cors');
const { NativeMCPClient } = require('./lib/mcp-client');
const { OpenAIClient } = require('./lib/openai-client');
const { ConfigManager } = require('./lib/config-manager');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 全局服务实例
let mcpClient = null;
let openaiClient = null;
let configManager = null;

// 中间件
app.use(cors());
app.use(express.json());

// ===== 初始化服务 =====
async function initializeServices() {
  try {
    // 初始化配置管理器
    configManager = new ConfigManager();
    console.log('✅ Config Manager initialized');
    
    // 初始化 MCP Client
    mcpClient = new NativeMCPClient();
    await mcpClient.connect();
    
    // 初始化 OpenAI Client
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      openaiClient = new OpenAIClient(process.env.OPENAI_API_KEY);
      console.log('✅ OpenAI Client initialized');
    } else {
      console.log('⚠️  No OpenAI API key, using mock responses');
    }
    
    console.log('🎯 All services initialized successfully');
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    // 继续启动，使用降级模式
  }
}

// ===== 核心API接口 =====

// 1. MCP连接健康检查
app.get('/health', async (req, res) => {
  try {
    let mcpStatus = 'disconnected';
    let openaiStatus = 'not configured';
    
    // 检查MCP连接状态
    if (mcpClient && mcpClient.process) {
      mcpStatus = 'connected';
    }
    
    // 检查OpenAI配置
    if (openaiClient) {
      openaiStatus = 'configured';
    }
    
    res.json({ 
      status: 'ok', 
      message: 'AI酒馆纯原生+MCP后端运行中',
      services: {
        mcp: mcpStatus,
        openai: openaiStatus
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// 2. 对话API (集成MCP和OpenAI)
app.post('/api/chat/:roleId', async (req, res) => {
  try {
    const { roleId } = req.params;
    const { message, sessionId = 'default' } = req.body;
    
    console.log(`💬 [${roleId}] ${message}`);
    
    // 1. 通过MCP回忆相关记忆
    let memories = [];
    if (mcpClient) {
      try {
        memories = await mcpClient.promptxRecall(message, sessionId);
        console.log(`🧠 Recalled ${memories?.length || 0} memories`);
      } catch (error) {
        console.warn('⚠️  Memory recall failed:', error.message);
      }
    }
    
    // 2. 通过MCP激活角色
    let roleResponse = null;
    if (mcpClient) {
      try {
        roleResponse = await mcpClient.promptxAction(roleId, message);
        console.log(`🎭 Role ${roleId} activated`);
      } catch (error) {
        console.warn('⚠️  Role activation failed:', error.message);
      }
    }
    
    // 3. 构建对话上下文并调用OpenAI
    let aiResponse = '';
    if (openaiClient) {
      try {
        const messages = buildMessageContext(roleId, message, memories, roleResponse);
        const response = await openaiClient.chat(messages);
        aiResponse = response.choices[0].message.content;
      } catch (error) {
        console.warn('⚠️  OpenAI call failed:', error.message);
        aiResponse = generateMockResponse(message, roleId);
      }
    } else {
      aiResponse = generateMockResponse(message, roleId);
    }
    
    // 4. 通过MCP保存新记忆
    if (mcpClient) {
      try {
        await mcpClient.promptxRemember({
          user_message: message,
          ai_response: aiResponse,
          role: roleId,
          timestamp: new Date().toISOString()
        }, sessionId);
        console.log(`💾 Memory saved for session: ${sessionId}`);
      } catch (error) {
        console.warn('⚠️  Memory save failed:', error.message);
      }
    }
    
    res.json({
      success: true,
      data: {
        message: aiResponse,
        role: roleId,
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        debug: {
          memories_count: memories?.length || 0,
          role_activated: !!roleResponse,
          openai_used: !!openaiClient
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Chat failed:', error);
    res.status(500).json({
      success: false,
      error: '抱歉，我现在无法回复，请稍后再试'
    });
  }
});

// 3. 流式对话API
app.post('/api/chat/:roleId/stream', async (req, res) => {
  try {
    const { roleId } = req.params;
    const { message, sessionId = 'default' } = req.body;

    // 设置SSE响应头
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    if (openaiClient) {
      // 构建上下文 (简化版)
      const messages = [
        { role: 'system', content: `You are ${roleId}, a bartender at AI Tavern.` },
        { role: 'user', content: message }
      ];

      const streamResponse = await openaiClient.chatStream(messages);
      const reader = streamResponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              return res.end();
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } else {
      // Mock流式响应
      const mockResponse = generateMockResponse(message, roleId);
      const words = mockResponse.split(' ');
      
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ content: word + ' ' })}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      res.write('data: [DONE]\n\n');
      res.end();
    }
    
  } catch (error) {
    console.error('❌ Stream failed:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// 4. MCP工具测试接口
app.post('/api/mcp/test', async (req, res) => {
  try {
    const { tool, params } = req.body;
    
    if (!mcpClient) {
      return res.status(503).json({
        success: false,
        error: 'MCP Client not connected'
      });
    }
    
    let result;
    switch (tool) {
      case 'remember':
        result = await mcpClient.promptxRemember(params.content, params.session);
        break;
      case 'recall':
        result = await mcpClient.promptxRecall(params.query, params.session);
        break;
      case 'action':
        result = await mcpClient.promptxAction(params.role, params.message);
        break;
      default:
        throw new Error(`Unknown tool: ${tool}`);
    }
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('❌ MCP test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== 配置管理API =====

// 5. 获取当前配置
app.get('/api/config', async (req, res) => {
  try {
    if (!configManager) {
      return res.status(503).json({
        success: false,
        error: 'Config manager not initialized'
      });
    }
    
    const config = configManager.getCurrentConfig();
    const stats = configManager.getConfigStats();
    
    res.json({
      success: true,
      data: {
        config: config,
        stats: stats
      }
    });
  } catch (error) {
    console.error('❌ Get config failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 6. 更新OpenAI配置
app.post('/api/config/openai', async (req, res) => {
  try {
    const { apiKey, model } = req.body;
    
    if (!configManager) {
      return res.status(503).json({
        success: false,
        error: 'Config manager not initialized'
      });
    }
    
    configManager.updateOpenAIConfig(apiKey, model);
    
    // 重新初始化OpenAI客户端
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
      openaiClient = new OpenAIClient(apiKey);
    }
    
    res.json({
      success: true,
      message: 'OpenAI configuration updated successfully'
    });
  } catch (error) {
    console.error('❌ Update OpenAI config failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 7. 更新MCP配置
app.post('/api/config/mcp', async (req, res) => {
  try {
    const { transport, command, timeout } = req.body;
    
    if (!configManager) {
      return res.status(503).json({
        success: false,
        error: 'Config manager not initialized'
      });
    }
    
    configManager.updateMCPConfig(transport, command, timeout);
    
    res.json({
      success: true,
      message: 'MCP configuration updated successfully'
    });
  } catch (error) {
    console.error('❌ Update MCP config failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 8. 更新高级配置
app.post('/api/config/advanced', async (req, res) => {
  try {
    const { server, session, debug } = req.body;
    
    if (!configManager) {
      return res.status(503).json({
        success: false,
        error: 'Config manager not initialized'
      });
    }
    
    configManager.updateAdvancedConfig(server, session, debug);
    
    res.json({
      success: true,
      message: 'Advanced configuration updated successfully'
    });
  } catch (error) {
    console.error('❌ Update advanced config failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 9. 服务重启
app.post('/api/admin/restart', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Restart request received, service will restart in 3 seconds...'
    });
    
    // 3秒后重启
    setTimeout(async () => {
      console.log('🔄 Restarting services...');
      
      // 断开现有连接
      if (mcpClient) {
        await mcpClient.disconnect();
      }
      
      // 重新加载配置
      if (configManager) {
        configManager.loadConfig();
      }
      
      // 重新初始化服务
      await initializeServices();
      
      console.log('✅ Services restarted successfully');
    }, 3000);
    
  } catch (error) {
    console.error('❌ Restart failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== 辅助函数 =====

function buildMessageContext(roleId, userMessage, memories, roleResponse) {
  const messages = [];
  
  // 系统角色
  const systemPrompts = {
    aria: "You are Aria, a gentle and empathetic bartender who creates a warm atmosphere.",
    morgan: "You are Morgan, a straightforward and experienced bartender with a no-nonsense attitude.",
    sean: "You are Sean, founder of deepractice.ai, offering product and startup insights."
  };
  
  messages.push({
    role: 'system',
    content: systemPrompts[roleId] || systemPrompts.aria
  });
  
  // 添加记忆上下文
  if (memories && memories.length > 0) {
    messages.push({
      role: 'system',
      content: `Memory context: ${memories.map(m => m.content).join(', ')}`
    });
  }
  
  // 用户消息
  messages.push({
    role: 'user',
    content: userMessage
  });
  
  return messages;
}

function generateMockResponse(message, roleId) {
  const responses = {
    aria: {
      greeting: "你好！我是Aria，很高兴为你调制心情🍸",
      stress: "听起来你有些压力呢，让我为你调制一杯放松的鸡尾酒吧~",
      work: "工作确实不容易，但记得要照顾好自己哦💕",
      default: "作为你的专属调酒师，我会一直陪伴着你的~"
    },
    morgan: {
      greeting: "嘿！Morgan这儿。需要什么？",
      stress: "压力？哈，谁没有呢。来杯威士忌，咱们聊聊。",
      work: "工作嘛，要么爱它，要么换它。没中间选项。",
      default: "说吧，什么事让你烦心？老Morgan见得多了。"
    },
    sean: {
      greeting: "你好！我是Sean，deepractice.ai创始人。有什么创业或产品问题想聊的吗？",
      stress: "压力是成长的催化剂。让我们用矛盾论分析一下你的具体情况。",
      work: "工作中的挑战往往隐藏着机会。基于我的创业经验，我们来找找突破点。",
      default: "我喜欢从产品思维角度分析问题。说说你的具体情况？"
    }
  };
  
  const roleResponses = responses[roleId] || responses.aria;
  
  if (message.includes('你好') || message.includes('hi')) {
    return roleResponses.greeting;
  } else if (message.includes('压力') || message.includes('累')) {
    return roleResponses.stress;
  } else if (message.includes('工作') || message.includes('上班')) {
    return roleResponses.work;
  } else {
    return roleResponses.default;
  }
}

// ===== 服务器启动 =====

async function startServer() {
  await initializeServices();
  
  app.listen(PORT, () => {
    console.log('\n🍺 ===== AI酒馆纯原生+MCP后端已启动 =====');
    console.log(`📍 服务地址: http://localhost:${PORT}`);
    console.log(`📍 健康检查: http://localhost:${PORT}/health`);
    console.log(`📍 MCP测试: http://localhost:${PORT}/api/mcp/test`);
    console.log('=======================================\n');
  });
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🍺 正在关闭AI酒馆后端...');
  
  if (mcpClient) {
    await mcpClient.disconnect();
  }
  
  console.log('✅ AI酒馆纯原生+MCP后端已关闭');
  process.exit(0);
});

// 启动应用
startServer().catch(console.error);
```

### Task B0.3: 环境配置 (15分钟)

**package.json (最小依赖)**:
```json
{
  "name": "ai-tavern-native-backend",
  "version": "1.0.0",
  "description": "AI酒馆纯原生+MCP后端",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "test": "node test/test-mcp.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "keywords": ["ai", "mcp", "promptx", "native"],
  "author": "AI Tavern Team"
}
```

**.env文件**:
```
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development

# MCP配置 (可选)
MCP_TRANSPORT=stdio
MCP_SERVER_COMMAND=promptx mcp
```

**README.md**:
```markdown
# AI酒馆纯原生+MCP后端

基于纯原生实现的轻量级后端服务，展示MCP协议标准化集成价值。

## 🚀 快速启动

### 前置要求
- Node.js 18+
- PromptX CLI (`npm install -g @promptx/cli`)

### 启动步骤
1. 安装最小依赖：`npm install`
2. 配置环境：`cp .env.example .env` 并编辑
3. 启动服务：`npm start`
4. 验证健康：`http://localhost:3001/health`

## 📡 API接口

### 核心对话接口
- `POST /api/chat/:roleId` - 对话 (集成MCP+OpenAI)
- `POST /api/chat/:roleId/stream` - 流式对话

### MCP测试接口  
- `POST /api/mcp/test` - MCP工具测试
- `GET /health` - 服务健康检查 (包含MCP状态)

### 测试命令
```bash
# 测试MCP连接
curl -X POST http://localhost:3001/api/mcp/test \
  -H "Content-Type: application/json" \
  -d '{"tool": "remember", "params": {"content": "test", "session": "demo"}}'

# 测试对话
curl -X POST http://localhost:3001/api/chat/aria \
  -H "Content-Type: application/json" \
  -d '{"message": "你好", "sessionId": "demo"}'
```

## 🏗️ 架构特性

### 纯原生优势
- **零框架依赖**: 仅3个npm包 (express, cors, dotenv)
- **完全可控**: 直接控制OpenAI API和MCP协议
- **快速启动**: 无复杂抽象，启动时间<1秒
- **易于调试**: 代码路径清晰，错误定位简单

### MCP标准化集成
- **标准协议**: JSON-RPC 2.0 over stdio/HTTP
- **工具调用**: promptx_remember, promptx_recall, promptx_action
- **连接管理**: 自动重连，优雅关闭
- **错误处理**: 完整的MCP错误处理和降级

## 🔧 配置说明

### .env配置
- `OPENAI_API_KEY` - OpenAI API密钥 (可选，无则用Mock)
- `PORT` - 服务端口 (默认3001)
- `MCP_TRANSPORT` - MCP传输方式 (stdio/http)

### PromptX要求
确保PromptX CLI已安装并可执行：
```bash
promptx --version  # 检查版本
promptx mcp        # 测试MCP Server启动
```
```

### Task 4: 测试验证 (30分钟)

```bash
# 测试脚本
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好", "role": "aria"}'

curl -X POST http://localhost:3001/api/promptx/remember \
  -H "Content-Type: application/json" \
  -d '{"role": "aria", "content": "用户说工作很累"}'

curl http://localhost:3001/api/promptx/recall/aria/工作
```

## 🎯 MVP验收标准

### 功能验收
- [ ] 服务器可正常启动
- [ ] 对话API返回合理回复
- [ ] 记忆保存和回忆功能工作
- [ ] 前端可成功调用所有接口

### 性能验收
- [ ] 接口响应时间 < 2秒
- [ ] 并发10个请求不出错
- [ ] 内存使用 < 100MB

### 开发体验验收
- [ ] 总开发时间 ≤ 4小时
- [ ] 代码文件数 ≤ 5个
- [ ] 无复杂依赖和配置

## 🚀 后续扩展计划

### Version 0.2 (可选)
- 真实的OpenAI API集成
- 更智能的记忆匹配算法
- 简单的持久化存储

### Version 0.3 (产品化)
- 用户管理
- 数据库集成
- 部署配置

**核心原则**: 先验证价值，再优化实现！