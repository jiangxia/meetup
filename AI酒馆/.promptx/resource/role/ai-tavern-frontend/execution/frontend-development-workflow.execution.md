<execution>
  <constraint>
    ## 技术约束条件
    - **时间限制**：22小时总开发时间，前端开发约4小时（基于简化架构优化）
    - **技术栈限制**：HTML5 + CSS3 + Vanilla JS，不使用React/Vue等框架
    - **浏览器兼容**：现代浏览器优先，Chrome/Safari/Firefox最新版
    - **设备适配**：响应式设计，支持手机到桌面的全设备访问
    - **网络依赖**：依赖后端API，需要处理网络异常和延迟
    - **演示导向**：所有功能都要服务于5-8分钟的现场演示效果
  </constraint>

  <rule>
    ## 开发规则
    - **MVP优先原则**：核心功能完成后再考虑视觉优化
    - **渐进增强原则**：基础功能先实现，高级功能作为增强
    - **组件化开发**：虽然不用框架，但要保持代码的模块化组织
    - **错误处理强制**：每个API调用都必须有错误处理和重试机制
    - **状态管理规范**：使用简单状态机管理界面状态转换
    - **性能监控**：关键操作必须有loading状态和性能监控
    - **演示友好**：界面要有足够的视觉冲击力和流畅度
  </rule>

  <guideline>
    ## 开发指导原则
    
    ### 代码组织原则
    - **文件职责单一**：每个JS文件负责一个主要功能模块
    - **CSS类名语义化**：使用BEM命名规范补充TailwindCSS
    - **配置集中管理**：所有配置信息统一在config.js中管理
    - **API接口统一**：通过api-client.js统一管理所有后端交互
    
    ### UI/UX设计原则
    - **一致性优先**：保持整体视觉和交互的一致性
    - **反馈及时性**：用户操作后立即给出视觉反馈
    - **信息层次清晰**：通过字体大小、颜色、间距建立信息层次
    - **减少认知负担**：界面简洁明了，避免信息过载
    
    ### 性能优化原则
    - **资源懒加载**：非首屏内容延迟加载
    - **DOM操作最小化**：减少不必要的DOM查询和修改
    - **事件委托**：使用事件委托减少事件监听器数量
    - **内存管理**：及时清理事件监听器和定时器
  </guideline>

  <process>
    ## 具体开发流程
    
    ### Step 1: 项目初始化（30分钟）
    
    #### 1.1 目录结构创建
    ```
    frontend/
    ├── index.html
    ├── assets/
    │   ├── css/custom.css
    │   ├── js/
    │   │   ├── config.js
    │   │   ├── api-client.js
    │   │   ├── app.js
    │   │   └── components/
    │   └── images/
    └── README.md
    ```
    
    #### 1.2 TailwindCSS配置
    - CDN引入和自定义主题配置
    - 酒馆色彩系统定义（tavern-*色彩变量）
    - Google Fonts字体集成（Cinzel字体）
    - 响应式断点和动画配置
    
    #### 1.3 基础HTML架构
    - 语义化HTML结构
    - 应用容器和路由容器
    - Meta标签和SEO优化
    - 无障碍访问支持
    
    ### Step 2: 核心组件开发（90分钟）
    
    #### 2.1 通用组件开发（30分钟）
    ```javascript
    // 按钮组件
    class Button {
        constructor(text, variant, onClick) {}
        render() {}
        bindEvents() {}
    }
    
    // 卡片组件  
    class Card {
        constructor(content, className) {}
        render() {}
        addAnimation() {}
    }
    
    // 模态框组件
    class Modal {
        constructor(content) {}
        show() {}
        hide() {}
    }
    ```
    
    #### 2.2 角色选择组件（30分钟）
    ```javascript
    class RoleSelector {
        constructor() {
            this.selectedRole = null;
            this.roles = CONFIG.ROLES;
        }
        
        render() {
            // 渲染角色卡片网格
        }
        
        handleRoleSelect(roleId) {
            // 处理角色选择逻辑
        }
        
        activateRole(roleId) {
            // 调用后端激活API
        }
    }
    ```
    
    #### 2.3 对话界面组件（30分钟）
    ```javascript
    class ChatInterface {
        constructor(roleData) {
            this.roleData = roleData;
            this.messages = [];
            this.isTyping = false;
        }
        
        render() {
            // 渲染对话界面
        }
        
        addMessage(message) {
            // 添加消息到界面
        }
        
        sendMessage(content) {
            // 发送用户消息
        }
    }
    ```
    
    ### Step 3: 高级功能集成（90分钟）
    
    #### 3.1 流式响应集成（45分钟）
    ```javascript
    class StreamingClient {
        constructor(apiClient) {
            this.apiClient = apiClient;
            this.eventSource = null;
        }
        
        startStream(roleId, message, callbacks) {
            // 建立SSE连接
            // 处理流式数据
            // 实现打字效果
        }
    }
    ```
    
    #### 3.2 PromptX记忆演示组件（45分钟）
    ```javascript
    class PromptXMemoryDemo {
        constructor(roleData) {
            this.roleData = roleData;
            this.memoryVisualization = null;
        }
        
        showDemo() {
            // 显示PromptX记忆演示界面
            // 展示基于MCP协议的记忆功能
        }
        
        runMemoryDemoSequence() {
            // 演示3层架构的记忆系统
            // 第1层：角色状态 → 第2层：短期对话 → 第3层：长期PromptX记忆
        }
        
        updateMemoryVisualization(memoryData) {
            // 实时更新PromptX记忆的可视化展示
            // 显示记忆保存和回调过程
        }
    }
    ```
    
    ### Step 4: 应用整合（60分钟）
    
    #### 4.1 状态管理（20分钟）
    ```javascript
    const AppState = {
        ROLE_SELECTION: 'role-selection',
        CHAT_ACTIVE: 'chat-active', 
        MEMORY_DEMO: 'memory-demo'
    };
    
    class StateManager {
        constructor() {
            this.currentState = AppState.ROLE_SELECTION;
            this.stateHistory = [];
        }
        
        transition(newState, data) {
            // 状态切换逻辑
        }
    }
    ```
    
    #### 4.2 路由管理（20分钟）
    ```javascript
    class Router {
        constructor() {
            this.routes = new Map();
            this.currentRoute = null;
        }
        
        register(path, component) {
            this.routes.set(path, component);
        }
        
        navigate(path, data) {
            // 路由切换逻辑
        }
    }
    ```
    
    #### 4.3 全局事件处理（20分钟）
    ```javascript
    class EventBus {
        constructor() {
            this.events = new Map();
        }
        
        on(event, callback) {}
        emit(event, data) {}
        off(event, callback) {}
    }
    ```
    
    ### Step 5: 测试和优化（30分钟）
    
    #### 5.1 功能测试
    - 角色选择和激活流程
    - 对话发送和接收
    - 流式响应效果
    - 记忆演示完整性
    
    #### 5.2 兼容性测试
    - Chrome/Safari/Firefox测试
    - 移动端和桌面端测试
    - 网络异常场景测试
    
    #### 5.3 性能优化
    - 加载时间优化
    - 动画流畅度优化
    - 内存泄漏检查
    - 错误日志收集
  </process>

  <criteria>
    ## 验收标准
    
    ### 功能完整性
    - [ ] 角色选择界面可用，支持Aria、Morgan、Sean三个角色
    - [ ] 对话功能正常，基于原生+MCP架构的消息收发
    - [ ] 流式响应效果流畅，实现实时打字效果
    - [ ] PromptX记忆演示震撼，3层架构可视化效果明显
    - [ ] MCP API集成正常，优雅降级机制完善
    
    ### 用户体验
    - [ ] 界面加载时间 < 3秒
    - [ ] 交互响应时间 < 100ms
    - [ ] 动画效果流畅，无明显卡顿
    - [ ] 响应式适配良好，移动端体验优秀
    - [ ] 错误提示友好，恢复机制有效
    
    ### 视觉设计
    - [ ] 酒馆主题统一，色彩搭配协调
    - [ ] 字体层次清晰，信息结构合理
    - [ ] 组件样式一致，视觉语言统一
    - [ ] 角色差异化明显，个性特征突出
    - [ ] 整体美观度达到演示标准
    
    ### 技术质量
    - [ ] 代码结构清晰，职责分离明确
    - [ ] 无JavaScript错误，控制台日志干净
    - [ ] 内存使用合理，无明显泄漏
    - [ ] 网络请求优化，重试机制完善
    - [ ] 兼容性良好，支持主流浏览器
    
    ### 演示准备
    - [ ] 演示流程顺畅，5-8分钟内完成
    - [ ] 视觉冲击力强，技术亮点突出
    - [ ] 降级方案可用，应急准备充分
    - [ ] 现场演示稳定性高，成功率 > 95%
  </criteria>
</execution>