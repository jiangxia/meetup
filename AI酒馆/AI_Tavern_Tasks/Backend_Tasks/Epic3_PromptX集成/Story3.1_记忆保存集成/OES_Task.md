# Story 3.1: 记忆保存集成

## O (Objective)
集成PromptX的promptx_remember工具，在对话中自动保存重要信息

## E (Environment)
- **PromptX工具**: promptx_remember
- **触发条件**: 用户表达情绪、提及重要事件、表明偏好时
- **保存内容**: 情绪状态、重要事件、用户偏好
- **调用方式**: AI在回复中自动调用，用户无感知
- **记忆格式**: 按PromptX标准格式保存(content, schema, strength, type)

## S (Success Criteria)

### 及格标准
- ✅ 能正常调用promptx_remember工具
- ✅ 关键信息能自动保存到PromptX记忆系统
- ✅ 记忆调用不影响对话流畅性

### 优秀标准
- ✅ 记忆触发判断准确，不遗漏重要信息
- ✅ 保存的记忆内容质量高，便于后续回调
- ✅ 用户感受不到记忆保存过程，体验自然

## 具体任务分解

### Task 3.1.1: MCP Client + PromptX记忆系统集成
**预估时间**: 1小时 (原生实现 + MCP超级简化！)
**具体内容**:
- 原生ConversationManager处理会话内记忆
- MCP Client调用PromptX处理跨会话长期记忆
- 双重记忆无缝集成
- 通过MCP协议保存重要信息到PromptX

**原生+MCP双重记忆实现**:
```javascript
// server.js - 原生+MCP双重记忆版本
const express = require('express');
const { OpenAIClient } = require('./lib/openai-client');
const { NativeMCPClient } = require('./lib/mcp-client');
const { ConversationManager } = require('./lib/conversation-manager');

// 原生会话记忆管理器
function createConversationManager() {
  return new ConversationManager({
    maxConversations: 1000,
    sessionTimeout: 30 * 60 * 1000, // 30分钟
    maxContextLength: 4000 // tokens
  });
}

// MCP Client长期记忆 - 跨会话记忆
async function saveToPromptX(content, role, sessionId = 'default') {
  // 判断是否值得长期保存
  if (isImportantMemory(content)) {
    try {
      await mcpClient.promptxRemember({
        content: content,
        metadata: {
          role: role,
          source: 'ai-tavern',
          timestamp: Date.now()
        }
      }, sessionId);
      console.log('💾 重要记忆已保存到PromptX');
    } catch (error) {
      console.warn('MCP PromptX记忆保存失败:', error);
    }
  }
}

// 智能判断：什么值得长期记忆
function isImportantMemory(content) {
  const importantKeywords = [
    '压力', '工作', '项目', '喜欢', '不喜欢', 
    '家人', '朋友', '爱好', '困难', '成就'
  ];
  
  return importantKeywords.some(keyword => 
    content.toLowerCase().includes(keyword)
  );
}

// 聊天API - 原生+MCP双重记忆版本
app.post('/api/chat/:roleId', async (req, res) => {
  try {
    const { roleId } = req.params;
    const { message, sessionId = 'default' } = req.body;
    
    // 1. 获取或创建会话(原生记忆管理)
    let conversation = conversationManager.getConversation(sessionId);
    if (!conversation) {
      conversation = conversationManager.createConversation(roleId);
    }
    
    // 2. 通过MCP Client回忆记忆
    let memories = [];
    if (mcpClient) {
      memories = await mcpClient.promptxRecall(message, sessionId);
    }
    
    // 3. 通过MCP Client激活角色
    let roleResponse = null;
    if (mcpClient) {
      roleResponse = await mcpClient.promptxAction(roleId, message);
    }
    
    // 4. 原生构建消息上下文并调用OpenAI
    const messages = buildMessageContext(roleId, message, conversation.messages, memories);
    const response = await openaiClient.chat(messages);
    const aiResponse = response.choices[0].message.content;
    
    // 5. 保存对话到本地记忆
    conversationManager.addMessage(conversation.id, message, 'user');
    conversationManager.addMessage(conversation.id, aiResponse, 'assistant');
    
    // 6. 异步保存重要信息到MCP PromptX长期记忆
    saveToPromptX(message, roleId, sessionId).catch(console.error);
    
    res.json({ 
      success: true,
      data: { 
        message: aiResponse, 
        role: roleId,
        conversationId: conversation.id
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '对话服务暂时不可用' 
    });
  }
});

// 会话开始时通过MCP Client回调PromptX长期记忆
app.post('/api/memory/recall', async (req, res) => {
  try {
    const { role, sessionId = 'default' } = req.body;
    
    const memories = await mcpClient.promptxRecall(
      `${role} ai-tavern memories`, 
      sessionId
    );
    
    res.json({ 
      success: true,
      data: { memories: memories || [] }
    });
  } catch (error) {
    res.json({ 
      success: false,
      data: { memories: [] }
    });
  }
});
```

