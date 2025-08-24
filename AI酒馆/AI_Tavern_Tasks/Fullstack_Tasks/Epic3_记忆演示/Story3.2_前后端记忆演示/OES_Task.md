# Story 3.2: 前后端协作记忆演示

## O (Objective)
实现完整的PromptX记忆演示功能，展示AI的记忆保存和回调能力，需要前后端紧密配合

## E (Environment)
- **前端**: 记忆展示UI组件
- **后端**: PromptX MCP工具集成
- **协作点**: API接口、数据格式、用户体验流程
- **演示目标**: 5-8分钟完整记忆演示

## S (Success Criteria)

### 及格标准
- ✅ 记忆保存功能正常工作
- ✅ 记忆回调演示成功
- ✅ 前后端数据同步正确
- ✅ 用户体验流畅

### 优秀标准
- ✅ 记忆演示效果震撼
- ✅ 实时记忆状态显示
- ✅ 记忆可视化展示
- ✅ 演示脚本化执行

## 前后端协作任务分解

### Task 3.2.1: 前后端接口设计和协议制定
**预估时间**: 1小时
**责任**: 全栈协作
**具体内容**:
- 制定记忆相关API接口规范
- 统一数据格式和错误处理
- 设计记忆演示流程

**API接口规范**:
```javascript
// POST /api/promptx/remember - 保存记忆
{
  "roleId": "aria",
  "content": "用户表达工作压力，感到疲惫",
  "context": {
    "emotion": "stressed",
    "topic": "work",
    "timestamp": "2024-01-01T10:00:00Z",
    "userInfo": {
      "mood": "tired",
      "concern": "work-life balance"
    }
  }
}

// Response
{
  "success": true,
  "data": {
    "memoryId": "uuid-string",
    "saved": true,
    "summary": "记住了用户的工作压力状况"
  }
}

// GET /api/promptx/recall/:roleId/:query - 回调记忆
{
  "success": true,
  "data": {
    "memories": [
      {
        "id": "uuid-string",
        "content": "用户之前提到工作压力",
        "relevance": 0.95,
        "timestamp": "2024-01-01T10:00:00Z"
      }
    ],
    "contextualResponse": "我记得你之前提到过工作很累..."
  }
}

// GET /api/promptx/memory-status/:roleId - 获取记忆状态
{
  "success": true,
  "data": {
    "totalMemories": 15,
    "activeMemories": 8,
    "memoryHealth": "good",
    "lastUpdate": "2024-01-01T10:30:00Z"
  }
}
```

### Task 3.2.2: 后端PromptX记忆集成实现
**预估时间**: 3小时
**责任**: 后端开发
**具体内容**:
- 集成PromptX MCP工具
- 实现记忆保存和回调逻辑
- 处理记忆数据格式化

