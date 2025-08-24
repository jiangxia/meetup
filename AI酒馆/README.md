# AI酒馆 🍺 - 纯原生+MCP架构演示

基于**纯原生实现+MCP协议**的AI对话系统，展示标准化集成的技术价值。

## ⚡ 快速开始

### 🔧 用户配置 (必读!)

**👉 [点击查看详细配置指南 - CONFIG_GUIDE.md](./CONFIG_GUIDE.md)**

包含：
- ✅ PromptX CLI 安装
- ✅ OpenAI API Key 获取
- ✅ 环境变量配置  
- ✅ 常见问题解决

### 🏗️ 开发者文档

**👉 [技术架构和开发指南 - AI_TAVERN_DEVELOPMENT_GUIDE.md](./AI_TAVERN_DEVELOPMENT_GUIDE.md)**

包含：
- 🎯 纯原生+MCP架构设计
- 📊 开发时间优化 (50h→22h)
- 🔧 MCP Client实现细节
- 🧪 测试和部署指南

## 🎯 项目亮点

### 架构优势
- **零框架依赖**: 仅3个npm包 (express, cors, dotenv)
- **MCP标准化**: JSON-RPC 2.0协议集成PromptX
- **原生实现**: 直接控制OpenAI API和MCP通信
- **快速启动**: <1秒启动时间，完全可控

### 开发效率
- **时间节省56%**: 从50小时降至22小时
- **简化调试**: 清晰的代码路径，易于定位问题
- **标准协议**: 基于MCP的生态兼容性

## 📋 项目结构

```
AI酒馆/
├── CONFIG_GUIDE.md              # 🔧 用户配置指南 (入门必读)
├── AI_TAVERN_DEVELOPMENT_GUIDE.md # 🏗️ 开发者技术文档
├── .env.example                 # 📄 配置模板
├── AI_Tavern_Tasks/            # 📋 详细任务分解
└── backend/                    # 🚀 纯原生+MCP后端
    ├── server.js               # Express + 原生实现主服务器
    └── lib/
        ├── mcp-client.js       # 原生MCP Client (JSON-RPC 2.0)
        ├── openai-client.js    # 原生OpenAI API调用
        └── promptx-service.js  # PromptX服务封装
```

## 🎭 演示场景

1. **MCP连接演示** - 实时展示原生MCP Client调用过程
2. **角色对话体验** - Aria(温柔型)、Morgan(理性型)、Sean(专家型)
3. **记忆保存回调** - 可视化展示MCP协议的记忆功能
4. **技术价值对比** - MCP标准化 vs 传统框架集成优势

## 🚨 重要提醒

**首次使用必须配置：**
1. ✅ 安装 PromptX CLI
2. ✅ 获取 OpenAI API Key  
3. ✅ 创建 .env 配置文件

**详细步骤请查看：[CONFIG_GUIDE.md](./CONFIG_GUIDE.md)**

## 📞 获得帮助

- 📖 **配置问题**: 查看 [CONFIG_GUIDE.md](./CONFIG_GUIDE.md)
- 🏗️ **开发问题**: 查看 [AI_TAVERN_DEVELOPMENT_GUIDE.md](./AI_TAVERN_DEVELOPMENT_GUIDE.md)
- 🐛 **Bug反馈**: GitHub Issues
- 💡 **功能建议**: GitHub Discussions

---

**🍺 享受纯原生+MCP架构带来的极致体验！**