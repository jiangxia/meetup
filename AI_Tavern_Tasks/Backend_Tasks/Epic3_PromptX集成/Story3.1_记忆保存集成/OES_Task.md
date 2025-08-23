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

### Task 3.1.1: LangChain双重记忆系统集成
**预估时间**: 1小时 (LangChain + PromptX超级简化！)
**具体内容**:
- LangChain自动处理会话内记忆（BufferMemory）
- PromptX处理跨会话长期记忆
- 双重记忆无缝集成
- 一键保存重要信息到PromptX

**LangChain双重记忆实现**:
```javascript
// server.js - 双重记忆版本
const { ConversationChain } = require('langchain/chains');
const { BufferMemory, ConversationSummaryMemory } = require('langchain/memory');
const { ChatOpenAI } = require('@langchain/openai');

// LangChain自动记忆 - 会话内记忆
function createMemoryChain(roleId) {
  const llm = new ChatOpenAI({ modelName: 'gpt-4o-mini' });
  
  // 会话记忆：自动记住对话历史
  const memory = new BufferMemory({
    memoryKey: 'history',
    inputKey: 'input',
    outputKey: 'response',
  });
  
  return new ConversationChain({ llm, memory });
}

// PromptX长期记忆 - 跨会话记忆
async function saveToPromptX(content, role) {
  // 判断是否值得长期保存
  if (isImportantMemory(content)) {
    try {
      await mcp__promptx_local__promptx_action({
        action: 'remember',
        content: content,
        metadata: {
          role: role,
          source: 'ai-tavern',
          timestamp: Date.now()
        }
      });
      console.log('💾 重要记忆已保存到PromptX');
    } catch (error) {
      console.warn('PromptX记忆保存失败:', error);
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

// 聊天API - 双重记忆版本
app.post('/api/chat', async (req, res) => {
  try {
    const { message, role = 'aria' } = req.body;
    
    // 1. LangChain处理会话记忆和回复
    const chain = roleChains[role] || createMemoryChain(role);
    const response = await chain.call({ input: message });
    
    // 2. 异步保存重要信息到PromptX长期记忆
    saveToPromptX(message, role).catch(console.error);
    
    res.json({ message: response.response });
  } catch (error) {
    res.status(500).json({ error: '对话服务暂时不可用' });
  }
});

// 会话开始时回调PromptX长期记忆
app.post('/api/memory/recall', async (req, res) => {
  try {
    const { role } = req.body;
    
    const memories = await mcp__promptx_local__promptx_action({
      action: 'recall',
      query: `${role} ai-tavern memories`,
      limit: 5
    });
    
    res.json({ memories: memories.data || [] });
  } catch (error) {
    res.json({ memories: [] });
  }
});
```

**记忆层次设计**:
```
🧠 双重记忆架构
├─ 会话记忆 (LangChain BufferMemory)
│  ├─ 当前对话上下文 ✅ 自动管理
│  └─ 实时对话连贯性 ✅ 框架处理
└─ 长期记忆 (PromptX)
   ├─ 用户重要信息 ✅ 智能筛选保存
   └─ 跨会话记忆回调 ✅ 主动提及
```

### Task 3.1.2: 智能记忆触发机制
**预估时间**: 3小时
**具体内容**:
- 设计记忆触发的关键词和规则
- 实现情绪词汇检测
- 添加重要事件识别逻辑
- 确保记忆触发的准确性

**触发规则设计**:
```javascript
const MEMORY_TRIGGERS = {
  emotions: ['累', '压力', '开心', '难过', '兴奋', '焦虑', '放松'],
  events: ['工作', '项目', 'deadline', '会议', '旅行', '学习'],
  preferences: ['喜欢', '不喜欢', '想要', '希望', '讨厌', '爱好'],
  relationships: ['同事', '朋友', '家人', '老板', '客户']
};

function shouldSaveMemory(userMessage) {
  const message = userMessage.toLowerCase();
  
  // 检查是否包含触发词
  for (const category in MEMORY_TRIGGERS) {
    if (MEMORY_TRIGGERS[category].some(word => message.includes(word))) {
      return {
        shouldSave: true,
        category: category,
        content: extractImportantInfo(userMessage)
      };
    }
  }
  
  return { shouldSave: false };
}
```

### Task 3.1.3: 记忆内容格式化
**预估时间**: 3小时
**具体内容**:
- 实现记忆内容的自动格式化
- 设计schema生成规则
- 实现strength权重计算
- 确保记忆内容符合PromptX标准

**格式化实现**:
```javascript
function formatMemoryContent(userMessage, category) {
  const content = extractKeyInfo(userMessage);
  
  return {
    content: content,
    schema: generateSchema(content, category),
    strength: calculateStrength(category, content),
    type: determineMemoryType(category)
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

### Task 3.1.4: 记忆保存的用户体验优化
**预估时间**: 2小时
**具体内容**:
- 确保记忆保存不影响对话流畅性
- 添加静默错误处理
- 实现保存状态的可选显示
- 优化工具调用的性能

**体验优化**:
```javascript
async function handleUserMessage(message) {
  // 1. 立即响应用户，不等待记忆保存
  const aiResponse = await generateResponse(message);
  displayMessage(aiResponse);
  
  // 2. 异步保存记忆，不阻塞界面
  const memoryCheck = shouldSaveMemory(message);
  if (memoryCheck.shouldSave) {
    // 异步保存，不影响用户体验
    saveMemoryAsync(memoryCheck.content)
      .then(result => {
        // 可选：显示记忆保存成功的微提示
        showMemoryHint('💾 已保存到记忆中');
      })
      .catch(error => {
        // 静默处理错误，不打断用户
        console.warn('记忆保存失败，但不影响对话:', error);
      });
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
- 依赖Epic 2的对话系统和LLM集成
- 为Story 3.2的记忆回调提供数据基础

## 验收标准
1. PromptX记忆工具调用成功率 > 90%
2. 关键信息识别准确率 > 80%
3. 记忆保存不影响对话响应时间
4. 错误处理完善，不会中断对话
5. 保存的记忆内容格式正确，便于后续检索