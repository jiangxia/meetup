# Story 2.2: 原生OpenAI API集成

## O (Objective)
使用纯原生fetch调用OpenAI API，实现轻量级AI回复功能

## E (Environment)
- **确定技术栈**: Node.js/Express + 纯原生实现 + OpenAI GPT-4o-mini
- **架构模式**: 前端 -> 原生HTTP调用 -> OpenAI API (零框架依赖)
- **AI服务**: 原生fetch + 流式SSE响应 (完全可控)
- **角色系统**: MCP Client + PromptX角色 (标准协议集成)
- **记忆管理**: PromptX MCP工具 (promptx_remember/recall)
- **错误处理**: 自定义重试、超时、错误处理机制
- **性能要求**: 首次回复 < 1s (原生优化)
- **开发效率**: 启动时间 < 1秒，完全可控的代码路径

## S (Success Criteria)

### 及格标准
- ✅ AI能正常回复用户消息
- ✅ API调用稳定，错误处理完善
- ✅ 回复速度满足性能要求

### 优秀标准
- ✅ 回复质量高，符合角色设定
- ✅ 支持流式回复（实时显示）
- ✅ API调用优化，成本控制合理
- ✅ 支持多种LLM切换

## 具体任务分解

### Task 2.2.1: 原生OpenAI Client搭建
**预估时间**: 30分钟 (纯原生超级轻量！)
**具体内容**:
- 创建原生OpenAIClient类
- 实现基础chat和chatStream方法
- 集成MCP Client调用PromptX
- 完全可控的API调用逻辑

**纯原生超轻量实现**:
```javascript
// lib/openai-client.js - 纯原生版本
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
        temperature: options.temperature || 0.7
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

// server.js - 集成MCP + 原生OpenAI
const express = require('express');
const cors = require('cors');
const { OpenAIClient } = require('./lib/openai-client');
const { NativeMCPClient } = require('./lib/mcp-client');

const app = express();
app.use(cors());
app.use(express.json());

let openaiClient = null;
let mcpClient = null;

// 初始化服务
async function initServices() {
  // 初始化OpenAI
  if (process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAIClient(process.env.OPENAI_API_KEY);
  }
  
  // 初始化MCP Client
  mcpClient = new NativeMCPClient();
  await mcpClient.connect();
}

// 对话API - MCP + OpenAI集成
app.post('/api/chat/:roleId', async (req, res) => {
  try {
    const { roleId } = req.params;
    const { message, sessionId = 'default' } = req.body;
    
    // 1. 通过MCP回忆记忆
    let memories = [];
    if (mcpClient) {
      memories = await mcpClient.promptxRecall(message, sessionId);
    }
    
    // 2. 通过MCP激活角色
    let roleResponse = null;
    if (mcpClient) {
      roleResponse = await mcpClient.promptxAction(roleId, message);
    }
    
    // 3. 构建消息上下文并调用OpenAI
    const messages = buildMessageContext(roleId, message, memories);
    const response = await openaiClient.chat(messages);
    const aiResponse = response.choices[0].message.content;
    
    // 4. 保存记忆
    if (mcpClient) {
      await mcpClient.promptxRemember({
        user_message: message,
        ai_response: aiResponse,
        role: roleId
      }, sessionId);
    }
    
    res.json({
      success: true,
      data: { message: aiResponse, role: roleId }
    });
  } catch (error) {
    console.error('对话失败:', error);
    res.status(500).json({
      success: false,
      error: '对话服务暂时不可用'
    });
  }
});

initServices().then(() => {
  app.listen(3001, () => {
    console.log('🍺 AI酒馆启动! - 纯原生+MCP驱动');
  });
});
```

**安装依赖** (最小化):
```bash
# 仅需3个包！
npm install express cors dotenv
```

### Task 2.2.2: 实现API请求和响应处理逻辑
**预估时间**: 5小时
**具体内容**:
- 创建API调用封装函数
- 实现请求数据格式化
- 处理API响应解析
- 实现流式响应处理（如支持）