**PromptX服务实现**:
```javascript
// services/promptxService.js
class PromptXService {
  constructor() {
    this.mcpClient = null; // MCP客户端
    this.activeRoles = new Map();
  }

  // 初始化MCP连接
  async initialize() {
    try {
      // 初始化MCP客户端连接
      this.mcpClient = await this.createMCPClient();
      console.log('PromptX MCP客户端已连接');
    } catch (error) {
      console.error('PromptX初始化失败:', error);
      throw error;
    }
  }

  // 激活角色
  async activateRole(roleId) {
    try {
      const result = await this.mcpClient.call('promptx_action', {
        role: roleId
      });

      if (result.success) {
        this.activeRoles.set(roleId, {
          activated: true,
          timestamp: new Date(),
          roleInfo: result.roleInfo
        });
      }

      return result;
    } catch (error) {
      console.error('角色激活失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 保存记忆
  async saveMemory(roleId, memoryData) {
    try {
      // 格式化记忆数据为PromptX Engram格式
      const engrams = this.formatMemoryAsEngrams(memoryData);

      const result = await this.mcpClient.call('promptx_remember', {
        role: roleId,
        engrams: engrams
      });

      return {
        success: result.success,
        memoryId: `${roleId}-${Date.now()}`,
        summary: this.generateMemorySummary(memoryData),
        saved: result.success
      };
    } catch (error) {
      console.error('记忆保存失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 回调记忆
  async recallMemory(roleId, query) {
    try {
      const result = await this.mcpClient.call('promptx_recall', {
        role: roleId,
        query: query
      });

      if (result.success && result.memories) {
        return {
          success: true,
          memories: result.memories.map(memory => ({
            id: memory.id || `recall-${Date.now()}`,
            content: memory.content,
            relevance: memory.strength || 0.8,
            timestamp: memory.timestamp || new Date().toISOString()
          })),
          contextualResponse: this.generateContextualResponse(result.memories, query)
        };
      }

      return { success: false, memories: [] };
    } catch (error) {
      console.error('记忆回调失败:', error);
      return { success: false, error: error.message, memories: [] };
    }
  }

  // 格式化记忆为Engram格式
  formatMemoryAsEngrams(memoryData) {
    const engrams = [];

    // 主要内容
    if (memoryData.content) {
      engrams.push({
        content: memoryData.content,
        schema: `用户状态\n  情感\n    ${memoryData.context?.emotion || '未知'}`,
        strength: 0.9,
        type: "ATOMIC"
      });
    }

    // 上下文信息
    if (memoryData.context) {
      if (memoryData.context.topic) {
        engrams.push({
          content: `话题关于${memoryData.context.topic}`,
          schema: `对话主题\n  ${memoryData.context.topic}`,
          strength: 0.7,
          type: "LINK"
        });
      }

      if (memoryData.context.userInfo) {
        const userInfo = memoryData.context.userInfo;
        Object.entries(userInfo).forEach(([key, value]) => {
          engrams.push({
            content: `用户${key}是${value}`,
            schema: `用户信息\n  ${key}\n    ${value}`,
            strength: 0.6,
            type: "ATOMIC"
          });
        });
      }
    }

    return engrams;
  }

  // 生成记忆摘要
  generateMemorySummary(memoryData) {
    const emotion = memoryData.context?.emotion || '情绪';
    const topic = memoryData.context?.topic || '话题';
    return `记住了用户的${emotion}状态，涉及${topic}相关内容`;
  }

  // 生成上下文回应
  generateContextualResponse(memories, query) {
    if (!memories || memories.length === 0) {
      return "我没有找到相关的记忆";
    }

    const highRelevanceMemories = memories.filter(m => m.strength > 0.7);
    if (highRelevanceMemories.length > 0) {
      return `我记得你之前提到过${query}相关的内容...`;
    }

    return "我有一些相关的记忆，但不是很清晰";
  }

  // 获取记忆状态
  async getMemoryStatus(roleId) {
    try {
      // 这里可以调用PromptX的状态查询接口
      const activeRole = this.activeRoles.get(roleId);
      
      return {
        success: true,
        data: {
          totalMemories: 15, // 模拟数据，实际应从PromptX获取
          activeMemories: 8,
          memoryHealth: "good",
          roleActivated: !!activeRole,
          lastUpdate: new Date().toISOString()
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

### Task 3.2.3: 前端记忆展示组件实现
**预估时间**: 3小时
**责任**: 前端开发
**具体内容**:
- 创建记忆可视化组件
- 实现记忆状态实时显示
- 设计记忆演示交互

**记忆展示组件**:
```javascript
// js/components/MemoryDisplay.js
class MemoryDisplay {
  constructor(container, apiService) {
    this.container = container;
    this.apiService = apiService;
    this.memories = [];
    this.currentRoleId = 'aria';
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.startMemoryStatusPolling();
  }

