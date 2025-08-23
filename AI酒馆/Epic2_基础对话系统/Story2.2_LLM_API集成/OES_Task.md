# Story 2.2: LLM API集成

## O (Objective)
集成大语言模型API，实现AI回复功能

## E (Environment)
- **确定技术栈**: Node.js/Express + LangChain框架 + OpenAI GPT-4o-mini
- **架构模式**: 前端 -> LangChain Agent -> OpenAI API (框架化集成)
- **AI框架**: LangChain (一行代码集成，内置最佳实践)
- **角色系统**: LangChain Agent + PromptX角色 (完美融合)
- **记忆管理**: LangChain Memory + PromptX MCP工具
- **错误处理**: LangChain内置重试、超时、错误处理
- **性能要求**: 首次回复 < 1.5s (LangChain优化)
- **开发效率**: 比原生集成节省70%开发时间

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

### Task 2.2.1: LangChain AI集成搭建
**预估时间**: 1小时 (LangChain超级简化版本！)
**具体内容**:
- 安装LangChain和OpenAI包
- 创建LangChain Chain和Agent
- 集成PromptX角色系统
- 一行代码实现AI对话

**LangChain超简单实现**:
```javascript
// server.js - LangChain版本
const express = require('express');
const cors = require('cors');
const { ChatOpenAI } = require('@langchain/openai');
const { ConversationChain } = require('langchain/chains');
const { BufferMemory } = require('langchain/memory');
const { PromptTemplate } = require('langchain/prompts');

const app = express();
app.use(cors());
app.use(express.json());

// LangChain配置 - 一行代码搞定AI！
const llm = new ChatOpenAI({ 
  modelName: 'gpt-4o-mini',
  temperature: 0.7 
});

// 为每个角色创建独立的Chain
const roleChains = {};

function createRoleChain(roleId) {
  const rolePrompts = {
    aria: `你是Aria，AI酒馆的温柔调酒师。你很贴心，善于倾听...
    
当前对话: {history}
用户: {input}
Aria:`,
    morgan: `你是Morgan，AI酒馆的资深调酒师。你经验丰富，性格直率...
    
当前对话: {history}
用户: {input}
Morgan:`
  };
  
  const prompt = PromptTemplate.fromTemplate(rolePrompts[roleId] || rolePrompts.aria);
  const memory = new BufferMemory();
  
  return new ConversationChain({ 
    llm, 
    prompt, 
    memory,
    verbose: true 
  });
}

// 聊天API - 超简单！
app.post('/api/chat', async (req, res) => {
  try {
    const { message, role = 'aria' } = req.body;
    
    // 获取或创建角色Chain
    if (!roleChains[role]) {
      roleChains[role] = createRoleChain(role);
    }
    
    // 一行代码获取AI回复！
    const response = await roleChains[role].call({ input: message });
    
    res.json({ message: response.response });
  } catch (error) {
    console.error('LangChain错误:', error);
    res.status(500).json({ error: '对话服务暂时不可用' });
  }
});

// PromptX工具集成 - 后面Task处理
app.post('/api/promptx/action', async (req, res) => {
  // TODO: 集成PromptX MCP工具
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('🍺 AI酒馆服务器启动! - LangChain驱动');
});
```

**安装依赖** (一条命令):
```bash
npm install langchain @langchain/openai @langchain/core
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