**简化记忆架构设计** (参考DeeChat的智能分层系统):
```
🧠 基于PromptX的简化记忆架构
├─ 第1层：角色状态层
│  ├─ 角色身份维护 ✅ 防止长对话中角色丢失
│  └─ PromptX记忆感知 ✅ 自然融入历史记忆
├─ 第2层：历史对话层 (简化版)
│  ├─ 最近4轮对话 ✅ 本地短期上下文
│  └─ 重要信息依赖PromptX ✅ 无需复杂压缩
└─ 第3层：当前消息层
   ├─ 用户输入处理 ✅ 直接传递
   └─ MCP记忆触发 ✅ 异步保存重要信息
```

### Task 3.1.2: 智能记忆触发机制 (简化版)
**预估时间**: 1.5小时 (基于DeeChat的智能判断)
**具体内容**:
- 设计记忆触发的关键词和规则
- 实现情绪词汇检测
- 添加重要事件识别逻辑
- 确保记忆触发的准确性

**简化触发规则设计** (参考DeeChat的智能判断):
```javascript
// 简化版触发器 - 更智能的判断逻辑
class MemoryTriggerSimplified {
  constructor() {
    // 关键词权重系统（而非简单匹配）
    this.triggerWeights = {
      emotions: { weight: 0.8, keywords: ['压力', '开心', '难过', '兴奋', '焦虑', '累'] },
      personal: { weight: 0.9, keywords: ['喜欢', '不喜欢', '爱好', '希望', '讨厌'] },
      important: { weight: 1.0, keywords: ['重要', '记住', '别忘了', '提醒我'] },
      work: { weight: 0.7, keywords: ['工作', '项目', '任务', '同事', '老板'] }
    };
  }
  
  // 智能判断是否需要保存（参考DeeChat的多维度评估）
  shouldSaveMemory(userMessage, aiResponse) {
    let totalScore = 0;
    let triggeredCategories = [];
    
    // 1. 关键词权重评分
    for (const [category, config] of Object.entries(this.triggerWeights)) {
      const matches = config.keywords.filter(word => 
        userMessage.toLowerCase().includes(word)
      ).length;
      
      if (matches > 0) {
        totalScore += config.weight * matches;
        triggeredCategories.push(category);
      }
    }
    
    // 2. 对话长度因子（长对话更可能包含重要信息）
    const lengthFactor = Math.min(userMessage.length / 100, 1.0);
    totalScore += lengthFactor * 0.3;
    
    // 3. 问号密度（问题往往包含重要信息）
    const questionDensity = (userMessage.match(/[？?]/g) || []).length / userMessage.length * 100;
    totalScore += questionDensity * 0.2;
    
    // 简化判断：总分大于阈值就保存
    const threshold = 0.6;
    return {
      shouldSave: totalScore >= threshold,
      score: totalScore,
      categories: triggeredCategories,
      content: this.extractKeyInfo(userMessage, triggeredCategories)
    };
  }
  
  // 提取关键信息（简化版）
  extractKeyInfo(message, categories) {
    // 简单提取：取前200个字符作为摘要
    const summary = message.length > 200 ? message.slice(0, 200) + '...' : message;
    return {
      summary,
      categories,
      timestamp: new Date().toISOString(),
      importance: categories.includes('important') ? 'high' : 'medium'
    };
  }
}
```

### Task 3.1.3: 记忆内容格式化 (完全基于PromptX)
**预估时间**: 1小时 (直接使用PromptX格式)
**具体内容**:
- 实现记忆内容的自动格式化
- 设计schema生成规则
- 实现strength权重计算
- 确保记忆内容符合PromptX标准

