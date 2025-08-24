// AI酒馆 - 主要交互逻辑

// 全局状态
let currentRole = null;
let currentPage = 'role-selection';
let messageHistory = [];
let isTyping = false;

// DOM 元素
const pages = {
    roleSelection: document.getElementById('roleSelectionPage'),
    chat: document.getElementById('chatPage')
};

const chatElements = {
    messagesArea: document.getElementById('messagesArea'),
    messageInput: document.getElementById('messageInput'),
    sendButton: document.getElementById('sendButton'),
    currentRoleInfo: document.querySelector('.current-role-info'),
    backButton: document.getElementById('backButton'),
    roleCards: document.querySelectorAll('.role-card'),
    currentRoleAvatar: document.getElementById('currentRoleAvatar'),
    currentRoleName: document.getElementById('currentRoleName'),
    currentRoleBadge: document.getElementById('currentRoleBadge'),
    inputHint: document.getElementById('inputHint')
};

// 角色数据
const roles = {
    xiaoyu: {
        name: "小雨",
        avatar: "💗",
        description: "温暖如春雨，善于倾听和共情，会用温暖的话语抚慰您的心灵",
        personality: "温和、善解人意、温暖",
        badge: "warm",
        tags: ["善解人意", "温暖陪伴", "情感支持"],
        greeting: "你好，我是小雨。今天心情怎么样？有什么想和我分享的吗？"
    },
    mingxuan: {
        name: "明轩",
        avatar: "☮️",
        description: "冷静理性，擅长分析问题，会用逻辑思维帮您梳理思路和您理解",
        personality: "理性、冷静、逻辑清晰",
        badge: "rational",
        tags: ["逻辑分析", "问题解决", "理性思考"],
        greeting: "您好，我是明轩。有什么问题需要分析和讨论的吗？"
    }
};

// 页面切换功能
function switchPage(pageName) {
    // 隐藏所有页面
    Object.values(pages).forEach(page => {
        if (page) {
            page.style.display = 'none';
        }
    });
    
    // 显示目标页面
    if (pages[pageName]) {
        pages[pageName].style.display = 'flex';
        currentPage = pageName;
    }
}

// 角色选择功能
function selectRole(roleId) {
    const role = roles[roleId];
    if (!role) {
        console.error('角色不存在:', roleId);
        return;
    }
    
    currentRole = role;
    
    // 更新当前角色显示
    updateCurrentRoleDisplay();
    
    // 清空消息历史
    messageHistory = [];
    if (chatElements.messagesArea) {
        chatElements.messagesArea.innerHTML = '';
    }
    
    // 添加欢迎消息
    addMessage({
        type: 'ai',
        content: role.greeting,
        role: role
    });
    
    // 切换到聊天界面
    switchPage('chat');
}

// 更新当前角色显示
function updateCurrentRoleDisplay() {
    if (!currentRole) return;
    
    if (chatElements.currentRoleAvatar) {
        chatElements.currentRoleAvatar.textContent = currentRole.avatar;
    }
    
    if (chatElements.currentRoleName) {
        chatElements.currentRoleName.textContent = currentRole.name;
    }
    
    if (chatElements.currentRoleBadge) {
        chatElements.currentRoleBadge.textContent = currentRole.badge === 'warm' ? '温柔型' : '理性型';
        chatElements.currentRoleBadge.className = `role-badge ${currentRole.badge}`;
    }
    
    if (chatElements.inputHint) {
        chatElements.inputHint.textContent = `${currentRole.name} 会记住您的情绪和偏好，为您提供个性化的回应`;
    }
}

// 返回角色选择
function backToRoleSelection() {
    switchPage('roleSelection');
    currentRole = null;
}

// 添加消息
function addMessage(messageData) {
    if (!chatElements.messagesArea) return;
    
    const messageElement = createMessageElement(messageData);
    chatElements.messagesArea.appendChild(messageElement);
    
    // 添加到历史记录
    messageHistory.push(messageData);
    
    // 滚动到底部
    scrollToBottom();
    
    // 触发动画
    requestAnimationFrame(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    });
}

