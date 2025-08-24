// AI酒馆配置管理系统
class ConfigManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3001';
        this.config = {};
        this.init();
    }

    async init() {
        await this.loadCurrentConfig();
        await this.checkServiceStatus();
        this.setupEventListeners();
    }

    // 检查服务状态
    async checkServiceStatus() {
        const statusIndicator = document.getElementById('statusIndicator');
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            
            if (data.status === 'ok') {
                statusIndicator.innerHTML = `
                    <div class="flex items-center">
                        <div class="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                        <span class="text-green-600 font-medium">服务正常运行</span>
                        <div class="ml-4 text-sm text-gray-500">
                            MCP: ${data.services?.mcp || 'unknown'} | 
                            OpenAI: ${data.services?.openai || 'unknown'}
                        </div>
                    </div>
                `;
            } else {
                throw new Error('服务状态异常');
            }
        } catch (error) {
            statusIndicator.innerHTML = `
                <div class="flex items-center">
                    <div class="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    <span class="text-red-600 font-medium">服务离线</span>
                    <div class="ml-4 text-sm text-gray-500">请确保后端服务已启动</div>
                </div>
            `;
        }
    }

    // 加载当前配置
    async loadCurrentConfig() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/config`);
            if (response.ok) {
                this.config = await response.json();
                this.populateForm();
            }
        } catch (error) {
            console.log('首次使用，将使用默认配置');
            this.setDefaultValues();
        }
    }

    // 填充表单
    populateForm() {
        if (this.config.openai?.apiKey) {
            document.getElementById('openaiApiKey').value = '••••••••••••••••';
        }
        document.getElementById('openaiModel').value = this.config.openai?.model || 'gpt-4o-mini';
        document.getElementById('mcpTransport').value = this.config.mcp?.transport || 'stdio';
        document.getElementById('mcpCommand').value = this.config.mcp?.command || 'promptx mcp';
        document.getElementById('mcpTimeout').value = this.config.mcp?.timeout || '10000';
        document.getElementById('serverPort').value = this.config.server?.port || '3001';
        document.getElementById('defaultSession').value = this.config.session?.defaultId || 'default';
        document.getElementById('maxMemories').value = this.config.session?.maxMemories || '100';
        document.getElementById('debugMode').checked = this.config.debug?.enabled || false;
    }

    // 设置默认值
    setDefaultValues() {
        document.getElementById('openaiModel').value = 'gpt-4o-mini';
        document.getElementById('mcpTransport').value = 'stdio';
        document.getElementById('mcpCommand').value = 'promptx mcp';
        document.getElementById('mcpTimeout').value = '10000';
        document.getElementById('serverPort').value = '3001';
        document.getElementById('defaultSession').value = 'default';
        document.getElementById('maxMemories').value = '100';
        document.getElementById('debugMode').checked = false;
    }

    // 设置事件监听器
    setupEventListeners() {
        // OpenAI 配置表单
        document.getElementById('openaiForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveOpenAIConfig();
        });

        // MCP 配置表单  
        document.getElementById('mcpForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveMCPConfig();
        });

        // 密码显示切换
        window.togglePasswordVisibility = (inputId) => {
            const input = document.getElementById(inputId);
            const icon = input.nextElementSibling.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';  
                icon.className = 'fas fa-eye';
            }
        };

        // 全局函数绑定
        window.checkServiceStatus = () => this.checkServiceStatus();
        window.resetToDefaults = () => this.resetToDefaults();
        window.saveAdvancedConfig = () => this.saveAdvancedConfig();
        window.testConfiguration = () => this.testConfiguration();
        window.downloadConfig = () => this.downloadConfig();
        window.restartServices = () => this.restartServices();
    }

    // 保存 OpenAI 配置
    async saveOpenAIConfig() {
        const apiKey = document.getElementById('openaiApiKey').value;
        const model = document.getElementById('openaiModel').value;

        if (!apiKey || apiKey === '••••••••••••••••') {
            this.showNotification('请输入有效的 OpenAI API Key', 'error');
            return;
        }

        if (!apiKey.startsWith('sk-')) {
            this.showNotification('OpenAI API Key 应该以 sk- 开头', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/config/openai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey, model })
            });

            if (response.ok) {
                this.showNotification('OpenAI 配置保存成功！', 'success');
                // 隐藏 API Key
                document.getElementById('openaiApiKey').value = '••••••••••••••••';
            } else {
                throw new Error('保存失败');
            }
        } catch (error) {
            this.showNotification('保存 OpenAI 配置失败', 'error');
        }
    }

    // 保存 MCP 配置
    async saveMCPConfig() {
        const transport = document.getElementById('mcpTransport').value;
        const command = document.getElementById('mcpCommand').value;
        const timeout = parseInt(document.getElementById('mcpTimeout').value);

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/config/mcp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transport, command, timeout })
            });

            if (response.ok) {
                this.showNotification('MCP 配置保存成功！', 'success');
            } else {
                throw new Error('保存失败');
            }
        } catch (error) {
            this.showNotification('保存 MCP 配置失败', 'error');
        }
    }

    // 保存高级配置
    async saveAdvancedConfig() {
        const port = parseInt(document.getElementById('serverPort').value);
        const defaultSession = document.getElementById('defaultSession').value;
        const maxMemories = parseInt(document.getElementById('maxMemories').value);
        const debugMode = document.getElementById('debugMode').checked;

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/config/advanced`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    server: { port },
                    session: { defaultId: defaultSession, maxMemories },
                    debug: { enabled: debugMode }
                })
            });

            if (response.ok) {
                this.showNotification('高级配置保存成功！', 'success');
            } else {
                throw new Error('保存失败');
            }
        } catch (error) {
            this.showNotification('保存高级配置失败', 'error');
        }
    }

    // 重置为默认值
    resetToDefaults() {
        if (confirm('确定要重置所有配置为默认值吗？此操作不可撤销。')) {
            this.setDefaultValues();
            document.getElementById('openaiApiKey').value = '';
            this.showNotification('配置已重置为默认值', 'info');
        }
    }

    // 测试配置
    async testConfiguration() {
        this.showNotification('开始测试配置...', 'info');
        
        try {
            // 测试 MCP 连接
            const mcpResponse = await fetch(`${this.apiBaseUrl}/api/mcp/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: 'remember',
                    params: { content: '配置测试', session: 'test' }
                })
            });

            // 测试 OpenAI 连接
            const chatResponse = await fetch(`${this.apiBaseUrl}/api/chat/aria`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: '测试消息，请简短回复确认配置正常',
                    sessionId: 'config-test'
                })
            });

            if (mcpResponse.ok && chatResponse.ok) {
                this.showNotification('✅ 所有服务测试通过！配置正确', 'success');
            } else {
                this.showNotification('❌ 部分服务测试失败，请检查配置', 'warning');
            }
        } catch (error) {
            this.showNotification('❌ 配置测试失败，请检查服务状态', 'error');
        }
    }

    // 下载配置文件
    downloadConfig() {
        const config = {
            openai: {
                model: document.getElementById('openaiModel').value,
                apiKey: 'your_openai_api_key_here'
            },
            mcp: {
                transport: document.getElementById('mcpTransport').value,
                command: document.getElementById('mcpCommand').value,
                timeout: parseInt(document.getElementById('mcpTimeout').value)
            },
            server: {
                port: parseInt(document.getElementById('serverPort').value)
            },
            session: {
                defaultId: document.getElementById('defaultSession').value,
                maxMemories: parseInt(document.getElementById('maxMemories').value)
            },
            debug: {
                enabled: document.getElementById('debugMode').checked
            }
        };

        const envContent = `# AI酒馆配置文件 - 自动生成
# 生成时间: ${new Date().toLocaleString()}

# 服务器配置
PORT=${config.server.port}
NODE_ENV=development

# OpenAI API 配置
OPENAI_API_KEY=${config.openai.apiKey}
OPENAI_MODEL=${config.openai.model}

# MCP 连接配置
MCP_TRANSPORT=${config.mcp.transport}
MCP_SERVER_COMMAND=${config.mcp.command}
MCP_TIMEOUT=${config.mcp.timeout}

# 会话配置
DEFAULT_SESSION_ID=${config.session.defaultId}
MAX_MEMORIES=${config.session.maxMemories}

# 调试配置
DEBUG_MCP=${config.debug.enabled}
DEBUG_OPENAI=${config.debug.enabled}
`;

        const blob = new Blob([envContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '.env';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('配置文件已下载，请放置在 backend/ 目录下', 'success');
    }

    // 重启服务
    async restartServices() {
        if (!confirm('确定要重启后端服务吗？这将中断当前所有连接。')) return;

        try {
            await fetch(`${this.apiBaseUrl}/api/admin/restart`, { method: 'POST' });
            this.showNotification('服务重启请求已发送，请等待...', 'info');
            
            // 延迟检查服务状态
            setTimeout(() => {
                this.checkServiceStatus();
            }, 5000);
        } catch (error) {
            this.showNotification('重启请求失败', 'error');
        }
    }

    // 显示通知
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notificationText');
        const notificationDiv = notification.firstElementChild;
        
        // 设置样式
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        notificationDiv.className = `${colors[type] || colors.success} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`;
        text.textContent = message;
        
        // 显示通知
        notification.classList.remove('hidden');
        
        // 3秒后自动隐藏
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ConfigManager();
});