**PromptX格式化实现** (完全依赖PromptX标准):
```javascript
// 完全基于PromptX的记忆格式（无需自定义schema）
function formatForPromptX(userMessage, aiResponse, roleId, sessionId) {
  // PromptX会自动处理记忆的schema和强度
  return {
    role: roleId,
    session: sessionId,
    interaction: {
      user: userMessage,
      ai: aiResponse,
      timestamp: new Date().toISOString()
    },
    // PromptX MCP工具会自动处理其余格式化
    metadata: {
      source: 'ai-tavern',
      type: 'conversation'
    }
  };
}

function generateSchema(content, category) {
  const schemas = {
    emotions: `用户情绪\n  当前状态\n    ${content}`,
    events: `重要事件\n  工作相关\n    ${content}`,
    preferences: `个人偏好\n  喜好表达\n    ${content}`,
    relationships: `人际关系\n  社交网络\n    ${content}`
  };
  
  return schemas[category] || `用户信息\n  一般信息\n    ${content}`;
}

function calculateStrength(category, content) {
  // 根据类别和内容重要性计算权重
  const categoryWeights = {
    emotions: 0.8,    // 情绪信息重要
    events: 0.7,      // 事件信息较重要  
    preferences: 0.6, // 偏好信息中等
    relationships: 0.9 // 关系信息很重要
  };
  
  return categoryWeights[category] || 0.5;
}
```

### Task 3.1.4: 用户体验优化 (异步 + 静默)
**预估时间**: 1小时 (简化版体验)
**具体内容**:
- 确保记忆保存不影响对话流畅性
- 添加静默错误处理
- 实现保存状态的可选显示
- 优化工具调用的性能

**简化体验优化** (参考DeeChat的无感知设计):
```javascript
// 完全静默的记忆保存（用户无感知）
async function handleUserMessageOptimized(message, roleId, sessionId) {
  try {
    // 1. 立即生成回复（不等待任何记忆操作）
    const aiResponse = await this.generateAIResponse(message, roleId, sessionId);
    
    // 2. 立即返回给用户
    const response = {
      success: true,
      data: { 
        message: aiResponse, 
        role: roleId,
        timestamp: new Date().toISOString()
      }
    };
    
    // 3. 完全异步的记忆保存（用户完全感知不到）
    this.saveMemoryIfNeeded(message, aiResponse, roleId, sessionId)
      .catch(error => {
        // 完全静默处理，记录到日志但不影响用户
        console.info('[记忆保存] 静默失败:', error.message);
      });
    
    return response;
    
  } catch (error) {
    // 即使记忆系统完全失败，对话功能依然正常
    return this.generateFallbackResponse(message, roleId);
  }
}

// 智能记忆保存（完全基于PromptX）
async saveMemoryIfNeeded(userMessage, aiResponse, roleId, sessionId) {
  const memoryTrigger = new MemoryTriggerSimplified();
  const analysis = memoryTrigger.shouldSaveMemory(userMessage, aiResponse);
  
  if (analysis.shouldSave) {
    // 直接调用MCP Client保存到PromptX
    await this.mcpClient.promptxRemember({
      user_message: userMessage,
      ai_response: aiResponse,
      role: roleId,
      importance: analysis.score,
      categories: analysis.categories
    }, sessionId);
    
    console.info(`[记忆保存] 成功保存重要对话 (评分: ${analysis.score})`);
  }
}

function showMemoryHint(message) {
  // 可选的记忆保存提示，不打断对话
  const hint = document.createElement('div');
  hint.className = 'memory-hint';
  hint.textContent = message;
  hint.style.opacity = '0.7';
  hint.style.fontSize = '12px';
  
  // 3秒后自动消失
  setTimeout(() => hint.remove(), 3000);
}
```

## 记忆示例设计

### 示例1: 情绪记忆
```
用户输入: "今天工作压力好大，项目deadline快到了"
触发条件: 包含"压力"、"工作"、"deadline"
保存内容:
{
  role: "aria",
  engrams: [{
    content: "用户工作压力大，项目截止日期临近",
    schema: "用户情绪\n  工作状态\n    压力大\n    项目deadline",
    strength: 0.8,
    type: "ATOMIC"
  }]
}
```

### 示例2: 偏好记忆
```
用户输入: "我比较喜欢喝威士忌，尤其是苏格兰的"
触发条件: 包含"喜欢"
保存内容:
{
  role: "aria", 
  engrams: [{
    content: "用户喜欢威士忌，偏好苏格兰威士忌",
    schema: "个人偏好\n  饮品喜好\n    威士忌\n      苏格兰威士忌",
    strength: 0.6,
    type: "ATOMIC"
  }]
}
```

## 依赖关系
- 依赖Epic 2的原生OpenAI API和MCP Client集成
- 完全基于PromptX记忆，无需复杂的本地记忆管理
- 为前端记忆演示界面提供数据基础

## 验收标准 (简化版)
1. MCP Client记忆调用成功率 > 95% (更简单更稳定)
2. 重要信息智能识别准确率 > 70% (降低期望，注重实用)
3. 记忆保存完全不影响对话响应时间 (完全异步)
4. 即使记忆系统失败，对话功能依然正常 (优雅降级)
5. 记忆格式完全由PromptX管理，无需手动维护格式