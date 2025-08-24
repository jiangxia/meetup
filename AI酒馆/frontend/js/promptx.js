// AI酒馆 - PromptX集成模块

// PromptX配置
const PROMPTX_CONFIG = {
    enabled: true,
    apiEndpoint: '/api/promptx',
    timeout: 30000,
    retryAttempts: 3,
    roles: {
        bartender: 'bartender',
        storyteller: 'storyteller', 
        musician: 'musician',
        philosopher: 'philosopher'
    }
};

// PromptX管理类
class PromptXManager {
    constructor() {
        this.isInitialized = false;
        this.currentRole = null;
        this.memories = [];
        this.tools = new Map();
        this.connectionStatus = 'disconnected';
    }
    
    // 初始化PromptX
    async initialize() {
        try {
            console.log('🔧 初始化PromptX集成...');
            
            // 检查PromptX服务状态
            const status = await this.checkStatus();
            if (!status.available) {
                console.warn('PromptX服务不可用，使用模拟模式');
                this.connectionStatus = 'mock';
                return this.initializeMockMode();
            }
            
            // 初始化工具
            await this.loadTools();
            
            // 设置默认角色
            await this.activateRole('assistant');
            
            this.isInitialized = true;
            this.connectionStatus = 'connected';
            
            console.log('✅ PromptX初始化完成');
            return true;
            
        } catch (error) {
            console.error('PromptX初始化失败:', error);
            this.connectionStatus = 'error';
            return this.initializeMockMode();
        }
    }
    
    // 初始化模拟模式
    initializeMockMode() {
        console.log('🎭 启动PromptX模拟模式');
        this.isInitialized = true;
        this.connectionStatus = 'mock';
        
        // 模拟一些记忆数据
        this.memories = [
            {
                id: 'mock-1',
                content: '用户喜欢讨论技术话题',
                role: 'bartender',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                strength: 0.8
            },
            {
                id: 'mock-2', 
                content: '用户对AI很感兴趣',
                role: 'bartender',
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                strength: 0.9
            }
        ];
        
        return true;
    }
    
    // 检查PromptX服务状态
    async checkStatus() {
        try {
            const response = await API.request('/promptx/status');
            return {
                available: response.status === 'ok',
                version: response.version,
                tools: response.tools || []
            };
        } catch (error) {
            console.warn('无法连接PromptX服务:', error.message);
            return { available: false };
        }
    }
    
    // 加载可用工具
    async loadTools() {
        try {
            const response = await API.request('/promptx/tools');
            const tools = response.tools || [];
            
            tools.forEach(tool => {
                this.tools.set(tool.name, tool);
            });
            
            console.log(`加载了 ${tools.length} 个PromptX工具`);
            return tools;
            
        } catch (error) {
            console.error('加载PromptX工具失败:', error);
            return [];
        }
    }
    
