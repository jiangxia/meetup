# Story 2.3: 前端消息状态管理

## O (Objective)
实现前端的消息状态管理，包括对话历史、消息显示、Loading状态等UI逻辑

## E (Environment)
- **技术栈**: Vanilla JavaScript
- **状态管理**: 本地状态 + LocalStorage
- **UI更新**: DOM操作
- **数据流**: 前端状态 ↔ 后端API

## S (Success Criteria)

### 及格标准
- ✅ 消息列表正常显示和滚动
- ✅ Loading状态显示正确
- ✅ 消息历史本地缓存
- ✅ 发送/接收消息UI更新

### 优秀标准
- ✅ 消息状态动画流畅
- ✅ 打字机效果实现
- ✅ 消息时间戳显示
- ✅ 错误状态处理完善

## 具体任务分解

### Task 2.3.1: 消息状态管理器实现
**预估时间**: 2小时
**具体内容**:
- 创建MessageManager类
- 实现消息队列管理
- 处理消息状态转换

**MessageManager实现**:
```javascript
// js/services/MessageManager.js
class MessageManager {
  constructor() {
    this.messages = [];
    this.currentConversationId = null;
    this.listeners = [];
  }

  // 添加消息
  addMessage(content, sender = 'user', status = 'sent') {
    const message = {
      id: Date.now() + Math.random(),
      content,
      sender, // 'user' | 'ai' | 'system'
      status, // 'sending' | 'sent' | 'delivered' | 'error'
      timestamp: new Date(),
      roleId: sender === 'ai' ? this.currentRoleId : null
    };

    this.messages.push(message);
    this.saveToStorage();
    this.notifyListeners('messageAdded', message);
    
    return message;
  }

  // 更新消息状态
  updateMessageStatus(messageId, status, content = null) {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.status = status;
      if (content) message.content = content;
      this.saveToStorage();
      this.notifyListeners('messageUpdated', message);
    }
  }

  // 获取对话历史
  getMessages() {
    return [...this.messages];
  }

  // 清空消息
  clearMessages() {
    this.messages = [];
    this.saveToStorage();
    this.notifyListeners('messagesCleared');
  }

  // 添加监听器
  addListener(callback) {
    this.listeners.push(callback);
  }

  // 通知监听器
  notifyListeners(event, data) {
    this.listeners.forEach(callback => callback(event, data));
  }

  // 本地存储
  saveToStorage() {
    localStorage.setItem('ai-tavern-messages', JSON.stringify({
      messages: this.messages,
      conversationId: this.currentConversationId
    }));
  }

  // 从本地存储加载
  loadFromStorage() {
    const stored = localStorage.getItem('ai-tavern-messages');
    if (stored) {
      const data = JSON.parse(stored);
      this.messages = data.messages || [];
      this.currentConversationId = data.conversationId;
    }
  }
}
```

### Task 2.3.2: 消息UI组件实现
**预估时间**: 2.5小时
**具体内容**:
- 创建消息显示组件
- 实现消息列表渲染
- 添加Loading和错误状态显示

