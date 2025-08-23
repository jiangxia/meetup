<execution>
  <constraint>
    ## 集成协调约束
    - **时间窗口**：48小时黑客松，最后12小时必须专注集成调试
    - **技术栈约束**：前端Vanilla JS + 后端Node.js，跨域CORS处理必需
    - **演示要求**：5-8分钟现场演示，任何集成问题都可能导致演示失败
    - **人员协调**：前后端开发者需要高效协作，避免重复工作和冲突
    - **环境限制**：开发环境 vs 演示环境可能存在差异，需要提前验证
  </constraint>

  <rule>
    ## 强制执行规则
    - **接口先行原则**：开发前必须先定义完整API规范，禁止边开发边定义
    - **分阶段集成原则**：每4小时必须进行一次集成验证，禁止到最后才集成
    - **Mock数据必备原则**：所有外部依赖都要有Mock实现，禁止阻塞开发
    - **降级方案强制原则**：每个集成点都要有备选方案，禁止单点故障
    - **错误处理统一原则**：前后端错误处理格式必须统一，禁止技术错误暴露给用户
    - **演示优先原则**：所有技术选择都服务于演示效果，禁止过度工程化
  </rule>

  <guideline>
    ## 集成协调指导原则
    
    ### 沟通协调原则
    - **文档驱动**：重要决策和接口变更必须有文档记录
    - **同步开发**：前后端开发进度保持同步，避免一方等待另一方
    - **快速反馈**：集成问题要在1小时内反馈，避免问题积累
    - **共同责任**：集成成功是团队责任，不是某一方的责任
    
    ### 技术实现原则
    - **简单可靠**：选择最简单可靠的集成方案，避免复杂架构
    - **可测试性**：每个集成点都要可独立测试
    - **可监控性**：集成状态要可观测，便于问题定位
    - **可回滚性**：每个集成步骤都要可回滚到上一个稳定状态
  </guideline>

  <process>
    ## 详细集成协调流程
    
    ### Step 1: API规范制定（0-1小时）
    
    #### 1.1 核心API接口定义
    ```javascript
    // API规范文档
    const API_SPEC = {
      // 角色激活
      "POST /api/roles/:roleId/activate": {
        request: { sessionId: "string?" },
        response: {
          success: true,
          data: {
            roleId: "string",
            roleName: "string", 
            activated: true,
            timestamp: "ISO string"
          }
        }
      },
      
      // 基础对话
      "POST /api/chat/:roleId": {
        request: { 
          message: "string", 
          sessionId: "string?" 
        },
        response: {
          success: true,
          data: {
            message: "string",
            role: "string",
            timestamp: "ISO string",
            memoryUpdated: boolean
          }
        }
      },
      
      // 流式对话
      "POST /api/chat/:roleId/stream": {
        request: { 
          message: "string", 
          sessionId: "string?" 
        },
        response: "SSE Stream",
        format: [
          'data: {"type": "token", "content": "word"}',
          'data: {"type": "end", "content": "full response"}',
          'data: {"type": "error", "content": "error message"}'
        ]
      },
      
      // 记忆演示
      "GET /api/memory/demo/:roleId": {
        response: {
          success: true,
          data: {
            langchain: {
              history_count: "number",
              last_interaction: "ISO string", 
              buffer: "string"
            },
            promptx: {
              engrams_count: "number",
              average_strength: "number",
              recent_memories: "array"
            }
          }
        }
      }
    };
    ```
    
    #### 1.2 错误响应标准
    ```javascript
    // 统一错误格式
    {
      "success": false,
      "error": "用户友好的错误信息",
      "code": "ERROR_CODE", // 技术错误码
      "timestamp": "ISO string"
    }
    
    // 常见错误码
    const ERROR_CODES = {
      "ROLE_NOT_FOUND": "角色不存在",
      "LLM_API_ERROR": "AI服务暂时不可用",
      "MEMORY_SAVE_FAILED": "记忆保存失败", 
      "STREAM_CONNECTION_ERROR": "连接中断",
      "PROMPTX_INTEGRATION_ERROR": "记忆系统集成错误"
    };
    ```
    
    ### Step 2: 集成测试环境搭建（1-2小时）
    
    #### 2.1 Mock服务器创建
    ```javascript
    // mock-server.js - 前端开发期间的Mock API
    const express = require('express');
    const cors = require('cors');
    const app = express();
    
    app.use(cors());
    app.use(express.json());
    
    // Mock数据
    const MOCK_RESPONSES = {
      aria: "作为你的温柔调酒师，我理解你的感受...",
      morgan: "听起来你需要一些直接的建议...",
      sean: "从产品思维角度，我们来分析一下..."
    };
    
    // Mock API实现
    app.post('/api/chat/:roleId', (req, res) => {
      const { roleId } = req.params;
      const { message } = req.body;
      
      setTimeout(() => {
        res.json({
          success: true,
          data: {
            message: MOCK_RESPONSES[roleId] || MOCK_RESPONSES.aria,
            role: roleId,
            timestamp: new Date().toISOString(),
            memoryUpdated: true
          }
        });
      }, 500); // 模拟网络延迟
    });
    
    app.listen(3001, () => {
      console.log('🎭 Mock API Server running on port 3001');
    });
    ```
    
    #### 2.2 集成测试用例
    ```javascript
    // integration-tests.js
    const testCases = [
      {
        name: "基础对话API测试",
        method: "POST",
        url: "/api/chat/aria",
        body: { message: "你好" },
        expect: {
          success: true,
          data: { role: "aria" }
        }
      },
      {
        name: "流式响应测试",
        method: "SSE",
        url: "/api/chat/aria/stream",
        body: { message: "告诉我一个故事" },
        expect: "token流正常接收"
      },
      {
        name: "记忆演示API测试",
        method: "GET", 
        url: "/api/memory/demo/aria",
        expect: {
          success: true,
          data: { langchain: {}, promptx: {} }
        }
      }
    ];
    ```
    
    ### Step 3: 分阶段集成验证（每4小时）
    
    #### 3.1 集成检查清单模板
    ```markdown
    ## 集成检查清单 - [时间点]
    
    ### API对接验证
    - [ ] 所有接口返回格式符合规范
    - [ ] 错误处理响应正确
    - [ ] CORS配置正常工作
    - [ ] 数据类型校验通过
    
    ### 功能集成验证  
    - [ ] 角色激活功能正常
    - [ ] 对话收发功能正常
    - [ ] 流式响应效果正常
    - [ ] 记忆演示功能正常
    
    ### 用户体验验证
    - [ ] 界面状态转换正常
    - [ ] Loading状态显示正常
    - [ ] 错误提示用户友好
    - [ ] 整体操作流程流畅
    
    ### 问题记录
    - 问题描述：
    - 复现步骤：
    - 解决方案：
    - 负责人：
    ```
    
    #### 3.2 快速问题诊断流程
    ```mermaid
    flowchart TD
        A[发现集成问题] --> B{前端问题?}
        B -->|是| C[检查API调用参数]
        B -->|否| D[检查后端响应格式]
        C --> E[检查网络请求状态]
        D --> F[检查服务器日志]
        E --> G[定位具体错误]
        F --> G
        G --> H[1小时内修复]
        H --> I[重新验证]
        I --> J{修复成功?}
        J -->|是| K[继续开发]
        J -->|否| L[启动降级方案]
    ```
    
    ### Step 4: 端到端演示验证（32-36小时）
    
    #### 4.1 完整演示场景测试
    ```javascript
    // 演示脚本自动化测试
    const demonstrationScenarios = [
      {
        name: "场景1：初次体验流程",
        steps: [
          "打开应用 → 角色选择界面加载",
          "选择Aria角色 → 激活动画播放", 
          "发送消息'今天工作很累' → AI回复接收",
          "检查LangChain记忆保存 → 状态确认",
          "检查PromptX记忆保存 → 状态确认"
        ],
        expectedDuration: "2分钟",
        successCriteria: "所有步骤无报错，用户体验流畅"
      },
      {
        name: "场景2：记忆演示流程",
        steps: [
          "点击记忆演示按钮 → 演示界面打开",
          "观察双重记忆可视化 → 数据正确显示",
          "模拟页面刷新 → 重新激活角色",
          "AI主动回忆之前内容 → 记忆功能验证",
          "展示角色推荐 → 推荐界面正常"
        ],
        expectedDuration: "3分钟", 
        successCriteria: "记忆演示震撼，技术亮点突出"
      }
    ];
    ```
    
    #### 4.2 演示环境验证
    ```bash
    # 演示环境检查脚本
    #!/bin/bash
    echo "🎯 AI酒馆演示环境验证"
    
    # 检查端口可用性
    curl -f http://localhost:3001/health || echo "❌ 后端服务未启动"
    
    # 检查前端资源
    curl -f http://localhost:8080 || echo "❌ 前端服务未启动"
    
    # 检查API连通性
    curl -X POST http://localhost:3001/api/chat/aria \
         -H "Content-Type: application/json" \
         -d '{"message":"test"}' || echo "❌ API连接失败"
    
    # 检查流式响应
    timeout 5s curl -N http://localhost:3001/api/chat/aria/stream \
         -H "Content-Type: application/json" \
         -d '{"message":"test"}' || echo "❌ 流式响应失败"
         
    echo "✅ 环境检查完成"
    ```
    
    ### Step 5: 应急预案准备（36-40小时）
    
    #### 5.1 降级方案实现
    ```javascript
    // 前端降级配置
    const FALLBACK_CONFIG = {
      // 流式响应降级
      enableStreaming: process.env.ENABLE_STREAMING !== 'false',
      streamingFallback: {
        enabled: true,
        typingSpeed: 50, // ms per character
        method: 'simulate' // 模拟打字效果
      },
      
      // PromptX集成降级
      enablePromptX: process.env.ENABLE_PROMPTX !== 'false',
      promptxFallback: {
        enabled: true,
        method: 'mock', // 使用Mock数据
        mockMemories: [
          { content: "用户提到工作压力大", timestamp: "2024-01-01" },
          { content: "喜欢喝温和的鸡尾酒", timestamp: "2024-01-01" }
        ]
      },
      
      // API降级
      apiTimeout: 5000, // 5秒超时
      retryAttempts: 2,
      fallbackToLocal: true // 使用本地Mock数据
    };
    ```
    
    #### 5.2 演示备选方案
    ```markdown
    ## 演示应急预案
    
    ### Plan A: 完整功能演示 (目标方案)
    - 所有功能正常工作
    - 实时LLM对话
    - 双重记忆系统演示
    - 流式响应效果
    
    ### Plan B: 核心功能演示 (可接受)
    - 基础对话功能正常
    - PromptX记忆Mock演示
    - 去掉流式效果，用基础对话
    
    ### Plan C: 演示脚本方案 (保底)
    - 预录制关键演示片段
    - 准备固定的对话脚本
    - 手动切换演示场景
    
    ### Plan D: 纯概念演示 (最后备选)
    - PPT + 架构图展示
    - 代码片段展示
    - 技术原理讲解
    ```
  </process>

  <criteria>
    ## 集成验收标准
    
    ### 技术集成标准
    - [ ] 所有API接口响应格式100%符合规范
    - [ ] 前后端数据传输无格式错误
    - [ ] CORS配置在所有环境正常工作
    - [ ] 错误处理链路完整，用户友好
    - [ ] 流式响应稳定性 > 95%
    
    ### 功能完整性标准
    - [ ] 角色激活功能100%成功
    - [ ] 对话功能支持3个角色差异化
    - [ ] 记忆演示双重系统对比清晰
    - [ ] 所有演示场景流程完整
    - [ ] 降级方案全部可用
    
    ### 演示质量标准
    - [ ] 5-8分钟演示流程无卡顿
    - [ ] 视觉效果震撼，技术亮点突出
    - [ ] 现场演示成功率 > 95%
    - [ ] 应急切换时间 < 30秒
    - [ ] 用户体验流畅自然
    
    ### 协作效率标准
    - [ ] 前后端开发进度同步
    - [ ] 集成问题解决时间 < 1小时
    - [ ] 文档覆盖率100%
    - [ ] 团队沟通高效无阻塞
    - [ ] 知识共享充分
  </criteria>
</execution>