    // 激活角色
    async activateRole(roleId) {
        try {
            console.log(`激活PromptX角色: ${roleId}`);
            
            if (this.connectionStatus === 'mock') {
                this.currentRole = roleId;
                return { success: true, role: roleId };
            }
            
            const response = await API.request('/promptx/activate', {
                method: 'POST',
                body: JSON.stringify({ role: roleId })
            });
            
            if (response.success) {
                this.currentRole = roleId;
                console.log(`✅ 角色激活成功: ${roleId}`);
            }
            
            return response;
            
        } catch (error) {
            console.error('角色激活失败:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 发送消息给PromptX
    async sendMessage(message, context = {}) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }
            
            console.log('发送消息到PromptX:', message);
            
            if (this.connectionStatus === 'mock') {
                return this.generateMockResponse(message, context);
            }
            
            const requestData = {
                message: message,
                role: this.currentRole,
                context: {
                    ...context,
                    timestamp: new Date().toISOString(),
                    sessionId: this.getSessionId()
                }
            };
            
            const response = await API.request('/promptx/chat', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });
            
            // 处理记忆更新
            if (response.memory) {
                await this.handleMemoryUpdate(response.memory);
            }
            
            return response;
            
        } catch (error) {
            console.error('PromptX消息发送失败:', error);
            
            // 降级到模拟响应
            return this.generateMockResponse(message, context);
        }
    }
    
    // 生成模拟响应
    generateMockResponse(message, context) {
        const role = context.role || this.currentRole || 'assistant';
        
        // 模拟记忆检索
        const relevantMemories = this.searchMemories(message);
        
        // 生成基础回复
        let response = this.generateBasicResponse(message, role);
        
        // 如果有相关记忆，添加记忆相关内容
        if (relevantMemories.length > 0) {
            response += `\n\n💭 我记得你之前提到过${relevantMemories[0].content}...`;
        }
        
        // 模拟新记忆生成
        const newMemory = this.generateMemoryFromMessage(message, role);
        
        return {
            success: true,
            message: response,
            memory: newMemory,
            metadata: {
                isMock: true,
                role: role,
                relevantMemories: relevantMemories.length
            }
        };
    }
    
    // 生成基础回复
    generateBasicResponse(message, role) {
        const responses = {
            bartender: [
                '这确实是个有趣的话题，来杯酒慢慢聊吧。',
                '我在这里听过很多故事，你的经历很特别。',
                '人生就像调酒，需要合适的配比。'
            ],
            storyteller: [
                '这让我想起了一个古老的传说...',
                '每个故事都有它的意义和智慧。',
                '在很久很久以前，有类似的故事发生过。'
            ],
            musician: [
                '你的话语如音符般动人。',
                '我能感受到你内心的旋律。',
                '让我为你的故事谱一首曲子。'
            ],
            philosopher: [
                '这个问题值得深入思考...',
                '真理往往隐藏在表象之下。',
                '让我们从不同角度来分析这个问题。'
            ]
        };
        
        const roleResponses = responses[role] || responses.bartender;
        return roleResponses[Math.floor(Math.random() * roleResponses.length)];
    }
    
    // 从消息生成记忆
    generateMemoryFromMessage(message, role) {
        // 简单的关键词提取
        const keywords = message.toLowerCase().match(/\b\w{3,}\b/g) || [];
        const importantKeywords = keywords.filter(word => 
            !['the', 'and', 'but', 'for', 'are', 'with', 'this', 'that'].includes(word)
        );
        
        if (importantKeywords.length === 0) return null;
        
        const memoryContent = `用户提到了${importantKeywords.slice(0, 3).join('、')}`;
        
        return {
            id: generateId(),
            content: memoryContent,
            role: role,
            timestamp: new Date().toISOString(),
            strength: 0.7,
            keywords: importantKeywords
        };
    }
    
    // 搜索相关记忆
    searchMemories(query) {
        if (!query || this.memories.length === 0) return [];
        
        const queryWords = query.toLowerCase().split(/\s+/);
        
        return this.memories
            .map(memory => {
                const memoryWords = memory.content.toLowerCase().split(/\s+/);
                const relevance = queryWords.reduce((score, word) => {
                    return score + (memoryWords.some(mWord => mWord.includes(word)) ? 1 : 0);
                }, 0) / queryWords.length;
                
                return { ...memory, relevance };
            })
            .filter(memory => memory.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 3);
    }
    
    // 处理记忆更新
    async handleMemoryUpdate(memoryData) {
        if (!memoryData) return;
        
        try {
            // 添加到本地记忆列表
            this.memories.push({
                ...memoryData,
                timestamp: memoryData.timestamp || new Date().toISOString()
            });
            
            // 限制记忆数量
            if (this.memories.length > 50) {
                this.memories = this.memories
                    .sort((a, b) => b.strength - a.strength)
                    .slice(0, 50);
            }
            
            // 保存到本地存储
            Storage.save('promptx-memories', this.memories);
            
            console.log('记忆已更新:', memoryData.content);
            
            // 触发记忆更新事件
            this.dispatchMemoryEvent('memory-updated', memoryData);
            
        } catch (error) {
            console.error('记忆更新失败:', error);
        }
    }
    
    // 获取所有记忆
    getMemories() {
        return [...this.memories].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    }
    
    // 获取角色记忆
    getRoleMemories(roleId) {
        return this.memories
            .filter(memory => memory.role === roleId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    // 清除记忆
    async clearMemories(roleId = null) {
        try {
            if (roleId) {
                this.memories = this.memories.filter(memory => memory.role !== roleId);
                console.log(`清除了角色 ${roleId} 的记忆`);
            } else {
                this.memories = [];
                console.log('清除了所有记忆');
            }
            
            Storage.save('promptx-memories', this.memories);
            this.dispatchMemoryEvent('memory-cleared', { roleId });
            
            return true;
            
        } catch (error) {
            console.error('清除记忆失败:', error);
            return false;
        }
    }
    
    // 加载保存的记忆
    loadSavedMemories() {
        const savedMemories = Storage.load('promptx-memories', []);
        this.memories = savedMemories;
        console.log(`加载了 ${savedMemories.length} 条保存的记忆`);
    }
    
    // 获取会话ID
    getSessionId() {
        let sessionId = Storage.load('session-id');
        if (!sessionId) {
            sessionId = generateId();
            Storage.save('session-id', sessionId);
        }
        return sessionId;
    }
    
    // 触发记忆事件
    dispatchMemoryEvent(eventType, data) {
        const event = new CustomEvent(eventType, {
            detail: data
        });
        window.dispatchEvent(event);
    }
    
    // 获取连接状态
    getConnectionStatus() {
        return {
            status: this.connectionStatus,
            isInitialized: this.isInitialized,
            currentRole: this.currentRole,
            memoriesCount: this.memories.length
        };
    }
}

// 创建全局PromptX管理器实例
const promptxManager = new PromptXManager();

// 初始化PromptX（页面加载时）
function initPromptX() {
    console.log('🚀 启动PromptX集成...');
    
    // 加载保存的记忆
    promptxManager.loadSavedMemories();
    
    // 异步初始化
    promptxManager.initialize()
        .then(success => {
            if (success) {
                console.log('✅ PromptX集成启动成功');
                updatePromptXStatus();
            } else {
                console.warn('⚠️ PromptX集成启动失败，使用模拟模式');
            }
        })
        .catch(error => {
            console.error('❌ PromptX集成启动异常:', error);
        });
}

// 更新PromptX状态显示
function updatePromptXStatus() {
    const status = promptxManager.getConnectionStatus();
    const statusElement = document.getElementById('promptx-status');
    
    if (statusElement) {
        const statusText = {
            connected: '🟢 已连接',
            mock: '🟡 模拟模式',
            error: '🔴 连接失败',
            disconnected: '⚪ 未连接'
        }[status.status] || '⚪ 未知状态';
        
        statusElement.textContent = statusText;
        statusElement.title = `状态: ${status.status}, 记忆: ${status.memoriesCount}条`;
    }
}

// 更新记忆显示
function updateMemoryDisplay() {
    const memories = promptxManager.getMemories();
    const memoryList = document.getElementById('memory-list');
    
    if (!memoryList) return;
    
    memoryList.innerHTML = '';
    
    if (memories.length === 0) {
        memoryList.innerHTML = '<div class="no-memories">暂无记忆记录</div>';
        return;
    }
    
    memories.slice(0, 10).forEach(memory => {
        const memoryItem = document.createElement('div');
        memoryItem.className = 'memory-item';
        
        const time = new Date(memory.timestamp).toLocaleString('zh-CN');
        const role = roleManager.getRoleById(memory.role);
        const roleDisplay = role ? `${role.avatar} ${role.name}` : memory.role;
        
        memoryItem.innerHTML = `
            <div class="memory-header">
                <span class="memory-role">${roleDisplay}</span>
                <span class="memory-time">${time}</span>
            </div>
            <div class="memory-content">${memory.content}</div>
            <div class="memory-strength">
                <div class="strength-bar">
                    <div class="strength-fill" style="width: ${memory.strength * 100}%"></div>
                </div>
                <span class="strength-value">${(memory.strength * 100).toFixed(0)}%</span>
            </div>
        `;
        
        memoryList.appendChild(memoryItem);
    });
}

// 监听记忆更新事件
window.addEventListener('memory-updated', (event) => {
    updateMemoryDisplay();
    updatePromptXStatus();
});

window.addEventListener('memory-cleared', (event) => {
    updateMemoryDisplay();
    updatePromptXStatus();
});

// 导出函数供全局使用
window.promptxManager = promptxManager;
window.initPromptX = initPromptX;
window.updateMemoryDisplay = updateMemoryDisplay;
window.updatePromptXStatus = updatePromptXStatus;

console.log('🧠 PromptX集成模块加载完成');