# Story 0.3: 基础组件开发

## O (Objective)
开发AI酒馆项目的通用UI组件和工具函数，为业务功能提供可复用的技术基础

## E (Environment)
- **技术栈**: HTML5 + CSS3 + Vanilla JavaScript (前端) + Node.js/Express (后端)
- **组件类型**: 原生JavaScript组件，无框架依赖，快速开发
- **AI集成**: OpenAI API + PromptX MCP工具集成
- **设计风格**: 酒馆主题，温暖色调，简洁实用
- **组件规范**: 统一的API设计，易于使用
- **工具函数**: DOM操作、API调用、PromptX工具封装
- **兼容性**: 现代浏览器，ES6+语法

## S (Success Criteria)

### 及格标准
- ✅ 基础UI组件可正常使用
- ✅ 工具函数封装完整
- ✅ 组件API设计一致
- ✅ 代码质量良好

### 优秀标准
- ✅ 组件设计优雅易用
- ✅ 视觉效果符合酒馆主题
- ✅ 性能优化到位
- ✅ 代码可维护性强

## 具体任务分解

### Task 0.3.1: 通用UI组件开发
**预估时间**: 90分钟
**具体内容**:
- 开发Button、Card、Modal等基础组件
- 统一组件API设计规范
- 实现酒馆主题样式
- 添加基础交互效果

**核心组件列表**:

#### 1. Button组件
```javascript
// js/components/Button.js
class TavernButton {
    constructor(options) {
        this.text = options.text;
        this.type = options.type || 'primary'; // primary, secondary, ghost
        this.size = options.size || 'medium'; // small, medium, large
        this.onClick = options.onClick;
        this.disabled = options.disabled || false;
        
        this.element = this.render();
        this.bindEvents();
    }
    
    render() {
        const button = document.createElement('button');
        button.className = `tavern-btn tavern-btn--${this.type} tavern-btn--${this.size}`;
        button.textContent = this.text;
        button.disabled = this.disabled;
        return button;
    }
    
    bindEvents() {
        this.element.addEventListener('click', (e) => {
            if (!this.disabled && this.onClick) {
                this.onClick(e);
            }
        });
    }
    
    setDisabled(disabled) {
        this.disabled = disabled;
        this.element.disabled = disabled;
    }
    
    setText(text) {
        this.text = text;
        this.element.textContent = text;
    }
}
```

#### 2. Card组件
```javascript
// js/components/Card.js
class TavernCard {
    constructor(options) {
        this.title = options.title;
        this.content = options.content;
        this.image = options.image;
        this.actions = options.actions || [];
        this.className = options.className || '';
        
        this.element = this.render();
    }
    
    render() {
        const card = document.createElement('div');
        card.className = `tavern-card ${this.className}`;
        
        const cardHTML = `
            ${this.image ? `<div class="tavern-card__image">
                <img src="${this.image}" alt="${this.title}">
            </div>` : ''}
            <div class="tavern-card__body">
                ${this.title ? `<h3 class="tavern-card__title">${this.title}</h3>` : ''}
                ${this.content ? `<div class="tavern-card__content">${this.content}</div>` : ''}
                ${this.actions.length ? `<div class="tavern-card__actions">
                    ${this.actions.map(action => 
                        `<button class="tavern-btn tavern-btn--${action.type || 'secondary'}" 
                                data-action="${action.id}">${action.text}</button>`
                    ).join('')}
                </div>` : ''}
            </div>
        `;
        
        card.innerHTML = cardHTML;
        this.bindActions(card);
        return card;
    }
    
    bindActions(card) {
        this.actions.forEach(action => {
            const button = card.querySelector(`[data-action="${action.id}"]`);
            if (button && action.onClick) {
                button.addEventListener('click', action.onClick);
            }
        });
    }
}
```

#### 3. Modal组件
```javascript
// js/components/Modal.js
class TavernModal {
    constructor(options) {
        this.title = options.title;
        this.content = options.content;
        this.size = options.size || 'medium'; // small, medium, large
        this.onClose = options.onClose;
        this.closeOnOverlay = options.closeOnOverlay !== false;
        
        this.element = this.render();
        this.bindEvents();
    }
    
    render() {
        const modal = document.createElement('div');
        modal.className = 'tavern-modal-overlay';
        
        modal.innerHTML = `
            <div class="tavern-modal tavern-modal--${this.size}">
                <div class="tavern-modal__header">
                    <h2 class="tavern-modal__title">${this.title}</h2>
                    <button class="tavern-modal__close" aria-label="关闭">×</button>
                </div>
                <div class="tavern-modal__body">
                    ${this.content}
                </div>
            </div>
        `;
        
        return modal;
    }
    
    bindEvents() {
        // 关闭按钮
        const closeBtn = this.element.querySelector('.tavern-modal__close');
        closeBtn.addEventListener('click', () => this.close());
        
        // 点击遮罩关闭
        if (this.closeOnOverlay) {
            this.element.addEventListener('click', (e) => {
                if (e.target === this.element) {
                    this.close();
                }
            });
        }
        
        // ESC键关闭
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };
    }
    
    show() {
        document.body.appendChild(this.element);
        document.addEventListener('keydown', this.escapeHandler);
        // 触发显示动画
        requestAnimationFrame(() => {
            this.element.classList.add('tavern-modal-overlay--show');
        });
    }
    
    close() {
        this.element.classList.remove('tavern-modal-overlay--show');
        document.removeEventListener('keydown', this.escapeHandler);
        
        setTimeout(() => {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 300); // 等待动画完成
        
        if (this.onClose) {
            this.onClose();
        }
    }
}
```

