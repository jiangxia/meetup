# AI酒馆用户配置指南 🔧

## 🚀 快速开始配置

**💡 推荐方式**: 考虑添加前端配置界面，让用户通过Web页面可视化配置，比手动编辑文件更用户友好。

### 1. 环境准备

#### 必须安装的软件
- **Node.js 18+** - [下载地址](https://nodejs.org/)
- **PromptX CLI** - AI酒馆的核心依赖
  ```bash
  npm install -g @promptx/cli
  ```

#### 验证安装
```bash
# 检查版本
node --version     # 应该显示 v18.x.x 或更高
promptx --version  # 应该显示 PromptX 版本

# 测试 PromptX MCP Server
promptx mcp        # 应该启动 MCP Server (Ctrl+C 退出测试)
```

### 2. 项目配置

#### 下载项目
```bash
git clone https://github.com/jiangxia/meetup.git
cd meetup/AI酒馆
```

#### 安装依赖 (仅需3个包!)
```bash
cd backend
npm install express cors dotenv
```

### 3. 环境变量配置

#### 创建配置文件
```bash
# 复制模板
cp .env.example .env

# 编辑配置
nano .env  # 或使用您喜欢的编辑器
```

#### 配置模板 (.env.example)
```bash
# ===========================================
# AI酒馆配置文件
# ===========================================

# 🌐 服务器配置
PORT=3001
NODE_ENV=development

# 🤖 OpenAI API 配置
# 获取地址: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# 🔗 MCP 连接配置
MCP_TRANSPORT=stdio
MCP_SERVER_COMMAND=promptx mcp

# 🛡️ 安全配置 (可选)
CORS_ORIGIN=http://localhost:8080,http://127.0.0.1:8080

# 🐛 调试配置 (可选)
DEBUG_MCP=false
DEBUG_OPENAI=false
```

## 📋 详细配置说明

### OpenAI API Key 获取步骤

1. **注册OpenAI账户**
   - 访问: https://platform.openai.com/
   - 注册/登录您的账户

2. **创建API Key**
   - 进入: [API Keys页面](https://platform.openai.com/api-keys)
   - 点击 "Create new secret key"
   - 复制生成的key (sk-开头的字符串)
   - ⚠️ **重要**: 立即保存，页面关闭后无法再查看

3. **配置到项目**
   ```bash
   # 编辑 .env 文件
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

### PromptX 配置

#### 基础配置
```bash
# 初始化 PromptX (如果是首次使用)
promptx init

# 测试 MCP 连接
promptx mcp
```

#### AI酒馆角色配置 (可选)
如果您想自定义AI角色：
```bash
# 查看现有角色
promptx list roles

# 激活特定角色 (测试用)
promptx action ai-tavern-aria
```

## 🧪 配置验证

### 1. 后端服务测试
```bash
cd backend
npm start
```

应该看到：
```
✅ MCP Client connected to PromptX Server
✅ OpenAI Client initialized
🍺 ===== AI酒馆纯原生+MCP后端已启动 =====
📍 服务地址: http://localhost:3001
```

### 2. 健康检查
```bash
curl http://localhost:3001/health
```

成功响应：
```json
{
  "status": "ok", 
  "message": "AI酒馆纯原生+MCP后端运行中",
  "services": {
    "mcp": "connected",
    "openai": "configured"
  }
}
```

### 3. MCP连接测试
```bash
curl -X POST http://localhost:3001/api/mcp/test \
  -H "Content-Type: application/json" \
  -d '{"tool": "remember", "params": {"content": "配置测试", "session": "test"}}'
```

### 4. 对话测试
```bash
curl -X POST http://localhost:3001/api/chat/aria \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，配置成功了吗？", "sessionId": "test"}'
```

## 🚨 常见问题解决

### Q1: PromptX MCP Server 启动失败
```bash
# 检查 PromptX 安装
npm list -g @promptx/cli

# 重新安装
npm uninstall -g @promptx/cli
npm install -g @promptx/cli

# 测试启动
promptx mcp
```

### Q2: OpenAI API 调用失败
```bash
# 检查 API Key 格式
echo $OPENAI_API_KEY  # 应该以 sk- 开头

# 测试 API 连通性
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Q3: 端口冲突
```bash
# 检查端口占用
lsof -i :3001

# 修改端口
echo "PORT=3002" >> .env
```

### Q4: CORS 跨域问题
```bash
# 检查前端地址
echo "CORS_ORIGIN=http://localhost:8080,http://127.0.0.1:8080" >> .env
```

## 🔒 安全注意事项

### API Key 安全
- ✅ **永远不要**提交 `.env` 文件到 git
- ✅ 使用 `.gitignore` 忽略敏感文件
- ✅ 定期轮换 API Keys
- ✅ 限制 API Key 权限和额度

### 生产环境配置
```bash
# 生产环境配置示例
NODE_ENV=production
PORT=80
CORS_ORIGIN=https://your-domain.com
DEBUG_MCP=false
DEBUG_OPENAI=false
```

## 📞 获得帮助

如果配置过程中遇到问题：

1. **检查日志**: 查看后端启动时的控制台输出
2. **查看文档**: 参考 `AI_TAVERN_DEVELOPMENT_GUIDE.md`
3. **社区支持**: GitHub Issues 或项目文档
4. **调试模式**: 设置 `DEBUG_MCP=true` 获得详细日志

---

**🍺 祝您配置顺利，享受AI酒馆的体验！**