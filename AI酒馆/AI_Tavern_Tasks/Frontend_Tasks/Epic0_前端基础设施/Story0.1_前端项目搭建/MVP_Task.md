# Story 0.1: MVP前端项目搭建 - TailwindCSS版

## O (Objective)
创建AI酒馆MVP的前端基础结构，**TailwindCSS专业版本，平衡开发效率与演示效果**

## E (Environment)
- **技术选型**: HTML5 + TailwindCSS + 原生JavaScript
- **样式框架**: TailwindCSS CDN版本，酒馆主题定制
- **开发时间**: 5.5小时 (比原生CSS节省2小时)
- **部署方式**: 静态托管 (本地/Vercel/Netlify)

## S (Success Criteria)

### MVP验证标准
- ✅ TailwindCSS酒馆主题视觉效果专业
- ✅ 角色选择界面美观，激活流程流畅
- ✅ 对话界面支持流式响应，打字效果震撼
- ✅ 记忆演示界面可视化效果震撼

## 🔧 TailwindCSS目录结构 (专业版)

```
frontend/
├── index.html              # TailwindCSS主页面
├── assets/
│   ├── css/
│   │   └── custom.css      # 自定义样式补充
│   ├── js/
│   │   ├── app.js          # 应用主逻辑
│   │   ├── config.js       # 配置和角色数据
│   │   ├── api-client.js   # API和SSE客户端
│   │   └── components/     # 组件化模块
│   │       ├── role-selector.js
│   │       ├── chat-interface.js
│   │       └── memory-demo.js
│   └── images/
│       ├── tavern-bg.jpg   # 酒馆背景
│       ├── aria-avatar.png # 角色头像
│       └── morgan-avatar.png
├── README.md               # 项目说明和启动指南
└── package.json            # 静态托管配置（可选）
```

## 任务分解概览

**⚠️ 重要提示：完整的详细任务分解请参考：**
📋 **[TailwindCSS前端详细任务分解](./TailwindCSS_Frontend_Tasks.md)**

### 快速概览

#### Phase F1: 基础架构 (3小时)
- **F1.1**: TailwindCSS配置和酒馆主题 (45分钟)
- **F1.2**: 设计系统和组件库 (60分钟) 
- **F1.3**: 角色选择界面 (75分钟)

#### Phase F2: 核心功能 (2.5小时)
- **F2.1**: 对话界面和消息展示 (90分钟)
- **F2.2**: SSE流式响应集成 (45分钟)
- **F2.3**: 记忆演示可视化界面 (60分钟)

## ⚡ TailwindCSS技术优势

### 1. 开发效率提升
- ✅ **CDN即用**: 无需构建工具，直接使用
- ✅ **酒馆主题**: 预设色彩系统，快速专业视觉
- ✅ **组件化设计**: 标准化样式类，减少CSS编写
- ✅ **响应式设计**: 内置移动端适配

### 2. 演示效果增强
- ✅ **专业级UI**: 对比原生CSS有显著视觉提升
- ✅ **流畅动画**: 内置transition和transform效果
- ✅ **主题一致性**: 统一的酒馆视觉风格
- ✅ **现代感强**: 符合当前UI设计趋势

### 3. 维护性改善
- ✅ **类名规范**: 标准化的CSS类命名
- ✅ **组件复用**: 样式组件可复用
- ✅ **扩展方便**: 容易添加新功能和样式
- ✅ **调试友好**: 类名语义化，便于调试

## 🎨 酒馆主题设计系统

### 核心色彩方案
```javascript
// TailwindCSS 自定义主题
colors: {
    tavern: {
        dark: '#1a1410',      // 深色背景
        warm: '#8b4513',      // 温暖棕色  
        gold: '#ffd700',      // 金色点缀
        amber: '#fbbf24',     // 琥珀色
    }
}
```

### 组件样式库
- **按钮**: 金色主要按钮 + 透明次要按钮
- **卡片**: 磨砂玻璃效果 + 金色边框
- **消息**: 用户/AI消息气泡差异化
- **输入框**: 暗色主题 + 金色焦点

## 🔧 核心功能实现

### 角色选择界面
- 角色卡片Grid布局
- Hover放大效果
- 激活动画反馈
- 状态管理完善

### 流式对话界面
- SSE客户端集成
- 实时打字效果
- 消息滚动管理
- 状态指示器

### 记忆演示界面
- 双重记忆可视化
- 演示序列控制
- 步骤指示器
- 数据图表展示

### Task 0.1.1: TailwindCSS基础架构 (45分钟)
**技术重点**: CDN集成 + 酒馆主题配置

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI酒馆 MVP - PromptX演示</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <!-- 角色选择区域 -->
        <div id="role-section">
            <h2>🍺 AI酒馆 - 选择你的调酒师</h2>
            <div class="roles">
                <button class="role-btn" data-role="aria">Aria - 温柔调酒师</button>
                <button class="role-btn" data-role="morgan">Morgan - 资深调酒师</button>
                <button class="role-btn" data-role="sean">Sean - 创业导师</button>
            </div>
        </div>

        <!-- 对话区域 -->
        <div id="chat-section" style="display:none;">
            <div id="messages"></div>
            <div id="input-area">
                <input type="text" id="user-input" placeholder="和AI调酒师聊聊...">
                <button id="send-btn">发送</button>
                <button id="memory-demo-btn">🧠 演示记忆功能</button>
            </div>
        </div>

        <!-- 记忆演示区域 -->
        <div id="memory-section" style="display:none;">
            <h3>🧠 AI记忆演示</h3>
            <div id="memory-display"></div>
        </div>
    </div>

    <script src="config.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

