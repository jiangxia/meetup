# LangChain后端详细任务分解

## 📋 任务总览

| 任务编号 | 任务名称 | 预估时间 | 依赖关系 | 验收标准 |
|---------|----------|----------|----------|----------|
| B1.1 | 项目初始化和依赖安装 | 30分钟 | 无 | package.json配置完成，依赖安装成功 |
| B1.2 | LangChain基础架构搭建 | 90分钟 | B1.1 | LLM连接成功，基础链创建成功 |
| B1.3 | PromptX桥接器开发 | 120分钟 | B1.2 | MCP工具调用成功，角色激活成功 |
| B2.1 | 角色化对话链实现 | 90分钟 | B1.3 | 角色链创建成功，记忆功能正常 |
| B2.2 | 流式响应API开发 | 60分钟 | B2.1 | SSE流式输出正常，前端可接收 |
| B2.3 | 记忆演示功能开发 | 60分钟 | B2.2 | 双重记忆展示成功，数据格式正确 |

**总计**: 6.5小时（含30分钟缓冲时间）

---

## 📝 Task B1.1: 项目初始化和依赖安装

### 任务描述
设置Node.js项目基础结构，安装LangChain和相关依赖

### 具体执行步骤

#### Step 1: 项目结构创建 (10分钟)
```bash
mkdir ai-tavern-backend
cd ai-tavern-backend
npm init -y
```

**检查点**: 
- [ ] package.json文件创建成功
- [ ] 项目名称设置为"ai-tavern-backend"

#### Step 2: 核心依赖安装 (15分钟)
```bash
# LangChain核心包
npm install langchain @langchain/openai @langchain/core

# Web服务器
npm install express cors helmet

# 环境配置
npm install dotenv

# 开发依赖
npm install --save-dev nodemon
```

**检查点**:
- [ ] 所有依赖包安装成功，无错误信息
- [ ] package.json中dependencies字段包含所需包
- [ ] node_modules文件夹创建成功

#### Step 3: 项目配置文件 (5分钟)
创建以下配置文件：

**.env**:
```
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
PROMPTX_MCP_SERVER=local
```

**package.json scripts**:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

**检查点**:
- [ ] .env文件创建，包含所有必需环境变量
- [ ] package.json scripts配置正确
- [ ] nodemon配置可用（npm run dev可执行）

### 验收标准
1. ✅ 项目目录结构正确
2. ✅ 所有依赖安装无错误
3. ✅ 环境配置文件完整
4. ✅ npm run dev可以启动开发服务器

---

## 📝 Task B1.2: LangChain基础架构搭建

### 任务描述
搭建LangChain基础服务，建立LLM连接，创建基础对话链

### 具体执行步骤

#### Step 1: 服务器基础架构 (30分钟)
创建 **server.js**:

**基础结构**:
- Express应用初始化
- 中间件配置 (CORS, helmet, express.json)
- 路由架构设计
- 错误处理机制

**检查点**:
- [ ] 服务器可正常启动（localhost:3001）
- [ ] 健康检查端点正常响应
- [ ] CORS配置正确，支持前端跨域

#### Step 2: LangChain LLM配置 (30分钟)
创建 **llm-config.js**:

**配置内容**:
- ChatOpenAI实例化
- 模型参数配置 (temperature, modelName, streaming)
- API密钥验证
- 连接测试功能

**检查点**:
- [ ] LLM连接测试通过
- [ ] 模型响应正常
- [ ] 流式响应配置就绪

#### Step 3: 基础对话链创建 (30分钟)
创建 **conversation-service.js**:

**服务功能**:
- ConversationChain基础实现
- PromptTemplate基础模板
- BufferMemory内存管理
- 链式调用测试

**检查点**:
- [ ] 基础对话链创建成功
- [ ] 对话历史记录功能正常
- [ ] 提示词模板渲染正确

### 验收标准
1. ✅ LangChain LLM连接稳定
2. ✅ 基础对话链功能正常
3. ✅ 内存管理系统工作
4. ✅ 提示词模板系统可用

---

## 📝 Task B1.3: PromptX桥接器开发

### 任务描述
开发PromptX MCP工具桥接器，实现角色激活和记忆功能集成

### 具体执行步骤

#### Step 1: MCP客户端基础 (45分钟)
创建 **promptx-bridge.js**:

