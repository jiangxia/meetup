# Story 2.3: 后端消息处理逻辑

## O (Objective)
实现后端的消息处理逻辑，包括消息队列、会话管理、上下文处理等服务端逻辑

## E (Environment)
- **基础**: 基于Epic2.2的原生OpenAI API集成
- **消息队列**: 内存队列管理
- **会话管理**: UUID会话标识 + 原生Map存储
- **上下文管理**: 滑动窗口策略
- **MCP集成**: 基于MCP Client的PromptX服务调用

## S (Success Criteria)

### 及格标准
- ✅ 消息队列正常处理
- ✅ 会话状态管理正确
- ✅ 上下文长度控制合理
- ✅ 并发请求处理稳定

### 优秀标准
- ✅ 消息持久化存储
- ✅ 会话超时自动清理
- ✅ 消息优先级处理
- ✅ 性能监控和优化

## 具体任务分解

### Task 2.3.1: 会话管理系统实现
**预估时间**: 2小时
**具体内容**:
- 创建ConversationManager类
- 实现会话生命周期管理
- 处理多用户并发会话

**ConversationManager实现**:
```javascript
// services/conversationManager.js
const { v4: uuidv4 } = require('uuid');

class ConversationManager {
  constructor(options = {}) {
    this.conversations = new Map();
    this.maxConversations = options.maxConversations || 1000;
    this.sessionTimeout = options.sessionTimeout || 30 * 60 * 1000; // 30分钟
    this.maxContextLength = options.maxContextLength || 2000; // 减少到2000 tokens
    this.maxHistoryRounds = options.maxHistoryRounds || 4; // 最多保留4轮对话
    
    // 定期清理过期会话
    this.startCleanupTimer();
  }

  // 创建新会话
  createConversation(roleId = 'aria') {
    const conversationId = uuidv4();
    const conversation = {
      id: conversationId,
      roleId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      tokenCount: 0,
      status: 'active'
    };

    this.conversations.set(conversationId, conversation);
    return conversation;
  }

  // 获取会话
  getConversation(conversationId) {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.lastActivity = new Date();
      return conversation;
    }
    return null;
  }

  // 添加消息到会话
  addMessage(conversationId, message, role = 'user') {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      throw new Error('会话不存在');
    }

    const messageObj = {
      id: uuidv4(),
      role,
      content: message,
      timestamp: new Date(),
      tokenCount: this.estimateTokens(message)
    };

    conversation.messages.push(messageObj);
    conversation.tokenCount += messageObj.tokenCount;
    conversation.lastActivity = new Date();

    // 管理上下文长度
    this.manageContextLength(conversation);

    return messageObj;
  }

  // 管理上下文长度 - 简化版（基于轮次而非token）
  manageContextLength(conversation) {
    // 使用简单的轮次限制，而不是复杂的token计算
    if (conversation.messages.length > this.maxHistoryRounds * 2) {
      // 每轮对话包括用户消息和AI回复，所以 * 2
      // 移除最早的消息对（保留最近的对话）
      const messagesToRemove = conversation.messages.length - this.maxHistoryRounds * 2;
      for (let i = 0; i < messagesToRemove; i++) {
        const removed = conversation.messages.shift();
        if (removed) {
          conversation.tokenCount -= removed.tokenCount || 0;
        }
      }
    }
  }

  // 估算token数量
  estimateTokens(text) {
    // 简单估算：中文字符 * 2，英文单词 * 1.3
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWords = text.split(/\s+/).length;
    return Math.ceil(chineseChars * 2 + englishWords * 1.3);
  }

  // 获取会话上下文
  getContext(conversationId) {
    const conversation = this.getConversation(conversationId);
    if (!conversation) return [];

    return conversation.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  }

  // 清理过期会话
  startCleanupTimer() {
    setInterval(() => {
      const now = new Date();
      for (const [id, conversation] of this.conversations) {
        const timeSinceLastActivity = now - conversation.lastActivity;
        if (timeSinceLastActivity > this.sessionTimeout) {
          this.conversations.delete(id);
          console.log(`清理过期会话: ${id}`);
        }
      }
    }, 5 * 60 * 1000); // 每5分钟检查一次
  }

  // 获取会话统计信息
  getStats() {
    return {
      totalConversations: this.conversations.size,
      activeConversations: Array.from(this.conversations.values())
        .filter(c => c.status === 'active').length
    };
  }
}

module.exports = ConversationManager;
```

### Task 2.3.2: 消息队列处理系统
**预估时间**: 1.5小时
**具体内容**:
- 实现消息队列管理
- 处理并发请求
- 实现消息优先级