  render() {
    this.container.innerHTML = `
      <div class="memory-display">
        <div class="memory-header">
          <h2>🧠 AI记忆状态</h2>
          <div class="memory-stats">
            <div class="stat">
              <span class="stat-label">总记忆</span>
              <span class="stat-value" id="total-memories">0</span>
            </div>
            <div class="stat">
              <span class="stat-label">活跃记忆</span>
              <span class="stat-value" id="active-memories">0</span>
            </div>
            <div class="stat">
              <span class="stat-label">记忆健康度</span>
              <span class="stat-value" id="memory-health">良好</span>
            </div>
          </div>
        </div>

        <div class="memory-actions">
          <button id="save-memory-btn" class="btn btn--primary">
            💾 保存当前记忆
          </button>
          <button id="recall-memory-btn" class="btn btn--secondary">
            🔍 回调相关记忆
          </button>
          <button id="demo-memory-btn" class="btn btn--accent">
            🎭 演示记忆能力
          </button>
        </div>

        <div class="memory-content">
          <div class="memory-list" id="memory-list">
            <!-- 记忆项目会动态添加到这里 -->
          </div>
        </div>

        <div class="memory-demo" id="memory-demo" style="display: none;">
          <div class="demo-steps">
            <div class="demo-step active" data-step="1">
              <span class="step-number">1</span>
              <span class="step-text">用户表达情感</span>
            </div>
            <div class="demo-step" data-step="2">
              <span class="step-number">2</span>
              <span class="step-text">AI保存记忆</span>
            </div>
            <div class="demo-step" data-step="3">
              <span class="step-number">3</span>
              <span class="step-text">切换对话或刷新</span>
            </div>
            <div class="demo-step" data-step="4">
              <span class="step-number">4</span>
              <span class="step-text">AI主动回忆</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // 保存记忆按钮
    document.getElementById('save-memory-btn').addEventListener('click', () => {
      this.saveMemoryDemo();
    });

    // 回调记忆按钮
    document.getElementById('recall-memory-btn').addEventListener('click', () => {
      this.recallMemoryDemo();
    });

    // 演示按钮
    document.getElementById('demo-memory-btn').addEventListener('click', () => {
      this.startFullDemo();
    });
  }

  // 轮询记忆状态
  startMemoryStatusPolling() {
    this.updateMemoryStatus();
    
    setInterval(() => {
      this.updateMemoryStatus();
    }, 5000); // 每5秒更新一次
  }

  // 更新记忆状态
  async updateMemoryStatus() {
    try {
      const response = await this.apiService.get(`/api/promptx/memory-status/${this.currentRoleId}`);
      
      if (response.success) {
        const { totalMemories, activeMemories, memoryHealth } = response.data;
        
        document.getElementById('total-memories').textContent = totalMemories;
        document.getElementById('active-memories').textContent = activeMemories;
        document.getElementById('memory-health').textContent = memoryHealth === 'good' ? '良好' : '需要优化';
      }
    } catch (error) {
      console.error('获取记忆状态失败:', error);
    }
  }

  // 保存记忆演示
  async saveMemoryDemo() {
    try {
      this.showLoadingState('正在保存记忆...');

      const memoryData = {
        content: "用户表达了工作压力，感到疲惫和困惑",
        context: {
          emotion: "stressed",
          topic: "work",
          timestamp: new Date().toISOString(),
          userInfo: {
            mood: "tired",
            concern: "work-life balance"
          }
        }
      };

      const response = await this.apiService.post('/api/promptx/remember', {
        roleId: this.currentRoleId,
        ...memoryData
      });

      if (response.success) {
        this.addMemoryToList({
          id: response.data.memoryId,
          content: memoryData.content,
          summary: response.data.summary,
          timestamp: new Date().toISOString(),
          type: 'saved'
        });

        this.showSuccessMessage('记忆已成功保存！');
      } else {
        throw new Error(response.error || '保存失败');
      }
    } catch (error) {
      this.showErrorMessage('保存记忆失败: ' + error.message);
    } finally {
      this.hideLoadingState();
    }
  }

  // 回调记忆演示
  async recallMemoryDemo() {
    try {
      this.showLoadingState('正在回忆相关记忆...');

      const response = await this.apiService.get(`/api/promptx/recall/${this.currentRoleId}/工作压力`);

      if (response.success && response.data.memories) {
        response.data.memories.forEach(memory => {
          this.addMemoryToList({
            ...memory,
            type: 'recalled'
          });
        });

        if (response.data.contextualResponse) {
          this.showContextualResponse(response.data.contextualResponse);
        }

        this.showSuccessMessage(`回忆到 ${response.data.memories.length} 条相关记忆`);
      } else {
        this.showInfoMessage('没有找到相关记忆');
      }
    } catch (error) {
      this.showErrorMessage('回调记忆失败: ' + error.message);
    } finally {
      this.hideLoadingState();
    }
  }

  // 完整演示流程
  async startFullDemo() {
    const demoContainer = document.getElementById('memory-demo');
    demoContainer.style.display = 'block';

    // 演示步骤1: 用户表达情感
    await this.demoStep(1, async () => {
      this.showContextualResponse("用户: 最近工作压力好大，感觉很疲惫...");
      await this.sleep(2000);
    });

    // 演示步骤2: AI保存记忆
    await this.demoStep(2, async () => {
      await this.saveMemoryDemo();
      await this.sleep(2000);
    });

    // 演示步骤3: 模拟刷新
    await this.demoStep(3, async () => {
      this.showContextualResponse("📄 页面刷新 / 新的对话开始...");
      this.clearMemoryList();
      await this.sleep(2000);
    });

    // 演示步骤4: AI主动回忆
    await this.demoStep(4, async () => {
      await this.recallMemoryDemo();
      this.showContextualResponse("AI: 我记得你之前提到过工作压力的问题，现在感觉怎么样？");
    });

    // 演示完成
    setTimeout(() => {
      demoContainer.style.display = 'none';
      this.showSuccessMessage('🎉 记忆演示完成！PromptX的记忆能力展示成功！');
    }, 3000);
  }

  // 演示步骤执行
  async demoStep(stepNumber, callback) {
    // 高亮当前步骤
    document.querySelectorAll('.demo-step').forEach(step => {
      step.classList.remove('active');
    });
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

    // 执行步骤回调
    await callback();
  }

  // 添加记忆到列表
  addMemoryToList(memory) {
    const memoryList = document.getElementById('memory-list');
    const memoryItem = document.createElement('div');
    memoryItem.className = `memory-item memory-item--${memory.type}`;
    
    memoryItem.innerHTML = `
      <div class="memory-content">
        <div class="memory-text">${memory.content}</div>
        <div class="memory-meta">
          <span class="memory-time">${new Date(memory.timestamp).toLocaleTimeString()}</span>
          <span class="memory-relevance">相关度: ${Math.round((memory.relevance || 0.8) * 100)}%</span>
        </div>
      </div>
      <div class="memory-type-badge">${memory.type === 'saved' ? '已保存' : '已回忆'}</div>
    `;

    memoryList.appendChild(memoryItem);
    
    // 添加动画
    requestAnimationFrame(() => {
      memoryItem.classList.add('memory-item--visible');
    });
  }

  // 工具方法
  showLoadingState(message) {
    // 实现Loading状态显示
  }

  hideLoadingState() {
    // 隐藏Loading状态
  }

  showSuccessMessage(message) {
    // 显示成功消息
    console.log('✅', message);
  }

  showErrorMessage(message) {
    // 显示错误消息
    console.error('❌', message);
  }

  showInfoMessage(message) {
    // 显示信息消息
    console.log('ℹ️', message);
  }

  showContextualResponse(message) {
    // 显示上下文回应
    const responseDiv = document.createElement('div');
    responseDiv.className = 'contextual-response';
    responseDiv.textContent = message;
    this.container.appendChild(responseDiv);
  }

  clearMemoryList() {
    document.getElementById('memory-list').innerHTML = '';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Task 3.2.4: 演示脚本优化和测试
**预估时间**: 2小时
**责任**: 全栈协作
**具体内容**:
- 优化演示流程和时间控制
- 测试前后端集成效果
- 准备演示数据和场景

## 验收标准
1. 前后端API接口完全对接成功
2. 记忆保存和回调功能正常工作
3. 演示效果震撼，流程流畅
4. 错误处理完善，用户体验良好
5. 演示时间控制在2-3分钟内

## 演示效果目标
- 用户看到AI能"记住"之前的对话
- 体验到PromptX记忆系统的强大能力
- 理解AI Agent的持久化记忆概念
- 感受到技术的实用性和未来潜力