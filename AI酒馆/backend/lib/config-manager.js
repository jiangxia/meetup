const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.configFile = path.join(__dirname, '../.env');
        this.backupFile = path.join(__dirname, '../.env.backup');
        this.config = {};
        this.loadConfig();
    }

    // 加载当前配置
    loadConfig() {
        try {
            if (fs.existsSync(this.configFile)) {
                const envContent = fs.readFileSync(this.configFile, 'utf8');
                this.config = this.parseEnvContent(envContent);
            }
        } catch (error) {
            console.error('Failed to load config:', error);
        }
    }

    // 解析 .env 文件内容
    parseEnvContent(content) {
        const config = {};
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length) {
                    config[key.trim()] = valueParts.join('=').trim();
                }
            }
        }
        
        return config;
    }

    // 获取当前配置（脱敏处理）
    getCurrentConfig() {
        const safeConfig = {
            openai: {
                apiKey: this.config.OPENAI_API_KEY ? '已配置' : '未配置',
                model: this.config.OPENAI_MODEL || 'gpt-4o-mini'
            },
            mcp: {
                transport: this.config.MCP_TRANSPORT || 'stdio',
                command: this.config.MCP_SERVER_COMMAND || 'promptx mcp',
                timeout: parseInt(this.config.MCP_TIMEOUT || '10000')
            },
            server: {
                port: parseInt(this.config.PORT || '3001')
            },
            session: {
                defaultId: this.config.DEFAULT_SESSION_ID || 'default',
                maxMemories: parseInt(this.config.MAX_MEMORIES || '100')
            },
            debug: {
                enabled: this.config.DEBUG_MCP === 'true' || this.config.DEBUG_OPENAI === 'true'
            }
        };
        
        return safeConfig;
    }

    // 更新 OpenAI 配置
    updateOpenAIConfig(apiKey, model) {
        if (!apiKey || !apiKey.startsWith('sk-')) {
            throw new Error('Invalid OpenAI API key');
        }
        
        this.config.OPENAI_API_KEY = apiKey;
        this.config.OPENAI_MODEL = model || 'gpt-4o-mini';
        this.saveConfig();
    }

    // 更新 MCP 配置
    updateMCPConfig(transport, command, timeout) {
        this.config.MCP_TRANSPORT = transport || 'stdio';
        this.config.MCP_SERVER_COMMAND = command || 'promptx mcp';
        this.config.MCP_TIMEOUT = String(timeout || 10000);
        this.saveConfig();
    }

    // 更新高级配置
    updateAdvancedConfig(serverConfig, sessionConfig, debugConfig) {
        if (serverConfig?.port) {
            this.config.PORT = String(serverConfig.port);
        }
        
        if (sessionConfig?.defaultId) {
            this.config.DEFAULT_SESSION_ID = sessionConfig.defaultId;
        }
        
        if (sessionConfig?.maxMemories) {
            this.config.MAX_MEMORIES = String(sessionConfig.maxMemories);
        }
        
        if (debugConfig?.enabled !== undefined) {
            this.config.DEBUG_MCP = String(debugConfig.enabled);
            this.config.DEBUG_OPENAI = String(debugConfig.enabled);
        }
        
        this.saveConfig();
    }

    // 保存配置到文件
    saveConfig() {
        try {
            // 备份当前配置
            if (fs.existsSync(this.configFile)) {
                fs.copyFileSync(this.configFile, this.backupFile);
            }
            
            // 生成新的 .env 内容
            const envContent = this.generateEnvContent();
            
            // 写入文件
            fs.writeFileSync(this.configFile, envContent, 'utf8');
            
            console.log('✅ Configuration saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to save configuration:', error);
            return false;
        }
    }

    // 生成 .env 文件内容
    generateEnvContent() {
        const timestamp = new Date().toLocaleString();
        
        return `# AI酒馆配置文件
# 最后更新: ${timestamp}

# 🌐 服务器配置
PORT=${this.config.PORT || '3001'}
NODE_ENV=${this.config.NODE_ENV || 'development'}

# 🤖 OpenAI API 配置
OPENAI_API_KEY=${this.config.OPENAI_API_KEY || 'your_openai_api_key_here'}
OPENAI_MODEL=${this.config.OPENAI_MODEL || 'gpt-4o-mini'}

# 🔗 MCP 连接配置
MCP_TRANSPORT=${this.config.MCP_TRANSPORT || 'stdio'}
MCP_SERVER_COMMAND=${this.config.MCP_SERVER_COMMAND || 'promptx mcp'}
MCP_TIMEOUT=${this.config.MCP_TIMEOUT || '10000'}

# 💾 会话配置
DEFAULT_SESSION_ID=${this.config.DEFAULT_SESSION_ID || 'default'}
MAX_MEMORIES=${this.config.MAX_MEMORIES || '100'}

# 🐛 调试配置
DEBUG_MCP=${this.config.DEBUG_MCP || 'false'}
DEBUG_OPENAI=${this.config.DEBUG_OPENAI || 'false'}

# 🛡️ 安全配置
CORS_ORIGIN=${this.config.CORS_ORIGIN || 'http://localhost:8080,http://127.0.0.1:8080'}
`;
    }

    // 验证配置
    validateConfig() {
        const issues = [];
        
        if (!this.config.OPENAI_API_KEY || this.config.OPENAI_API_KEY === 'your_openai_api_key_here') {
            issues.push('OpenAI API Key 未配置');
        } else if (!this.config.OPENAI_API_KEY.startsWith('sk-')) {
            issues.push('OpenAI API Key 格式无效');
        }
        
        const port = parseInt(this.config.PORT || '3001');
        if (port < 1000 || port > 65535) {
            issues.push('端口号无效 (应在 1000-65535 范围内)');
        }
        
        const timeout = parseInt(this.config.MCP_TIMEOUT || '10000');
        if (timeout < 1000 || timeout > 60000) {
            issues.push('MCP 超时设置无效 (应在 1000-60000ms 范围内)');
        }
        
        return {
            valid: issues.length === 0,
            issues: issues
        };
    }

    // 重置为默认配置
    resetToDefaults() {
        this.config = {
            PORT: '3001',
            NODE_ENV: 'development',
            OPENAI_API_KEY: 'your_openai_api_key_here',
            OPENAI_MODEL: 'gpt-4o-mini',
            MCP_TRANSPORT: 'stdio',
            MCP_SERVER_COMMAND: 'promptx mcp',
            MCP_TIMEOUT: '10000',
            DEFAULT_SESSION_ID: 'default',
            MAX_MEMORIES: '100',
            DEBUG_MCP: 'false',
            DEBUG_OPENAI: 'false',
            CORS_ORIGIN: 'http://localhost:8080,http://127.0.0.1:8080'
        };
        
        return this.saveConfig();
    }

    // 获取配置统计
    getConfigStats() {
        const validation = this.validateConfig();
        
        return {
            isConfigured: this.config.OPENAI_API_KEY && this.config.OPENAI_API_KEY !== 'your_openai_api_key_here',
            validationResult: validation,
            lastModified: fs.existsSync(this.configFile) ? 
                fs.statSync(this.configFile).mtime.toISOString() : null,
            hasBackup: fs.existsSync(this.backupFile)
        };
    }
}

module.exports = { ConfigManager };