**核心功能**:
- MCP客户端连接管理
- 工具调用封装 (promptx_action, promptx_remember, promptx_recall)
- 错误处理和重试机制
- 连接状态管理

**检查点**:
- [ ] MCP客户端连接成功
- [ ] 工具列表获取正常
- [ ] 基础工具调用功能验证

#### Step 2: 角色激活功能 (45分钟)
**功能开发**:
- promptx_action工具调用封装
- DPML格式角色数据解析
- 角色信息结构化处理
- 激活状态管理

**数据结构设计**:
```
RoleData {
  id: string,
  name: string,
  description: string,
  personality: string,
  principles: string[],
  knowledge: string,
  isActivated: boolean,
  activatedAt: timestamp
}
```

**检查点**:
- [ ] 角色激活工具调用成功
- [ ] DPML数据解析正确
- [ ] 角色数据结构化存储

#### Step 3: 记忆功能集成 (30分钟)
**功能开发**:
- promptx_remember工具封装
- promptx_recall工具封装
- 记忆数据格式标准化
- 记忆检索优化

**记忆数据格式**:
```
MemoryEngram {
  content: string,
  schema: string,
  strength: number,
  type: "ATOMIC" | "LINK" | "PATTERN",
  timestamp: string,
  role: string
}
```

**检查点**:
- [ ] 记忆保存功能正常
- [ ] 记忆检索功能正常
- [ ] 数据格式符合PromptX标准

### 验收标准
1. ✅ PromptX工具调用稳定
2. ✅ 角色激活功能完整
3. ✅ 记忆系统集成成功
4. ✅ 数据格式符合规范

---

## 📝 Task B2.1: 角色化对话链实现

### 任务描述
基于LangChain创建角色专用的对话链，集成PromptX角色数据和记忆功能

### 具体执行步骤

#### Step 1: 角色链工厂设计 (30分钟)
创建 **role-chain-factory.js**:

**核心功能**:
- 角色链创建工厂模式
- 动态提示词模板生成
- 角色专用记忆配置
- 链式组件配置管理

**设计模式**:
```
RoleChainFactory.createChain(roleData) -> ConversationChain
- 根据角色数据动态生成提示词
- 配置角色专用内存管理
- 设置角色行为参数
- 返回完整配置的对话链
```

**检查点**:
- [ ] 工厂模式实现正确
- [ ] 动态提示词生成功能正常
- [ ] 角色链创建无错误

#### Step 2: 角色提示词模板引擎 (30分钟)
**模板引擎功能**:
- 角色身份注入
- 人格特征渲染
- 行为原则集成
- 专业知识嵌入
- 对话历史管理

**提示词模板结构**:
```
角色身份设定 + 人格特征 + 行为原则 + 专业知识 + 对话历史 + 当前输入
```

**检查点**:
- [ ] 提示词模板渲染正确
- [ ] 角色特征体现明显
- [ ] 模板变量替换无错误

#### Step 3: 双重记忆系统设计 (30分钟)
**记忆系统架构**:
- LangChain BufferMemory (对话级记忆)
- PromptX Memory (长期记忆)
- 记忆同步机制
- 记忆检索优化

**同步策略**:
```
用户输入 -> LangChain处理 -> AI回复 -> 
同时保存到 LangChain Memory + PromptX Memory
```

**检查点**:
- [ ] 双重记忆保存功能正常
- [ ] 记忆数据一致性验证
- [ ] 记忆检索性能合格

### 验收标准
1. ✅ 角色链创建流程完整
2. ✅ 提示词模板引擎正常
3. ✅ 双重记忆系统稳定
4. ✅ 角色特征差异明显

---

## 📝 Task B2.2: 流式响应API开发

### 任务描述
实现基于Server-Sent Events的流式响应API，支持实时对话体验

### 具体执行步骤

#### Step 1: SSE基础架构 (20分钟)
**SSE服务配置**:
- Express SSE中间件配置
- 响应头设置 (Content-Type: text/event-stream)
- 连接管理和清理机制
- 错误处理机制

**检查点**:
- [ ] SSE连接建立成功
- [ ] 响应头配置正确
- [ ] 连接状态管理正常

#### Step 2: LangChain流式集成 (25分钟)
**流式处理实现**:
- LangChain streaming callbacks配置
- Token级别的实时推送
- 流式状态管理
- 流结束处理