**MessageQueue实现**:
```javascript
// services/messageQueue.js
class MessageQueue {
  constructor(options = {}) {
    this.queues = new Map(); // 按用户分队列
    this.processing = new Map(); // 正在处理的消息
    this.maxQueueSize = options.maxQueueSize || 100;
    this.maxConcurrent = options.maxConcurrent || 10;
    this.defaultPriority = options.defaultPriority || 5;
  }

  // 添加消息到队列
  async enqueue(userId, message, priority = this.defaultPriority) {
    const queueKey = userId || 'default';
    
    if (!this.queues.has(queueKey)) {
      this.queues.set(queueKey, []);
    }

    const queue = this.queues.get(queueKey);
    
    if (queue.length >= this.maxQueueSize) {
      throw new Error('消息队列已满，请稍后重试');
    }

    const queuedMessage = {
      id: Date.now() + Math.random(),
      userId,
      message,
      priority,
      timestamp: new Date(),
      retries: 0
    };

    queue.push(queuedMessage);
    
    // 按优先级排序（数字越小优先级越高）
    queue.sort((a, b) => a.priority - b.priority);

    // 开始处理队列
    this.processQueue(queueKey);

    return queuedMessage.id;
  }

  // 处理队列
  async processQueue(queueKey) {
    const queue = this.queues.get(queueKey);
    if (!queue || queue.length === 0) return;

    // 检查并发限制
    const processingCount = Array.from(this.processing.values())
      .filter(msg => msg.queueKey === queueKey).length;
    
    if (processingCount >= this.maxConcurrent) return;

    const message = queue.shift();
    this.processing.set(message.id, { ...message, queueKey });

    try {
      // 处理消息
      await this.processMessage(message);
      this.processing.delete(message.id);
    } catch (error) {
      console.error('消息处理失败:', error);
      
      // 重试逻辑
      if (message.retries < 3) {
        message.retries++;
        queue.unshift(message); // 重新加入队列头部
      }
      
      this.processing.delete(message.id);
    }

    // 继续处理队列中的其他消息
    setTimeout(() => this.processQueue(queueKey), 100);
  }

  // 处理单个消息
  async processMessage(queuedMessage) {
    // 这里会调用实际的消息处理逻辑
    // 在实际使用中，这个方法会被覆盖
    console.log(`处理消息: ${queuedMessage.message}`);
    
    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 获取队列状态
  getQueueStatus() {
    const status = {};
    for (const [key, queue] of this.queues) {
      status[key] = {
        pending: queue.length,
        processing: Array.from(this.processing.values())
          .filter(msg => msg.queueKey === key).length
      };
    }
    return status;
  }
}

module.exports = MessageQueue;
```

### Task 2.3.3: 消息处理服务集成
**预估时间**: 2.5小时
**具体内容**:
- 集成LLM服务和消息队列
- 实现完整的消息处理流程
- 添加错误处理和重试机制

