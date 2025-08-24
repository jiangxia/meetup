// AI酒馆主应用
class AITavern {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001';
        this.currentBartender = null;
        this.sessionId = 'user_' + Date.now();
        this.isConfigured = false;
        
        this.init();
    }

    async init() {
        await this.checkSystemStatus();
        this.setupEventListeners();
    }

    // 检查系统状态
    async checkSystemStatus() {
        const statusIndicator = document.getElementById('statusIndicator');
        const configAlert = document.getElementById('configAlert');
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            
            if (data.status === 'ok') {
                statusIndicator.innerHTML = `
                    <div class="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <span>服务正常</span>
                `;
                
                // 检查是否已配置
                if (data.services?.openai === 'not configured') {
                    configAlert.classList.remove('hidden');
                    this.isConfigured = false;
                } else {
                    this.isConfigured = true;
                }
            } else {
                throw new Error('服务异常');
            }
        } catch (error) {
            statusIndicator.innerHTML = `
                <div class="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                <span>服务离线</span>
            `;
            
            // 显示配置提醒
            configAlert.classList.remove('hidden');
        }
    }

    // 设置事件监听
    setupEventListeners() {
        // 全局函数绑定
        window.selectBartender = (bartenderId) => this.selectBartender(bartenderId);
        window.sendMessage = () => this.sendMessage();
        window.resetChat = () => this.resetChat();
        window.handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                this.sendMessage();
            }
        };
    }

    // 选择调酒师
    async selectBartender(bartenderId) {
        this.currentBartender = bartenderId;
        
        // 设置调酒师信息
        const bartenderInfo = {
            aria: {
                name: 'Aria',
                desc: '温柔陪伴型调酒师，擅长情感支持',
                bgColor: 'bg-pink-500',
                icon: 'fas fa-heart'
            },
            morgan: {
                name: 'Morgan', 
                desc: '理性分析型调酒师，提供直接建议',
                bgColor: 'bg-blue-500',
                icon: 'fas fa-brain'
            },
            sean: {
                name: 'Sean',
                desc: '创业专家型调酒师，产品思维指导',
                bgColor: 'bg-green-500', 
                icon: 'fas fa-lightbulb'
            }
        };

        const info = bartenderInfo[bartenderId];
        document.getElementById('currentBartender').className = `w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white text-xl ${info.bgColor}`;
        document.getElementById('currentBartender').innerHTML = `<i class="${info.icon}"></i>`;
        document.getElementById('bartenderName').textContent = info.name;
        document.getElementById('bartenderDesc').textContent = info.desc;

        // 显示聊天区域
        document.getElementById('chatArea').classList.remove('hidden');
        
        // 发送欢迎消息
        await this.sendWelcomeMessage();
        
        // 滚动到聊天区域
        document.getElementById('chatArea').scrollIntoView({ behavior: 'smooth' });
    }

    // 发送欢迎消息
    async sendWelcomeMessage() {
        const welcomeMessages = {
            aria: "你好！我是Aria，很高兴为你调制心情。告诉我，今天过得怎么样？🍸",
            morgan: "嘿！Morgan这儿。需要什么帮助吗？我会给你直接有效的建议。",
            sean: "你好！我是Sean，deepractice.ai创始人。有什么产品或创业问题想聊的吗？"
        };

        this.addMessageToChat('bartender', welcomeMessages[this.currentBartender] || '欢迎来到AI酒馆！');
    }

    // 发送消息
    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) return;
        if (!this.currentBartender) {
            alert('请先选择一个调酒师！');
            return;
        }

        // 添加用户消息到界面
        this.addMessageToChat('user', message);
        messageInput.value = '';

        // 显示加载状态
        const loadingId = this.addMessageToChat('bartender', '正在思考中...', true);

        try {
            // 如果未配置，使用Mock模式
            if (!this.isConfigured) {
                setTimeout(() => {
                    this.removeMessage(loadingId);
                    const mockResponse = this.generateMockResponse(message);
                    this.addMessageToChat('bartender', mockResponse);
                    this.showMemoryStatus('Mock模式 - 无实际记忆保存');
                }, 1500);
                return;
            }

            // 调用真实API
            const response = await fetch(`${this.apiBaseUrl}/api/chat/${this.currentBartender}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                })
            });

            const data = await response.json();
            
            // 移除加载消息
            this.removeMessage(loadingId);
            
            if (data.success) {
                this.addMessageToChat('bartender', data.data.message);
                
                // 显示记忆状态
                if (data.data.debug) {
                    const memoryCount = data.data.debug.memories_count || 0;
                    const mcpUsed = data.data.debug.role_activated ? '已激活' : '未激活';
                    this.showMemoryStatus(`MCP: ${mcpUsed}, 记忆: ${memoryCount}条`);
                }
            } else {
                this.addMessageToChat('bartender', '抱歉，我现在无法回复，请稍后再试。');
            }

        } catch (error) {
            this.removeMessage(loadingId);
            this.addMessageToChat('bartender', '连接服务器失败，请检查后端服务是否启动。');
            console.error('发送消息失败:', error);
        }
    }

    // 生成Mock响应
    generateMockResponse(message) {
        const responses = {
            aria: {
                greeting: "你好！我是Aria，很高兴为你调制心情🍸 (Mock模式)",
                stress: "听起来你有些压力呢，让我为你调制一杯放松的鸡尾酒吧~ (Mock模式)",
                work: "工作确实不容易，但记得要照顾好自己哦💕 (Mock模式)",
                default: "作为你的专属调酒师，我会一直陪伴着你的~ (Mock模式)"
            },
            morgan: {
                greeting: "嘿！Morgan这儿。需要什么？(Mock模式)",
                stress: "压力？哈，谁没有呢。来杯威士忌，咱们聊聊。(Mock模式)",
                work: "工作嘛，要么爱它，要么换它。没中间选项。(Mock模式)",
                default: "说吧，什么事让你烦心？老Morgan见得多了。(Mock模式)"
            },
            sean: {
                greeting: "你好！我是Sean，deepractice.ai创始人。有什么创业或产品问题想聊的吗？(Mock模式)",
                stress: "压力是成长的催化剂。让我们用矛盾论分析一下你的具体情况。(Mock模式)",
                work: "工作中的挑战往往隐藏着机会。基于我的创业经验，我们来找找突破点。(Mock模式)",
                default: "我喜欢从产品思维角度分析问题。说说你的具体情况？(Mock模式)"
            }
        };

        const roleResponses = responses[this.currentBartender] || responses.aria;
        
        if (message.includes('你好') || message.includes('hi')) {
            return roleResponses.greeting;
        } else if (message.includes('压力') || message.includes('累')) {
            return roleResponses.stress;
        } else if (message.includes('工作') || message.includes('上班')) {
            return roleResponses.work;
        } else {
            return roleResponses.default;
        }
    }

    // 添加消息到聊天区域
    addMessageToChat(sender, message, isLoading = false) {
        const chatMessages = document.getElementById('chatMessages');
        const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // 如果是第一条消息，清除提示
        if (chatMessages.children.length === 1 && chatMessages.children[0].classList.contains('text-center')) {
            chatMessages.innerHTML = '';
        }

        const messageDiv = document.createElement('div');
        messageDiv.id = messageId;
        messageDiv.className = `mb-4 ${sender === 'user' ? 'text-right' : 'text-left'}`;
        
        const bubbleClass = sender === 'user' 
            ? 'bg-amber-500 text-white ml-auto' 
            : 'bg-gray-200 text-gray-800 mr-auto';
            
        const iconClass = sender === 'user' 
            ? 'fas fa-user' 
            : this.getBartenderIcon();

        messageDiv.innerHTML = `
            <div class="flex ${sender === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2">
                ${sender !== 'user' ? `<div class="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm"><i class="${iconClass}"></i></div>` : ''}
                <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${bubbleClass} ${isLoading ? 'animate-pulse' : ''}">
                    ${message}
                </div>
                ${sender === 'user' ? `<div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm"><i class="fas fa-user"></i></div>` : ''}
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageId;
    }

    // 移除消息
    removeMessage(messageId) {
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
            messageElement.remove();
        }
    }

    // 获取调酒师图标
    getBartenderIcon() {
        const icons = {
            aria: 'fas fa-heart',
            morgan: 'fas fa-brain', 
            sean: 'fas fa-lightbulb'
        };
        return icons[this.currentBartender] || 'fas fa-user';
    }

    // 显示记忆状态
    showMemoryStatus(info) {
        const memoryStatus = document.getElementById('memoryStatus');
        const memoryInfo = document.getElementById('memoryInfo');
        
        memoryInfo.textContent = info;
        memoryStatus.classList.remove('hidden');
        
        // 3秒后隐藏
        setTimeout(() => {
            memoryStatus.classList.add('hidden');
        }, 3000);
    }

    // 重置聊天
    resetChat() {
        if (confirm('确定要重新选择调酒师吗？当前对话记录将被清空。')) {
            this.currentBartender = null;
            document.getElementById('chatArea').classList.add('hidden');
            document.getElementById('chatMessages').innerHTML = `
                <div class="text-center text-gray-500">
                    <i class="fas fa-comments text-3xl mb-2"></i>
                    <p>开始您的对话吧...</p>
                </div>
            `;
            
            // 滚动回顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new AITavern();
});