**核心实现**:
```javascript
class LLMService {
  constructor(config) {
    this.config = config;
    this.apiKey = config.apiKey;
  }

  async sendMessage(message, conversation = []) {
    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [...conversation, { role: 'user', content: message }],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        })
      });

      const data = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      throw new LLMError(error.message, error.code);
    }
  }

  parseResponse(data) {
    // 解析不同API的响应格式
    return data.choices?.[0]?.message?.content || data.content?.[0]?.text;
  }
}
```

### Task 2.2.3: 添加Loading状态和错误处理
**预估时间**: 3小时
**具体内容**:
- 实现请求Loading状态显示
- 添加网络错误处理机制
- 实现API限流和重试逻辑
- 创建用户友好的错误提示

**错误处理策略**:
```javascript
class LLMError extends Error {
  constructor(message, code, retryable = false) {
    super(message);
    this.code = code;
    this.retryable = retryable;
  }
}

const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接异常，请检查网络后重试',
  API_LIMIT: 'API调用频率过高，请稍后再试',
  AUTH_ERROR: 'API认证失败，请检查配置',
  TIMEOUT: '请求超时，请重试',
  UNKNOWN: '服务暂时不可用，请稍后重试'
};

async function handleAPICall(apiCall) {
  let retries = 3;
  while (retries > 0) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.retryable && retries > 1) {
        retries--;
        await sleep(1000 * (4 - retries)); // 递增延迟
        continue;
      }
      throw error;
    }
  }
}
```

### Task 2.2.4: 实现API调用的重试机制
**预估时间**: 2小时
**具体内容**:
- 实现指数退避重试策略
- 添加请求超时处理
- 实现API切换降级机制
- 优化token使用和成本控制

**重试机制实现**:
```javascript
class RetryManager {
  constructor(maxRetries = 3, baseDelay = 1000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  async execute(fn, context = 'API调用') {
    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (!this.shouldRetry(error, attempt)) {
          break;
        }
        
        const delay = this.calculateDelay(attempt);
        console.log(`${context} 失败，${delay}ms后重试 (${attempt}/${this.maxRetries})`);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }

  shouldRetry(error, attempt) {
    // 网络错误、超时、限流可重试
    const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT', 'API_LIMIT'];
    return attempt < this.maxRetries && retryableCodes.includes(error.code);
  }

  calculateDelay(attempt) {
    // 指数退避：1s, 2s, 4s
    return this.baseDelay * Math.pow(2, attempt - 1);
  }
}
```

## API集成架构设计

### 服务层设计
```
┌─────────────────┐
│   ChatService   │ <- 业务逻辑层
├─────────────────┤
│   LLMService    │ <- API封装层
├─────────────────┤
│  RetryManager   │ <- 重试管理
├─────────────────┤
│ ErrorHandler    │ <- 错误处理
└─────────────────┘
```

### 数据流设计
```
用户输入 -> 格式化 -> API调用 -> 响应解析 -> UI显示
    ↓          ↓         ↓         ↓         ↓
  验证      添加上下文   错误处理   格式化    状态更新
```

## 性能优化策略

### Token使用优化
```javascript
// 对话上下文管理
class ConversationManager {
  constructor(maxTokens = 4000) {
    this.maxTokens = maxTokens;
    this.conversation = [];
  }

  addMessage(role, content) {
    this.conversation.push({ role, content, timestamp: Date.now() });
    this.trimConversation();
  }

  trimConversation() {
    // 保持在token限制内，优先保留最近的消息
    while (this.estimateTokens() > this.maxTokens && this.conversation.length > 2) {
      this.conversation.splice(1, 1); // 保留系统消息
    }
  }
}
```

## 依赖关系
- 依赖Story 2.1的UI界面
- 为Story 2.3提供API调用基础

## 验收标准
1. API调用成功率 > 95%
2. 平均响应时间 < 2秒
3. 错误处理覆盖所有异常情况
4. Token使用合理，成本可控
5. 支持至少一种主流LLM API