### Task 0.1.2: 极简CSS样式 (30分钟)
**MVP原则**: 功能优于美观

```css
/* style.css - 极简但实用的样式 */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
}

#app {
    max-width: 800px;
    margin: 0 auto;
}

.roles {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.role-btn {
    padding: 10px 20px;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

.role-btn:hover {
    background: rgba(255,255,255,0.3);
}

#messages {
    height: 400px;
    overflow-y: auto;
    background: rgba(0,0,0,0.2);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
}

.message {
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
}

.user-message {
    background: rgba(255,255,255,0.2);
    text-align: right;
}

.ai-message {
    background: rgba(255,255,255,0.1);
}

#input-area {
    display: flex;
    gap: 10px;
}

#user-input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background: rgba(255,255,255,0.1);
    color: white;
}

#user-input::placeholder {
    color: rgba(255,255,255,0.7);
}

button {
    padding: 10px 20px;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background: rgba(255,255,255,0.3);
}
```

### Task 0.1.3: 极简JavaScript逻辑 (60分钟)
**MVP原则**: 核心功能即可，无复杂架构

```javascript
// app.js - 所有逻辑在一个文件
class AITavernMVP {
    constructor() {
        this.currentRole = null;
        this.messages = [];
        this.init();
    }

    init() {
        // 绑定事件
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.onclick = () => this.selectRole(btn.dataset.role);
        });
        
        document.getElementById('send-btn').onclick = () => this.sendMessage();
        document.getElementById('memory-demo-btn').onclick = () => this.demoMemory();
        
        document.getElementById('user-input').onkeypress = (e) => {
            if (e.key === 'Enter') this.sendMessage();
        };
    }

    selectRole(role) {
        this.currentRole = role;
        document.getElementById('role-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'block';
        
        // 显示角色激活消息
        this.addMessage('system', `已激活${this.getRoleName(role)}，开始对话吧！`);
    }

    getRoleName(role) {
        const names = {
            'aria': 'Aria - 温柔调酒师',
            'morgan': 'Morgan - 资深调酒师', 
            'sean': 'Sean - 创业导师'
        };
        return names[role] || role;
    }

    async sendMessage() {
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        if (!message) return;

        input.value = '';
        this.addMessage('user', message);
        this.addMessage('ai', '思考中...');

        try {
            // 调用后端API
            const response = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    role: this.currentRole
                })
            });

            const data = await response.json();
            this.updateLastMessage(data.message || '抱歉，我现在无法回复');
        } catch (error) {
            this.updateLastMessage('连接失败，请检查后端服务');
        }
    }

    async demoMemory() {
        document.getElementById('memory-section').style.display = 'block';
        const display = document.getElementById('memory-display');
        
        display.innerHTML = '<p>🔄 演示AI记忆功能...</p>';
        
        try {
            // 第一步：保存记忆
            await this.saveMemory('用户询问了关于工作压力的问题');
            display.innerHTML += '<p>✅ 记忆已保存：工作压力话题</p>';
            
            // 第二步：模拟页面刷新
            setTimeout(() => {
                display.innerHTML += '<p>🔄 模拟页面刷新...</p>';
                
                // 第三步：回忆记忆
                setTimeout(() => {
                    this.recallMemory();
                    display.innerHTML += '<p>✅ AI成功回忆起之前的对话！</p>';
                }, 1000);
            }, 1000);
        } catch (error) {
            display.innerHTML += '<p>❌ 记忆演示失败</p>';
        }
    }

    async saveMemory(content) {
        const response = await fetch(`${API_BASE}/api/promptx/remember`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: this.currentRole,
                content: content
            })
        });
        return response.json();
    }

    async recallMemory() {
        const response = await fetch(`${API_BASE}/api/promptx/recall/${this.currentRole}/工作`);
        const data = await response.json();
        
        if (data.success) {
            this.addMessage('ai', '我记得你之前提到过工作压力的问题，现在感觉怎么样？');
        }
    }

    addMessage(sender, content) {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = content;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        this.messages.push({ sender, content, timestamp: Date.now() });
    }

    updateLastMessage(content) {
        const messages = document.querySelectorAll('.ai-message');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            lastMessage.textContent = content;
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    new AITavernMVP();
});
```

### Task 0.1.4: 配置文件 (30分钟)

```javascript
// config.js - API配置
const API_BASE = 'http://localhost:3001';

const ROLES = {
    aria: {
        name: 'Aria',
        description: '温柔体贴的调酒师',
        prompt: '你是Aria，AI酒馆的温柔调酒师...'
    },
    morgan: {
        name: 'Morgan', 
        description: '资深调酒师',
        prompt: '你是Morgan，AI酒馆的资深调酒师...'
    },
    sean: {
        name: 'Sean',
        description: '创业导师',
        prompt: '你是Sean，deepractice.ai创始人...'
    }
};
```

## MVP验收标准

### 功能验收
1. 页面在浏览器中正常显示
2. 可以选择角色并切换到对话界面
3. 可以发送消息（即使后端未连接也不报错）
4. 记忆演示按钮可点击并显示流程

### 时间验收  
- 总开发时间 ≤ 2小时
- 代码文件数量 ≤ 5个
- 总代码行数 ≤ 200行

## 🎯 MVP核心价值

这个极简版本专注验证3个核心假设：
1. **用户喜欢角色化AI对话吗？**
2. **记忆功能是否有吸引力？**
3. **AI酒馆的概念是否有趣？**

所有其他功能都是次要的！