// 创建消息元素
function createMessageElement(messageData) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${messageData.type}`;
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    
    let avatarContent = '';
    let nameContent = '';
    
    if (messageData.type === 'user') {
        avatarContent = '👤';
        nameContent = '你';
    } else if (messageData.type === 'ai' && currentRole) {
        avatarContent = currentRole.avatar;
        nameContent = currentRole.name;
    } else if (messageData.type === 'system') {
        avatarContent = '⚙️';
        nameContent = '系统';
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatarContent}</div>
        <div class="message-content">
            <div class="message-text">${messageData.content}</div>
            <div class="message-time">${formatTime(new Date())}</div>
        </div>
    `;
    
    return messageDiv;
}

// 发送消息
function sendMessage() {
    const input = chatElements.messageInput;
    if (!input || !input.value.trim() || isTyping) return;
    
    const userMessage = input.value.trim();
    input.value = '';
    
    // 添加用户消息
    addMessage({
        type: 'user',
        content: userMessage
    });
    
    // 显示打字指示器
    showTypingIndicator();
    
    // 模拟AI回复
    setTimeout(() => {
        hideTypingIndicator();
        
        const aiResponse = generateAIResponse(userMessage);
        addMessage({
            type: 'ai',
            content: aiResponse,
            role: currentRole
        });
        
        // 可能显示角色推荐
        if (Math.random() < 0.3) {
            setTimeout(() => {
                showRoleRecommendations();
            }, 1000);
        }
        
        // 可能触发记忆演示
        if (Math.random() < 0.2) {
            setTimeout(() => {
                showMemoryTrigger();
            }, 2000);
        }
    }, 1500 + Math.random() * 1000);
}

// 生成AI回复
function generateAIResponse(userMessage) {
    if (!currentRole) {
        return "抱歉，我需要先选择一个角色才能与您对话。";
    }
    
    const responses = getRoleBasedResponse(currentRole, userMessage);
    return responses[Math.floor(Math.random() * responses.length)];
}

// 获取基于角色的回复
function getRoleBasedResponse(role, message) {
    const commonResponses = [
        `作为${role.name}，我觉得这个问题很有趣...`,
        `从我的经验来看，${message.toLowerCase()}确实值得深思。`,
        `这让我想起了一个故事...`
    ];
    
    if (role.name === "小雨") {
        return [
            "我能感受到你的情绪，让我用温暖的话语陪伴你...",
            "每个人都有自己的故事，你的感受我都能理解...",
            "就像春雨滋润大地一样，我希望能给你带来温暖...",
            "在这个温馨的空间里，你可以放心地分享你的想法..."
        ];
    } else if (role.name === "明轩") {
        return [
            "让我们理性地分析一下这个问题的各个方面...",
            "从逻辑的角度来看，我们可以这样思考...",
            "基于你提供的信息，我建议我们按以下步骤来解决...",
            "冷静分析是解决问题的关键，让我帮你梳理思路..."
        ];
    }
    
    return commonResponses;
}

// 显示打字指示器
function showTypingIndicator() {
    if (!chatElements.messagesArea || isTyping) return;
    
    isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const avatarContent = currentRole ? currentRole.avatar : '🤖';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">${avatarContent}</div>
        <div class="typing-content">
            <span>${currentRole ? currentRole.name : 'AI'}正在输入</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    chatElements.messagesArea.appendChild(typingDiv);
    scrollToBottom();
}

// 隐藏打字指示器
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

// 显示角色推荐
function showRoleRecommendations() {
    const recommendations = generateRoleRecommendations();
    if (recommendations.length === 0) return;
    
    const recommendDiv = document.createElement('div');
    recommendDiv.className = 'message system';
    recommendDiv.innerHTML = `
        <div class="message-avatar">💡</div>
        <div class="message-content">
            <div class="message-text">
                <strong>PromptX 角色推荐</strong><br>
                基于对话内容，推荐以下角色：
                <div class="role-recommendations">
                    ${recommendations.map(rec => `
                        <span class="recommendation-item" onclick="switchToRole('${rec.id}')">
                            ${rec.avatar} ${rec.name}
                        </span>
                    `).join('')}
                </div>
            </div>
            <div class="message-time">${formatTime(new Date())}</div>
        </div>
    `;
    
    chatElements.messagesArea.appendChild(recommendDiv);
    scrollToBottom();
}