**MessageProcessor实现**:
```javascript
// services/messageProcessor.js
class MessageProcessor extends MessageQueue {
  constructor(openaiClient, conversationManager, mcpClient) {
    super();
    this.llmService = openaiClient;  // 原生OpenAI Client
    this.conversationManager = conversationManager;
    this.promptxService = mcpClient;  // MCP Client for PromptX
  }

  // 处理用户消息
  async handleUserMessage(userId, message, roleId = 'aria', conversationId = null) {
    try {
      // 获取或创建会话
      let conversation;
      if (conversationId) {
        conversation = this.conversationManager.getConversation(conversationId);
      }
      
      if (!conversation) {
        conversation = this.conversationManager.createConversation(roleId);
      }

      // 添加用户消息到会话
      this.conversationManager.addMessage(conversation.id, message, 'user');

      // 将处理请求加入队列
      const messageId = await this.enqueue(userId, {
        type: 'chat',
        conversationId: conversation.id,
        message,
        roleId
      });

      return {
        success: true,
        data: {
          messageId,
          conversationId: conversation.id,
          status: 'queued'
        }
      };

    } catch (error) {
      console.error('处理用户消息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 覆盖父类的消息处理方法
  async processMessage(queuedMessage) {
    const { message: msgData } = queuedMessage;
    
    try {
      switch (msgData.type) {
        case 'chat':
          return await this.processChatMessage(msgData);
        case 'promptx_action':
          return await this.processPromptXAction(msgData);
        default:
          throw new Error(`未知的消息类型: ${msgData.type}`);
      }
    } catch (error) {
      console.error('处理消息失败:', error);
      throw error;
    }
  }

  // 处理对话消息
  async processChatMessage(msgData) {
    const { conversationId, message, roleId } = msgData;
    
    // 获取会话上下文
    const context = this.conversationManager.getContext(conversationId);
    
    // 通过MCP Client回忆记忆
    let memories = [];
    if (this.promptxService) {
      memories = await this.promptxService.promptxRecall(message, conversationId);
    }
    
    // 通过MCP Client激活角色
    let roleResponse = null;
    if (this.promptxService && roleId) {
      roleResponse = await this.promptxService.promptxAction(roleId, message);
    }
    
    // 构建消息上下文并调用原生OpenAI API
    const messages = this.buildMessageContext(roleId, message, context, memories);
    const response = await this.llmService.chat(messages);
    const aiResponse = response.choices[0].message.content;

    // 将AI回复添加到会话
    this.conversationManager.addMessage(conversationId, aiResponse, 'assistant');

    // 通过MCP Client保存记忆
    if (this.promptxService) {
      await this.promptxService.promptxRemember({
        user_message: message,
        ai_response: aiResponse,
        role: roleId
      }, conversationId);
    }

    return {
      success: true,
      data: {
        message: aiResponse,
        conversationId,
        roleId,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // 构建消息上下文 - 简化版3层提示词系统
  buildMessageContext(roleId, message, context, memories) {
    const messages = [];
    
    // 第1层：角色状态层 - 基于PromptX的角色身份维护
    const roleSystemPrompt = this.buildRoleSystemPrompt(roleId, memories);
    messages.push({ role: 'system', content: roleSystemPrompt });
    
    // 第2层：历史对话层 - 使用PromptX记忆替代复杂历史管理
    // 注意：我们直接使用PromptX记忆，不需要复杂的历史压缩
    const contextPrompt = this.buildContextPrompt(context, memories);
    if (contextPrompt) {
      messages.push({ role: 'system', content: contextPrompt });
    }
    
    // 第3层：当前消息层 - 处理用户当前输入
    messages.push({ role: 'user', content: message });
    
    return messages;
  }
  
  // 第1层：构建角色系统提示词（参考DeeChat的角色状态监控）
  buildRoleSystemPrompt(roleId, memories) {
    const basePrompts = {
      aria: '🍷 你是AI酒馆的Aria，一位温柔体贴的调酒师，善于倾听和安慰客人的心声。',
      morgan: '🥃 你是AI酒馆的Morgan，一位理性睿智的调酒师，擅长逻辑分析和深度对话。',
      sean: '🍺 你是AI酒馆的Sean，一位博学专业的调酒师，拥有丰富的知识和人生阅历。'
    };
    
    let systemPrompt = basePrompts[roleId] || basePrompts.aria;
    
    // 角色强化提示（防止长对话中角色身份丢失）
    systemPrompt += '\\n\\n💡 作为专业调酒师，你需要：';
    systemPrompt += '\\n- 保持角色特色和专业身份';
    systemPrompt += '\\n- 根据客人状态调整对话风格'; 
    systemPrompt += '\\n- 适时运用相关记忆增强对话';
    
    // PromptX记忆感知（如果有相关记忆）
    if (memories && memories.length > 0) {
      systemPrompt += `\\n\\n🧠 基于以往记忆，你了解这位客人的一些情况，请自然地融入对话中。`;
    }
    
    return systemPrompt;
  }
  
  // 第2层：构建上下文提示词（简化版历史管理）
  buildContextPrompt(context, memories) {
    if (!context || context.length === 0) return null;
    
    // 简化的上下文处理 - 只保留最近几轮对话
    const recentContext = context.slice(-4); // 只保留最近4条消息
    
    let contextPrompt = '📚 近期对话背景:\\n';
    recentContext.forEach((msg, index) => {
      const role = msg.role === 'user' ? '客人' : '你';
      contextPrompt += `${role}: ${msg.content.slice(0, 100)}${msg.content.length > 100 ? '...' : ''}\\n`;
    });
    
    return contextPrompt;
  }

  // 处理MCP PromptX操作
  async processPromptXAction(msgData) {
    const { action, roleId, data } = msgData;
    
    try {
      let result;
      switch (action) {
        case 'activate':
          result = await this.promptxService.promptxAction(roleId, data.message || '');
          break;
        case 'remember':
          result = await this.promptxService.promptxRemember(data.content, data.session || 'default');
          break;
        case 'recall':
          result = await this.promptxService.promptxRecall(data.query, data.session || 'default');
          break;
        default:
          throw new Error(`未知的MCP PromptX操作: ${action}`);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('MCP PromptX操作失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取处理状态
  async getProcessingStatus(messageId) {
    if (this.processing.has(messageId)) {
      return { status: 'processing' };
    }
    
    // 检查是否在队列中
    for (const queue of this.queues.values()) {
      if (queue.find(msg => msg.id === messageId)) {
        return { status: 'queued' };
      }
    }
    
    return { status: 'completed' };
  }
}

module.exports = MessageProcessor;
```

## 路由集成示例

### 更新chat路由
```javascript
// routes/chat.js 更新版
const express = require('express');
const router = express.Router();

// 注入消息处理器
router.post('/', async (req, res) => {
  try {
    const { message, roleId = 'aria', conversationId, userId = 'anonymous' } = req.body;
    
    const result = await messageProcessor.handleUserMessage(
      userId, 
      message, 
      roleId, 
      conversationId
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取处理状态
router.get('/status/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const status = await messageProcessor.getProcessingStatus(messageId);
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 验收标准
1. 消息队列正常处理并发请求
2. 会话管理功能完整稳定
3. 上下文长度控制有效
4. 错误处理和重试机制可靠
5. 性能满足并发要求

## 后续衔接
与Frontend Epic2.3配合完成完整的消息处理系统。