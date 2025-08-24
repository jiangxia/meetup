# Story 2.1: 对话界面UI实现

## O (Objective)
创建类似聊天应用的对话界面，支持消息输入、发送、显示

## E (Environment)
- **对话框设计**：用户消息右对齐，AI消息左对齐
- **输入框**：底部固定，支持多行文本，自动调整高度
- **消息样式**：气泡式设计，符合酒馆氛围
- **滚动逻辑**：新消息自动滚动到底部
- **响应式设计**：适配不同屏幕尺寸

## S (Success Criteria)

### 及格标准
- ✅ 基础聊天界面布局正确
- ✅ 消息输入和显示功能正常
- ✅ 滚动逻辑工作正常

### 优秀标准
- ✅ 界面美观，符合酒馆风格
- ✅ 交互体验流畅自然
- ✅ 支持键盘快捷键（Enter发送）
- ✅ 移动端适配完美

## 具体任务分解

### Task 2.1.1: 创建对话容器和消息列表组件
**预估时间**: 4小时
**具体内容**:
- 设计对话主容器布局
- 创建消息列表滚动区域
- 实现消息项组件结构
- 添加消息对齐逻辑（用户右，AI左）

**技术要点**:
```html
<div class="chat-container">
  <div class="message-list" id="messageList">
    <div class="message user-message">
      <div class="message-content">用户消息内容</div>
      <div class="message-time">14:30</div>
    </div>
    <div class="message ai-message">
      <div class="ai-avatar">A</div>
      <div class="message-content">AI回复内容</div>
      <div class="message-time">14:31</div>
    </div>
  </div>
</div>
```

### Task 2.1.2: 实现消息输入框和发送按钮
**预估时间**: 3小时
**具体内容**:
- 创建底部固定的输入区域
- 实现多行文本输入框（textarea）
- 添加发送按钮和样式
- 实现输入框自动调整高度

**技术要点**:
```html
<div class="input-container">
  <div class="input-wrapper">
    <textarea 
      id="messageInput" 
      placeholder="输入您想说的话..."
      rows="1"
      maxlength="500">
    </textarea>
    <button id="sendButton" class="send-btn">
      <span>发送</span>
    </button>
  </div>
</div>
```

### Task 2.1.3: 设计消息气泡样式和布局
**预估时间**: 5小时
**具体内容**:
- 设计用户消息气泡样式（酒馆主题色）
- 设计AI消息气泡样式（与角色匹配）
- 添加消息状态图标（发送中、已发送、失败）
- 实现长消息的换行和显示优化

**样式规范**:
```css
/* 用户消息样式 */
.user-message .message-content {
  background: linear-gradient(135deg, #d4a574, #c19653);
  color: white;
  border-radius: 18px 18px 4px 18px;
  max-width: 70%;
}

/* AI消息样式 */
.ai-message .message-content {
  background: #f0f0f0;
  color: #333;
  border-radius: 18px 18px 18px 4px;
  max-width: 70%;
}
```

### Task 2.1.4: 实现消息滚动和自动聚焦逻辑
**预估时间**: 2小时
**具体内容**:
- 实现新消息自动滚动到底部
- 添加平滑滚动动画效果
- 实现输入框自动聚焦
- 处理键盘弹出时的界面适配（移动端）

**技术实现**:
```javascript
function scrollToBottom() {
  const messageList = document.getElementById('messageList');
  messageList.scrollTop = messageList.scrollHeight;
}

function addMessage(content, sender) {
  // 添加消息到列表
  // 自动滚动到底部
  setTimeout(scrollToBottom, 100);
}
```

## 界面设计规范

### 布局结构
```
┌─────────────────────────────┐
│     顶部状态栏              │ <- 显示当前角色
├─────────────────────────────┤
│                             │
│     消息列表区域            │ <- 可滚动区域
│     (用户消息右对齐)        │
│     (AI消息左对齐)          │
│                             │
├─────────────────────────────┤
│  [输入框]        [发送]     │ <- 底部固定
└─────────────────────────────┘
```

### 色彩方案
- **主色调**: 温暖的棕色系（#8B4513, #D2B48C）
- **用户消息**: 金色渐变（#D4A574 -> #C19653）
- **AI消息**: 浅灰色背景（#F5F5F5）
- **输入框**: 白色背景，棕色边框

## 依赖关系
- 无前置依赖，可独立开发
- 为Story 2.2和2.3提供UI基础

## 验收标准
1. 界面在不同设备上显示正常
2. 消息对齐和样式符合设计要求
3. 输入交互响应及时准确
4. 滚动和聚焦逻辑工作正常
5. 整体视觉效果符合酒馆氛围