// 生成角色推荐
function generateRoleRecommendations() {
    const allRoles = Object.entries(roles).map(([id, role]) => ({...role, id}));
    const otherRoles = allRoles.filter(role => !currentRole || role.id !== currentRole.id);
    
    // 随机选择1-2个角色推荐
    const count = Math.min(otherRoles.length, Math.floor(Math.random() * 2) + 1);
    const shuffled = otherRoles.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 切换到推荐角色
function switchToRole(roleId) {
    addMessage({
        type: 'system',
        content: `正在切换到 ${roles[roleId].name}...`
    });
    
    setTimeout(() => {
        selectRole(roleId);
    }, 1000);
}

// 显示记忆触发
function showMemoryTrigger() {
    const memoryData = generateMemoryData();
    
    const memoryDiv = document.createElement('div');
    memoryDiv.className = 'message memory';
    memoryDiv.innerHTML = `
        <div class="message-avatar">🧠</div>
        <div class="message-content">
            <div class="message-text">
                <strong>记忆触发</strong><br>
                检测到相关记忆片段：
                <div class="memory-items">
                    ${memoryData.map(memory => `
                        <div class="memory-item">
                            <div class="memory-content">${memory.content}</div>
                            <div class="memory-meta">
                                强度: ${(memory.strength * 100).toFixed(0)}% | 
                                ${formatRelativeTime(memory.timestamp)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="message-time">${formatTime(new Date())}</div>
        </div>
    `;
    
    chatElements.messagesArea.appendChild(memoryDiv);
    scrollToBottom();
}

// 生成记忆数据
function generateMemoryData() {
    const sampleMemories = [
        {
            content: "用户喜欢讨论人生哲学问题",
            strength: 0.85,
            timestamp: new Date(Date.now() - 86400000) // 1天前
        },
        {
            content: "对创意写作表现出浓厚兴趣",
            strength: 0.72,
            timestamp: new Date(Date.now() - 172800000) // 2天前
        },
        {
            content: "经常询问关于商业决策的建议",
            strength: 0.68,
            timestamp: new Date(Date.now() - 259200000) // 3天前
        }
    ];
    
    // 随机选择1-2个记忆
    const count = Math.floor(Math.random() * 2) + 1;
    return sampleMemories.slice(0, count);
}

// 滚动到底部
function scrollToBottom() {
    if (chatElements.messagesArea) {
        chatElements.messagesArea.scrollTop = chatElements.messagesArea.scrollHeight;
    }
}

// 格式化时间
function formatTime(date) {
    return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 格式化相对时间
function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) {
        return `${days}天前`;
    } else if (hours > 0) {
        return `${hours}小时前`;
    } else if (minutes > 0) {
        return `${minutes}分钟前`;
    } else {
        return '刚刚';
    }
}

// 初始化应用
function initApp() {
    // 绑定事件监听器
    if (chatElements.sendButton) {
        chatElements.sendButton.addEventListener('click', sendMessage);
    }
    
    if (chatElements.messageInput) {
        chatElements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (chatElements.backButton) {
        chatElements.backButton.addEventListener('click', backToRoleSelection);
    }
    
    // 绑定角色卡片点击事件
    chatElements.roleCards.forEach(card => {
        card.addEventListener('click', () => {
            const roleId = card.dataset.role;
            if (roleId) {
                selectRole(roleId);
            }
        });
    });
    
    // 初始显示角色选择页面
    switchPage('roleSelection');
    
    console.log('AI酒馆初始化完成');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 记忆演示切换功能
function toggleMemoryDemo() {
    console.log('切换记忆演示功能');
    showMemoryTrigger();
}

// 导出函数到全局作用域
window.selectRole = selectRole;
window.switchToRole = switchToRole;
window.backToRoleSelection = backToRoleSelection;
window.toggleMemoryDemo = toggleMemoryDemo;
window.sendMessage = sendMessage;