### Task 0.3.2: 工具函数开发
**预估时间**: 30分钟
**具体内容**:
- DOM操作工具函数
- API调用封装
- 数据格式化工具
- 本地存储工具

**工具函数实现**:

#### 1. DOM操作工具
```javascript
// js/utils/dom.js
const DOM = {
    // 元素选择
    $(selector, context = document) {
        return context.querySelector(selector);
    },
    
    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },
    
    // 元素创建
    create(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    },
    
    // 样式操作
    show(element) {
        element.style.display = '';
    },
    
    hide(element) {
        element.style.display = 'none';
    },
    
    toggle(element) {
        element.style.display = element.style.display === 'none' ? '' : 'none';
    },
    
    // 类名操作
    addClass(element, className) {
        element.classList.add(className);
    },
    
    removeClass(element, className) {
        element.classList.remove(className);
    },
    
    toggleClass(element, className) {
        element.classList.toggle(className);
    },
    
    // 事件处理
    on(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
    },
    
    off(element, event, handler) {
        element.removeEventListener(event, handler);
    },
    
    // 动画
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = '';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
};
```

#### 2. API调用工具 (含AI集成)
```javascript
// js/utils/api.js
const API = {
    // 基础请求方法
    async request(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10秒超时
        };
        
        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('API请求失败:', error);
            throw error;
        }
    },
    
    // AI对话调用 (通过本地Node.js服务器)
    async chatWithAI(messages, roleId = 'aria') {
        return this.request('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages,
                role: roleId
            })
        });
    },
    
    // PromptX工具调用
    async promptxAction(action, params = {}) {
        return this.request('/api/promptx/action', {
            method: 'POST',
            body: JSON.stringify({
                action,
                params
            })
        });
    },
    
    // PromptX记忆保存
    async promptxRemember(key, value, metadata = {}) {
        return this.promptxAction('remember', { key, value, metadata });
    },
    
    // PromptX记忆回调
    async promptxRecall(query, options = {}) {
        return this.promptxAction('recall', { query, ...options });
    },
    
    // GET请求
    async get(url, params = {}) {
        const urlObj = new URL(url);
        Object.entries(params).forEach(([key, value]) => {
            urlObj.searchParams.append(key, value);
        });
        
        return this.request(urlObj.toString());
    },
    
    // POST请求
    async post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};
```

#### 3. 格式化工具
```javascript
// js/utils/format.js
const Format = {
    // 时间格式化
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        
        if (diff < minute) {
            return '刚刚';
        } else if (diff < hour) {
            return `${Math.floor(diff / minute)}分钟前`;
        } else if (diff < day) {
            return `${Math.floor(diff / hour)}小时前`;
        } else {
            return date.toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    
    // 文本截断
    truncate(text, maxLength = 100, suffix = '...') {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - suffix.length) + suffix;
    },
    
    // 转义HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // 格式化JSON
    formatJSON(obj, indent = 2) {
        try {
            return JSON.stringify(obj, null, indent);
        } catch (error) {
            return '无效的JSON数据';
        }
    }
};
```

### Task 0.3.3: 酒馆主题CSS开发
**预估时间**: 待Epic 1-4的具体UI需求确定后补充

## 组件使用示例

### 使用Button组件
```javascript
const submitBtn = new TavernButton({
    text: '发送消息',
    type: 'primary',
    size: 'medium',
    onClick: (e) => {
        console.log('发送消息被点击');
    }
});

// 添加到页面
document.getElementById('button-container').appendChild(submitBtn.element);
```

### 使用Card组件
```javascript
const roleCard = new TavernCard({
    title: 'Aria - 温柔调酒师',
    content: '善于倾听，温暖贴心的对话伙伴',
    image: 'assets/images/aria-avatar.png',
    actions: [
        {
            id: 'select',
            text: '选择她',
            type: 'primary',
            onClick: () => selectRole('aria')
        }
    ]
});
```

## 依赖关系
- 为Epic 1-4的所有业务组件提供基础
- 可与业务Epic并行开发
- 完成后提升整体开发效率

## 验收标准
1. 所有组件API设计一致，易于使用
2. 工具函数覆盖常用场景，功能完整
3. 组件样式符合酒馆主题设计
4. 代码质量高，性能良好
5. 为后续业务开发提供有力支持