**回调函数设计**:
```
handleLLMNewToken(token) -> SSE推送
handleChainStart() -> 开始状态推送
handleChainEnd(output) -> 结束状态推送
handleError(error) -> 错误状态推送
```

**检查点**:
- [ ] 流式Token推送正常
- [ ] 状态变化通知准确
- [ ] 错误处理机制完善

#### Step 3: API端点实现 (15分钟)
创建流式对话API端点:

**端点设计**:
```
POST /api/chat/:roleId/stream
Request: { message: string }
Response: SSE流式数据
```

**响应数据格式**:
```json
{
  "type": "token" | "start" | "end" | "error",
  "content": string,
  "timestamp": string,
  "metadata": object
}
```

**检查点**:
- [ ] API端点响应正常
- [ ] 数据格式符合规范
- [ ] 异常情况处理正确

### 验收标准
1. ✅ SSE流式连接稳定
2. ✅ 实时Token推送无延迟
3. ✅ 状态管理完整
4. ✅ 错误处理机制完善

---

## 📝 Task B2.3: 记忆演示功能开发

### 任务描述
开发专门的记忆演示功能，展示双重记忆系统的工作原理和效果

### 具体执行步骤

#### Step 1: 记忆演示API设计 (25分钟)
**API端点设计**:
```
GET /api/memory/:roleId/demo
POST /api/memory/:roleId/save-demo
GET /api/memory/:roleId/recall-demo
```

**演示流程设计**:
```
1. 展示当前LangChain内存状态
2. 展示当前PromptX记忆状态
3. 模拟记忆保存过程
4. 模拟记忆检索过程
5. 展示记忆融合效果
```

**检查点**:
- [ ] API端点设计合理
- [ ] 演示流程逻辑清晰
- [ ] 数据展示格式友好

#### Step 2: 双重记忆展示功能 (20分钟)
**功能实现**:
- LangChain Memory状态查询
- PromptX Memory状态查询
- 记忆数据对比展示
- 记忆融合演示

**展示数据结构**:
```json
{
  "langchain_memory": {
    "buffer": string,
    "history_count": number,
    "last_interaction": timestamp
  },
  "promptx_memory": {
    "engrams_count": number,
    "recent_memories": array,
    "memory_strength": number
  },
  "demonstration_steps": array
}
```

**检查点**:
- [ ] 双重记忆数据获取正常
- [ ] 数据对比展示清晰
- [ ] 记忆融合逻辑正确

#### Step 3: 演示脚本化功能 (15分钟)
**脚本化演示**:
- 预设演示对话数据
- 自动化演示流程
- 演示效果可视化
- 演示结果验证

**演示脚本结构**:
```javascript
DemoScript = {
  steps: [
    { action: "save_memory", data: "...", expected: "..." },
    { action: "simulate_refresh", data: "...", expected: "..." },
    { action: "recall_memory", data: "...", expected: "..." },
    { action: "demonstrate_usage", data: "...", expected: "..." }
  ]
}
```

**检查点**:
- [ ] 演示脚本执行正常
- [ ] 演示效果符合预期
- [ ] 演示结果可验证

### 验收标准
1. ✅ 记忆演示API完整
2. ✅ 双重记忆展示清晰
3. ✅ 演示脚本化流程稳定
4. ✅ 演示效果具有震撼力

---

## 🎯 整体验收标准

### 功能完整性
- [ ] 3个角色（Aria/Morgan/Sean）激活成功
- [ ] 角色对话差异明显可感知
- [ ] 流式对话响应流畅无卡顿
- [ ] 记忆保存和检索功能正常
- [ ] 双重记忆演示效果震撼

### 性能要求
- [ ] API响应时间 < 2秒
- [ ] 流式Token延迟 < 100ms
- [ ] 并发支持 ≥ 10个连接
- [ ] 内存使用 < 200MB

### 稳定性要求
- [ ] 连续运行2小时无崩溃
- [ ] 错误恢复机制完善
- [ ] 日志记录完整
- [ ] 异常情况优雅处理

### 演示准备
- [ ] 演示数据准备完整
- [ ] 演示脚本测试通过
- [ ] 降级方案验证完成
- [ ] 应急预案准备就绪

---

**文档版本**: v1.0  
**制定人**: Sean (姜山)  
**更新时间**: 2025年8月  
**适用场景**: 黑客松48小时开发冲刺