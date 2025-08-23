<execution>
  <constraint>
    ## 技术约束条件
    - **时间限制**：48小时黑客松，后端开发时间约6小时
    - **技术栈约束**：Node.js + Express + LangChain.js，避免过度复杂的架构
    - **API依赖**：依赖OpenAI API，需要处理限流、超时、费用等问题
    - **PromptX集成**：通过MCP协议集成，可能遇到权限和兼容性问题
    - **部署约束**：本地运行为主，Docker容器化可选
    - **演示要求**：所有API必须在5-8分钟演示中稳定工作
  </constraint>

  <rule>
    ## 开发规则
    - **单文件原型原则**：初期使用单文件快速验证核心功能
    - **LangChain优先原则**：充分利用LangChain现有能力，避免重复造轮子
    - **错误处理强制原则**：每个外部调用都必须有try-catch和降级方案
    - **API设计规范**：统一的响应格式、错误码和状态管理
    - **性能监控原则**：关键接口必须有响应时间监控和日志记录
    - **降级方案必备**：所有复杂功能都要有简单的Mock实现
    - **演示友好原则**：API响应要有足够的日志和调试信息
  </rule>

  <guideline>
    ## 开发指导原则
    
    ### 架构设计原则
    - **分层明确**：路由层、服务层、集成层职责分离
    - **模块化**：每个主要功能独立模块，便于测试和维护
    - **配置外置**：所有配置参数统一管理，支持环境切换
    - **日志规范**：统一的日志格式，便于问题排查和演示展示
    
    ### API设计原则
    - **RESTful标准**：遵循REST设计原则，URL语义清晰
    - **响应一致性**：统一的成功/失败响应格式
    - **错误友好性**：错误信息要对前端开发者和最终用户都友好
    - **版本控制**：API版本管理，便于后续扩展
    
    ### 性能优化原则
    - **连接复用**：LLM连接池，减少初始化开销
    - **缓存策略**：合理使用缓存，避免重复计算
    - **异步优先**：充分利用Node.js异步特性
    - **资源释放**：及时释放资源，避免内存泄漏
  </guideline>

  <process>
    ## 具体开发流程
    
    ### Step 1: 项目初始化（30分钟）
    
    #### 1.1 项目结构创建
    ```
    backend/
    ├── server.js               # 主服务器文件（MVP单文件版）
    ├── package.json            # 依赖配置
    ├── .env                    # 环境变量配置
    ├── lib/                    # 扩展模块（可选）
    │   ├── langchain-config.js
    │   ├── promptx-bridge.js
    │   └── memory-manager.js
    ├── Dockerfile              # 容器化配置（可选）
    └── README.md               # 部署和使用说明
    ```
    
    #### 1.2 依赖安装和配置
    ```javascript
    // package.json 核心依赖
    {
      "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5", 
        "dotenv": "^16.3.1",
        "langchain": "^0.0.200",
        "openai": "^4.20.1",
        "@langchain/openai": "^0.0.30",
        "eventsource": "^2.0.2"
      }
    }
    ```
    
    #### 1.3 基础服务器配置
    ```javascript
    // server.js 基础架构
    const express = require('express');
    const cors = require('cors');
    require('dotenv').config();
    
    const app = express();
    const PORT = process.env.PORT || 3001;
    
    // 中间件配置
    app.use(cors());
    app.use(express.json());
    
    // 健康检查端点
    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    });
    ```
    
    ### Step 2: LangChain集成（90分钟）
    
    #### 2.1 LLM连接配置（30分钟）
    ```javascript
    const { ChatOpenAI } = require("@langchain/openai");
    const { ConversationChain } = require("langchain/chains");
    const { BufferMemory } = require("langchain/memory");
    
    // LLM配置
    const llm = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-4o-mini",
        temperature: 0.7,
        streaming: true
    });
    
    // 测试LLM连接
    async function testLLMConnection() {
        try {
            const response = await llm.call([
                { role: "user", content: "Hello, this is a test." }
            ]);
            console.log("✅ LLM连接成功:", response);
            return true;
        } catch (error) {
            console.error("❌ LLM连接失败:", error);
            return false;
        }
    }
    ```
    
    #### 2.2 角色化对话链（30分钟）
    ```javascript
    // 角色Prompt模板
    const ROLE_PROMPTS = {
        aria: `你是Aria，一位温柔的AI调酒师。你善于倾听和情感支持，
               总是用温暖的语调回应用户，关心用户的情感需求。`,
        morgan: `你是Morgan，一位经验丰富的调酒师。你直言不讳，
               喜欢给出实用的建议，说话风格直接但友善。`,
        sean: `你是Sean，deepractice.ai的创始人。你擅长产品思维和决策分析，
               总是从产品和商业的角度提供专业建议。`
    };
    
    // 对话链工厂
    class ConversationChainFactory {
        static create(roleId) {
            const prompt = ROLE_PROMPTS[roleId] || ROLE_PROMPTS.aria;
            const memory = new BufferMemory({
                returnMessages: true,
                memoryKey: "history"
            });
            
            return new ConversationChain({
                llm: llm,
                memory: memory,
                systemPrompt: prompt
            });
        }
    }
    ```
    
    #### 2.3 对话管理器（30分钟）
    ```javascript
    // 对话会话管理
    class ConversationManager {
        constructor() {
            this.sessions = new Map();
        }
        
        getOrCreateSession(roleId, sessionId) {
            const key = `${roleId}-${sessionId}`;
            if (!this.sessions.has(key)) {
                this.sessions.set(key, ConversationChainFactory.create(roleId));
            }
            return this.sessions.get(key);
        }
        
        async sendMessage(roleId, sessionId, message) {
            const chain = this.getOrCreateSession(roleId, sessionId);
            try {
                const response = await chain.call({ input: message });
                return response.response;
            } catch (error) {
                console.error('对话失败:', error);
                throw error;
            }
        }
    }
    ```
    
    ### Step 3: PromptX桥接集成（90分钟）
    
    #### 3.1 MCP桥接器开发（45分钟）
    ```javascript
    // PromptX桥接器
    class PromptXBridge {
        constructor() {
            this.isConnected = false;
            this.mockMode = !process.env.PROMPTX_ENABLED;
        }
        
        async remember(role, content) {
            if (this.mockMode) {
                return this.mockRemember(role, content);
            }
            
            try {
                // 这里集成真实的PromptX MCP调用
                // 由于MCP集成复杂性，先用Mock实现
                return await this.callPromptXRemember(role, content);
            } catch (error) {
                console.warn('PromptX记忆保存失败，使用Mock模式:', error);
                return this.mockRemember(role, content);
            }
        }
        
        async recall(role, query) {
            if (this.mockMode) {
                return this.mockRecall(role, query);
            }
            
            try {
                return await this.callPromptXRecall(role, query);
            } catch (error) {
                console.warn('PromptX记忆回忆失败，使用Mock模式:', error);
                return this.mockRecall(role, query);
            }
        }
        
        // Mock实现作为降级方案
        mockRemember(role, content) {
            const memory = {
                id: Date.now(),
                content: content,
                timestamp: new Date().toISOString(),
                role: role,
                strength: 0.8
            };
            
            // 简单的内存存储
            if (!global.promptxMemories) global.promptxMemories = {};
            if (!global.promptxMemories[role]) global.promptxMemories[role] = [];
            global.promptxMemories[role].push(memory);
            
            return { success: true, memoryId: memory.id };
        }
        
        mockRecall(role, query) {
            if (!global.promptxMemories?.[role]) {
                return { memories: [], contextualResponse: "没有找到相关记忆" };
            }
            
            const memories = global.promptxMemories[role].filter(m => 
                m.content.toLowerCase().includes(query.toLowerCase())
            ).slice(-3);
            
            return {
                memories: memories,
                contextualResponse: memories.length > 0 
                    ? `我记得你之前提到过${query}...` 
                    : "没有找到相关记忆"
            };
        }
    }
    ```
    
    #### 3.2 双重记忆系统集成（45分钟）
    ```javascript
    // 双重记忆管理器
    class DualMemoryManager {
        constructor() {
            this.promptxBridge = new PromptXBridge();
        }
        
        async saveConversationMemory(roleId, userMessage, aiResponse) {
            // 同时保存到两个记忆系统
            const savePromises = [];
            
            // 1. LangChain记忆（自动保存在ConversationChain中）
            
            // 2. PromptX长期记忆
            const memoryContent = `用户: ${userMessage}\nAI: ${aiResponse}`;
            savePromises.push(
                this.promptxBridge.remember(roleId, memoryContent)
            );
            
            try {
                await Promise.all(savePromises);
                console.log(`✅ 双重记忆保存成功 [${roleId}]`);
            } catch (error) {
                console.error('双重记忆保存失败:', error);
            }
        }
        
        async getMemoryContext(roleId, query) {
            try {
                const promptxMemories = await this.promptxBridge.recall(roleId, query);
                return {
                    longTermMemories: promptxMemories.memories || [],
                    contextualResponse: promptxMemories.contextualResponse || ""
                };
            } catch (error) {
                console.error('记忆检索失败:', error);
                return { longTermMemories: [], contextualResponse: "" };
            }
        }
    }
    ```
    
    ### Step 4: 流式API开发（45分钟）
    
    #### 4.1 Server-Sent Events实现（30分钟）
    ```javascript
    // 流式响应API
    app.post('/api/chat/:roleId/stream', async (req, res) => {
        const { roleId } = req.params;
        const { message, sessionId = 'default' } = req.body;
        
        // 设置SSE响应头
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });
        
        try {
            const chain = conversationManager.getOrCreateSession(roleId, sessionId);
            
            // 使用LangChain的streaming功能
            await chain.stream({ input: message }, {
                callbacks: [{
                    handleLLMNewToken(token) {
                        // 实时发送token到前端
                        res.write(`data: ${JSON.stringify({
                            type: 'token',
                            content: token
                        })}\n\n`);
                    },
                    handleLLMEnd(output) {
                        // 流式结束
                        res.write(`data: ${JSON.stringify({
                            type: 'end',
                            content: output.response
                        })}\n\n`);
                        res.end();
                        
                        // 保存到双重记忆系统
                        dualMemoryManager.saveConversationMemory(
                            roleId, message, output.response
                        );
                    },
                    handleLLMError(error) {
                        res.write(`data: ${JSON.stringify({
                            type: 'error',
                            content: error.message
                        })}\n\n`);
                        res.end();
                    }
                }]
            });
            
        } catch (error) {
            console.error('流式对话失败:', error);
            res.write(`data: ${JSON.stringify({
                type: 'error',
                content: '抱歉，我现在无法回复，请稍后再试'
            })}\n\n`);
            res.end();
        }
    });
    ```
    
    #### 4.2 记忆演示API（15分钟）
    ```javascript
    // 记忆演示接口
    app.get('/api/memory/demo/:roleId', async (req, res) => {
        const { roleId } = req.params;
        
        try {
            // 获取LangChain记忆
            const session = conversationManager.getOrCreateSession(roleId, 'demo');
            const langchainMemory = await session.memory.loadMemoryVariables({});
            
            // 获取PromptX记忆
            const promptxMemories = await dualMemoryManager.promptxBridge.recall(roleId, '');
            
            res.json({
                success: true,
                data: {
                    langchain: {
                        history_count: langchainMemory.history?.length || 0,
                        last_interaction: new Date().toISOString(),
                        buffer: langchainMemory.history?.slice(-2).map(m => m.content).join('\n') || '暂无对话记录'
                    },
                    promptx: {
                        engrams_count: promptxMemories.memories?.length || 0,
                        average_strength: promptxMemories.memories?.length > 0 
                            ? (promptxMemories.memories.reduce((sum, m) => sum + (m.strength || 0.8), 0) / promptxMemories.memories.length).toFixed(2)
                            : 0,
                        recent_memories: promptxMemories.memories?.slice(-3).map(m => ({
                            content: m.content?.substring(0, 50) + '...',
                            timestamp: m.timestamp
                        })) || []
                    }
                }
            });
        } catch (error) {
            console.error('记忆演示失败:', error);
            res.status(500).json({
                success: false,
                error: '记忆演示数据获取失败'
            });
        }
    });
    ```
    
    ### Step 5: 整合测试优化（30分钟）
    
    #### 5.1 API测试脚本
    ```bash
    # 基础对话测试
    curl -X POST http://localhost:3001/api/chat/aria \
      -H "Content-Type: application/json" \
      -d '{"message": "你好，我今天心情不好"}'
    
    # 流式响应测试（需要支持SSE的工具）
    curl -N http://localhost:3001/api/chat/aria/stream \
      -H "Content-Type: application/json" \
      -d '{"message": "告诉我一个故事"}'
    
    # 记忆演示测试
    curl http://localhost:3001/api/memory/demo/aria
    ```
    
    #### 5.2 性能监控和日志
    ```javascript
    // 请求监控中间件
    app.use((req, res, next) => {
        const start = Date.now();
        const originalSend = res.send;
        
        res.send = function(data) {
            const duration = Date.now() - start;
            console.log(`📊 ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
            return originalSend.call(this, data);
        };
        
        next();
    });
    
    // 错误处理中间件
    app.use((error, req, res, next) => {
        console.error('❌ API错误:', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
        });
    });
    ```
  </process>

  <criteria>
    ## 验收标准
    
    ### 功能完整性
    - [ ] 基础对话API可用，支持3个角色差异化回复
    - [ ] LangChain集成正常，对话链管理稳定
    - [ ] PromptX桥接工作，双重记忆系统运行正常
    - [ ] 流式响应API稳定，SSE连接可靠
    - [ ] 记忆演示API完整，数据格式正确
    
    ### 性能指标
    - [ ] 基础API响应时间 < 2秒
    - [ ] 流式响应首字节时间 < 500ms
    - [ ] 并发20个请求不出错
    - [ ] 内存使用稳定，无明显泄漏
    - [ ] 错误恢复机制有效
    
    ### 集成质量
    - [ ] LangChain对话质量良好，角色差异明显
    - [ ] PromptX记忆保存和检索成功率 > 90%
    - [ ] 双重记忆系统协作正常
    - [ ] 前后端API对接无问题
    - [ ] CORS配置正确，跨域请求正常
    
    ### 开发质量
    - [ ] 代码结构清晰，职责分离明确
    - [ ] 错误处理完善，日志信息详细
    - [ ] 配置管理规范，环境变量使用正确
    - [ ] 降级方案可用，Mock实现稳定
    - [ ] 文档完整，部署说明清晰
    
    ### 演示准备
    - [ ] 所有API在演示环境稳定运行
    - [ ] 记忆演示效果震撼，双重记忆对比明显
    - [ ] 流式响应效果流畅，视觉冲击力强
    - [ ] 错误处理友好，异常情况下有合理降级
    - [ ] 现场演示成功率 > 95%
  </criteria>
</execution>