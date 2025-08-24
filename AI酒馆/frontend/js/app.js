// AI酒馆 - 主应用逻辑

// 全局状态管理
const AppState = {
    currentScreen: 'role-selection',
    currentRole: null,
    isLoading: false,
    messages: [],
    memories: []
};

// DOM元素引用
const elements = {
    screens: {
        roleSelection: document.getElementById('roleSelectionPage'),
        chatInterface: document.getElementById('chatPage')
    },
    messageInput: document.getElementById('messageInput'),
    sendButton: document.getElementById('sendButton'),
    messagesArea: document.getElementById('messagesArea'),
    backButton: document.getElementById('backButton'),
    memoryButton: document.getElementById('memoryButton'),
    currentRoleAvatar: document.getElementById('currentRoleAvatar'),
    currentRoleName: document.getElementById('currentRoleName'),
    currentRoleBadge: document.getElementById('currentRoleBadge'),
    inputHint: document.getElementById('inputHint')
};

// 初始化应用
function initApp() {
    console.log('🍺 AI酒馆启动中...');
    
    // 初始化角色数据
    initRoles();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 显示欢迎界面
    showScreen('role-selection');
    
    console.log('✅ AI酒馆启动完成');
}

// 绑定事件监听器
function bindEventListeners() {
    // 消息输入框回车发送
    if (elements.messageInput) {
        elements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (window.sendMessage) {
                    window.sendMessage();
                }
            }
        });
    }
    
    // 发送按钮点击
    if (elements.sendButton) {
        elements.sendButton.addEventListener('click', () => {
            if (window.sendMessage) {
                window.sendMessage();
            }
        });
    }
    
    // 返回按钮点击
    if (elements.backButton) {
        elements.backButton.addEventListener('click', () => {
            if (window.backToRoleSelection) {
                window.backToRoleSelection();
            }
        });
    }
    
    // 记忆按钮点击
    if (elements.memoryButton) {
        elements.memoryButton.addEventListener('click', () => {
            if (window.toggleMemoryDemo) {
                window.toggleMemoryDemo();
            }
        });
    }
    
    // 防止表单默认提交
    document.addEventListener('submit', (e) => {
        e.preventDefault();
    });
    
    // 全局错误处理
    window.addEventListener('error', (e) => {
        console.error('应用错误:', e.error);
        showError('系统出现错误，请刷新页面重试');
    });
}

// 显示指定屏幕
function showScreen(screenName) {
    // 隐藏所有页面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    // 显示指定页面
    let targetPage;
    if (screenName === 'role-selection') {
        targetPage = elements.screens.roleSelection;
    } else if (screenName === 'chat') {
        targetPage = elements.screens.chatInterface;
    }
    
    if (targetPage) {
        targetPage.style.display = 'block';
        AppState.currentScreen = screenName;
    }
    
    console.log(`📱 切换到屏幕: ${screenName}`);
}

// 显示角色选择界面
function showRoleSelection() {
    showScreen('role-selection');
    AppState.currentRole = null;
}

// 显示对话界面
function showChatInterface() {
    if (!AppState.currentRole) {
        showError('请先选择一个角色');
        return;
    }
    showScreen('chat-interface');
    updateChatHeader();
}

// 显示记忆演示界面
function showMemoryDemo() {
    showScreen('memory-demo');
    loadMemories();
}

// 更新对话界面头部信息
function updateChatHeader() {
    if (!AppState.currentRole) return;
    
    const roleAvatar = document.querySelector('.current-role .role-avatar');
    const roleName = document.querySelector('.current-role .role-name');
    
    if (roleAvatar) roleAvatar.textContent = AppState.currentRole.avatar;
    if (roleName) roleName.textContent = AppState.currentRole.name;
}

// 加载状态管理
function setLoading(isLoading, message = 'AI思考中...') {
    AppState.isLoading = isLoading;
    
    if (elements.loadingIndicator) {
        if (isLoading) {
            elements.loadingIndicator.classList.add('active');
            elements.loadingIndicator.querySelector('span').textContent = message;
        } else {
            elements.loadingIndicator.classList.remove('active');
        }
    }
    
    // 禁用/启用发送按钮
    if (elements.sendButton) {
        elements.sendButton.disabled = isLoading;
    }
}

// 错误提示
function showError(message) {
    console.error('错误:', message);
    
    // 创建错误提示元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-message">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // 添加错误样式
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 3000);
}

// 成功提示
function showSuccess(message) {
    console.log('成功:', message);
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-toast';
    successDiv.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✅</span>
            <span class="success-message">${message}</span>
        </div>
    `;
    
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 2000);
}

// 工具函数：格式化时间
function formatTime(date = new Date()) {
    return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 工具函数：生成唯一ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 本地存储管理
const Storage = {
    // 保存数据
    save(key, data) {
        try {
            localStorage.setItem(`ai-tavern-${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    },
    
    // 读取数据
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(`ai-tavern-${key}`);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('读取数据失败:', error);
            return defaultValue;
        }
    },
    
    // 删除数据
    remove(key) {
        try {
            localStorage.removeItem(`ai-tavern-${key}`);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    },
    
    // 清空所有数据
    clear() {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith('ai-tavern-'))
                .forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('清空数据失败:', error);
            return false;
        }
    }
};

// API请求封装
const API = {
    baseURL: 'http://localhost:3000/api',
    
    // 通用请求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        try {
            console.log(`API请求: ${config.method || 'GET'} ${url}`);
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API响应:', data);
            return data;
        } catch (error) {
            console.error('API请求失败:', error);
            
            // 如果是网络错误，返回模拟数据
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.warn('检测到网络错误，使用模拟数据');
                return this.getMockResponse(endpoint, options);
            }
            
            throw error;
        }
    },
    
    // 模拟响应（用于开发和演示）
    getMockResponse(endpoint, options) {
        console.log('返回模拟数据:', endpoint);
        
        if (endpoint === '/chat') {
            return {
                success: true,
                message: '这是一个模拟回复。在实际部署中，这里会是AI的真实回复。',
                timestamp: new Date().toISOString()
            };
        }
        
        if (endpoint === '/memory') {
            return {
                success: true,
                memories: [
                    { id: 1, content: '用户喜欢讨论技术话题', timestamp: '2024-01-20 10:30' },
                    { id: 2, content: '用户对AI很感兴趣', timestamp: '2024-01-20 10:35' }
                ]
            };
        }
        
        return { success: true, data: null };
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 导出全局对象供其他脚本使用
window.AppState = AppState;
window.API = API;
window.Storage = Storage;
window.showScreen = showScreen;
window.showRoleSelection = showRoleSelection;
window.showChatInterface = showChatInterface;
window.showMemoryDemo = showMemoryDemo;
window.setLoading = setLoading;
window.showError = showError;
window.showSuccess = showSuccess;

console.log('🍺 AI酒馆应用脚本加载完成');