**ChatMessageComponent实现**:
```javascript
// js/components/ChatMessage.js
class ChatMessage {
  constructor(container, messageManager) {
    this.container = container;
    this.messageManager = messageManager;
    this.init();
  }

  init() {
    this.messageManager.addListener((event, data) => {
      switch(event) {
        case 'messageAdded':
          this.renderMessage(data);
          break;
        case 'messageUpdated':
          this.updateMessage(data);
          break;
        case 'messagesCleared':
          this.clearMessages();
          break;
      }
    });
  }

  // 渲染单条消息
  renderMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = `message message--${message.sender}`;
    messageEl.dataset.messageId = message.id;

    const avatar = this.createAvatar(message);
    const content = this.createContent(message);
    const timestamp = this.createTimestamp(message);

    messageEl.appendChild(avatar);
    messageEl.appendChild(content);
    messageEl.appendChild(timestamp);

    this.container.appendChild(messageEl);
    this.scrollToBottom();

    // 添加动画
    requestAnimationFrame(() => {
      messageEl.classList.add('message--visible');
    });
  }

  // 创建消息内容
  createContent(message) {
    const contentEl = document.createElement('div');
    contentEl.className = 'message__content';

    if (message.status === 'sending' || message.status === 'thinking') {
      contentEl.innerHTML = this.createLoadingIndicator();
    } else if (message.status === 'error') {
      contentEl.innerHTML = this.createErrorMessage(message);
    } else {
      contentEl.textContent = message.content;
    }

    return contentEl;
  }

  // Loading指示器
  createLoadingIndicator() {
    return `
      <div class="message__loading">
        <div class="dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <span>思考中...</span>
      </div>
    `;
  }

  // 错误消息
  createErrorMessage(message) {
    return `
      <div class="message__error">
        <span class="error-icon">⚠️</span>
        <span class="error-text">消息发送失败</span>
        <button class="retry-btn" onclick="retryMessage('${message.id}')">重试</button>
      </div>
    `;
  }

  // 打字机效果
  async typewriterEffect(element, text, speed = 30) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
      element.textContent += text.charAt(i);
      await new Promise(resolve => setTimeout(resolve, speed));
      this.scrollToBottom();
    }
  }

  // 更新消息
  updateMessage(message) {
    const messageEl = this.container.querySelector(`[data-message-id="${message.id}"]`);
    if (messageEl) {
      const contentEl = messageEl.querySelector('.message__content');
      
      if (message.status === 'delivered' && message.sender === 'ai') {
        // AI消息使用打字机效果
        this.typewriterEffect(contentEl, message.content);
      } else {
        contentEl.textContent = message.content;
      }

      // 更新状态样式
      messageEl.className = `message message--${message.sender} message--${message.status}`;
    }
  }

  // 滚动到底部
  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  // 清空消息
  clearMessages() {
    this.container.innerHTML = '';
  }
}
```

### Task 2.3.3: 消息发送处理逻辑
**预估时间**: 1.5小时
**具体内容**:
- 实现消息发送流程
- 处理API调用状态
- 实现重试机制

**消息发送逻辑**:
```javascript
// js/services/ChatService.js
class ChatService {
  constructor(messageManager, apiService) {
    this.messageManager = messageManager;
    this.apiService = apiService;
    this.currentRoleId = 'aria';
  }

  async sendMessage(content) {
    try {
      // 1. 添加用户消息
      const userMessage = this.messageManager.addMessage(content, 'user', 'sent');

      // 2. 添加AI thinking消息
      const aiMessage = this.messageManager.addMessage('', 'ai', 'thinking');

      // 3. 调用API
      const response = await this.apiService.post('/api/chat', {
        message: content,
        roleId: this.currentRoleId
      });

      // 4. 更新AI消息
      if (response.success) {
        this.messageManager.updateMessageStatus(
          aiMessage.id,
          'delivered',
          response.data.message
        );
      } else {
        throw new Error(response.error || '发送失败');
      }

    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 更新为错误状态
      this.messageManager.updateMessageStatus(
        aiMessage.id,
        'error',
        '抱歉，我现在无法回复，请稍后重试'
      );
    }
  }

  // 重试消息
  async retryMessage(messageId) {
    const message = this.messageManager.messages.find(m => m.id === messageId);
    if (message && message.status === 'error') {
      // 重置状态为thinking
      this.messageManager.updateMessageStatus(messageId, 'thinking', '');
      
      // 重新发送
      try {
        const response = await this.apiService.post('/api/chat', {
          message: '请重新回复上一个问题',
          roleId: this.currentRoleId
        });

        if (response.success) {
          this.messageManager.updateMessageStatus(
            messageId,
            'delivered',
            response.data.message
          );
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        this.messageManager.updateMessageStatus(
          messageId,
          'error',
          '重试失败，请检查网络连接'
        );
      }
    }
  }
}
```

## CSS样式设计

### 消息样式
```css
/* css/components.css - 消息相关样式 */
.message {
  display: flex;
  margin: 1rem 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.message--visible {
  opacity: 1;
  transform: translateY(0);
}

.message--user {
  justify-content: flex-end;
}

.message--ai {
  justify-content: flex-start;
}

.message__content {
  max-width: 70%;
  padding: 1rem;
  border-radius: 1rem;
  position: relative;
}

.message--user .message__content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message--ai .message__content {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.message__loading .dots {
  display: inline-flex;
  gap: 4px;
  margin-right: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: dotPulse 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
```

## 验收标准
1. 消息发送和接收流程完整
2. Loading状态显示正确
3. 错误处理和重试机制正常
4. 消息历史本地缓存有效
5. UI动画流畅自然

## 后续衔接
与Backend Epic2.3配合完成完整的消息处理流程。