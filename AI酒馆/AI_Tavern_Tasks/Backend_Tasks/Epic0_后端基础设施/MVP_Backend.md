# MVP后端服务 - AI酒馆LangChain版

## O (Objective)
创建AI酒馆MVP后端，**基于LangChain框架的专业AI服务，专注核心价值验证**

## E (Environment)
- **技术栈**: Node.js + Express + LangChain.js
- **AI框架**: LangChain.js (ConversationChain + BufferMemory)
- **PromptX集成**: MCP桥接器模式
- **开发时间**: 6小时 (比原生开发节省4小时)
- **部署**: 本地运行 + Docker容器化

## S (Success Criteria)

### MVP验证标准
- ✅ LangChain LLM连接稳定，角色链创建成功
- ✅ PromptX桥接器工作正常，MCP工具调用成功
- ✅ 双重记忆系统集成完整，演示效果震撼
- ✅ 流式响应API稳定，前端实时体验流畅

## 🔧 LangChain项目结构

```
backend/
├── server.js                 # Express + LangChain主服务器
├── llm-config.js             # LangChain LLM配置
├── conversation-service.js    # 对话服务和链管理
├── promptx-bridge.js         # PromptX MCP桥接器
├── role-chain-factory.js     # 角色链工厂
├── package.json              # LangChain依赖配置
├── .env                      # API密钥和环境配置
├── Dockerfile                # 容器化配置
└── README.md                 # 详细启动和API文档
```

## 具体任务分解

**⚠️ 重要提示：此文档已更新为LangChain版本，请参考最新的详细任务文档：**
📋 **[LangChain后端详细任务分解](./LangChain_Backend_Tasks.md)**

### 快速概览

#### Task B1: 基础架构搭建 (4小时)
- **B1.1**: 项目初始化和LangChain依赖安装 (30分钟)
- **B1.2**: LangChain基础架构和LLM连接 (90分钟) 
- **B1.3**: PromptX桥接器和MCP集成 (120分钟)

#### Task B2: 核心功能实现 (2.5小时)
- **B2.1**: 角色化对话链和双重记忆系统 (90分钟)
- **B2.2**: Server-Sent Events流式响应API (60分钟)
- **B2.3**: 记忆演示功能和可视化API (60分钟)

### LangChain依赖配置

**server.js (MVP核心)**:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟的PromptX工具调用
let memoryStore = {}; // 简单内存存储

// ===== 核心API接口 =====

// 1. 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI酒馆MVP后端运行中',
    timestamp: new Date().toISOString()
  });
});

// 2. 基础对话API
app.post('/api/chat', async (req, res) => {
  try {
    const { message, role = 'aria' } = req.body;
    
    console.log(`${role}: ${message}`);
    
    // MVP版本：使用固定回复 + 简单LLM调用
    let response = '';
    
    if (process.env.OPENAI_API_KEY) {
      // 如果有API key，调用真实LLM
      response = await callOpenAI(message, role);
    } else {
      // 否则使用智能Mock回复
      response = generateMockResponse(message, role);
    }
    
    res.json({
      success: true,
      data: {
        message: response,
        role: role,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('对话失败:', error);
    res.status(500).json({
      success: false,
      error: '抱歉，我现在无法回复，请稍后再试'
    });
  }
});

// 3. PromptX记忆保存
app.post('/api/promptx/remember', async (req, res) => {
  try {
    const { role, content } = req.body;
    
    if (!memoryStore[role]) {
      memoryStore[role] = [];
    }
    
    const memory = {
      id: Date.now(),
      content: content,
      timestamp: new Date().toISOString(),
      role: role
    };
    
    memoryStore[role].push(memory);
    
    console.log(`记忆已保存 [${role}]: ${content}`);
    
    res.json({
      success: true,
      data: {
        memoryId: memory.id,
        summary: `已为${role}保存记忆: ${content.substring(0, 50)}...`
      }
    });
    
  } catch (error) {
    console.error('记忆保存失败:', error);
    res.status(500).json({
      success: false,
      error: '记忆保存失败'
    });
  }
});

// 4. PromptX记忆回忆
app.get('/api/promptx/recall/:role/:query', async (req, res) => {
  try {
    const { role, query } = req.params;
    
    const memories = memoryStore[role] || [];
    
    // 简单的关键词匹配
    const relevantMemories = memories.filter(memory => 
      memory.content.toLowerCase().includes(query.toLowerCase())
    ).slice(-3); // 最近3条相关记忆
    
    console.log(`回忆记忆 [${role}] 关于 "${query}": 找到 ${relevantMemories.length} 条`);
    
    res.json({
      success: true,
      data: {
        memories: relevantMemories.map(memory => ({
          id: memory.id,
          content: memory.content,
          relevance: 0.8,
          timestamp: memory.timestamp
        })),
        contextualResponse: relevantMemories.length > 0 
          ? `我记得你之前提到过${query}相关的内容...` 
          : `我没有找到关于${query}的记忆`
      }
    });
    
  } catch (error) {
    console.error('记忆回忆失败:', error);
    res.status(500).json({
      success: false,
      error: '记忆回忆失败'
    });
  }
});

// 5. 获取所有记忆 (调试用)
app.get('/api/debug/memories', (req, res) => {
  res.json({
    success: true,
    data: memoryStore
  });
});

// ===== 辅助函数 =====

// OpenAI API调用 (如果有key)
async function callOpenAI(message, role) {
  // 这里实现真实的OpenAI API调用
  // MVP版本可以先用固定回复
  return generateMockResponse(message, role);
}

// 智能Mock回复生成
function generateMockResponse(message, role) {
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
  
  const roleResponses = responses[role] || responses.aria;
  
  // 简单的关键词匹配
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

// 启动服务器
app.listen(PORT, () => {
  console.log('\n🍺 ===== AI酒馆MVP后端已启动 =====');
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/health`);
  console.log(`📍 调试记忆: http://localhost:${PORT}/api/debug/memories`);
  console.log('===============================\n');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🍺 AI酒馆MVP后端已关闭');
  process.exit(0);
});
```

### Task 3: 环境配置 (30分钟)

**.env文件**:
```
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

**README.md**:
```markdown
# AI酒馆MVP后端

极简版后端服务，专注核心功能验证。

## 🚀 快速启动

1. 安装依赖：`npm install`
2. 启动服务：`npm start`
3. 访问健康检查：`http://localhost:3001/health`

## 📡 API接口

- `POST /api/chat` - 基础对话
- `POST /api/promptx/remember` - 保存记忆
- `GET /api/promptx/recall/:role/:query` - 回忆记忆
- `GET /api/debug/memories` - 查看所有记忆

## 🔧 配置

在`.env`文件中设置：
- `OPENAI_API_KEY` - OpenAI API密钥（可选，无则使用Mock回复）
- `PORT` - 服务端口（默认3001）

## 💡 MVP特性

- **单文件架构**: 所有逻辑在server.js中
- **内存存储**: 无需数据库，重启后数据清空
- **智能Mock**: 无API key时使用智能回复
- **简单记忆**: 基于关键词的记忆匹配
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