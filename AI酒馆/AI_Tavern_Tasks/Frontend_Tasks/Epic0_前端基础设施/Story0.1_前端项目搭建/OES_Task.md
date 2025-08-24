# Story 0.1: 项目搭建和结构设计

## O (Objective)
创建AI酒馆项目的基础结构，初始化开发环境，建立清晰的代码组织

## E (Environment)
- **项目名称**: ai-tavern (AI酒馆)
- **技术选型**: 纯前端Web应用，HTML/CSS/JS
- **版本控制**: Git + GitHub
- **包管理**: npm (如需要依赖)
- **编辑器**: VS Code (推荐插件)

## S (Success Criteria)

### 及格标准
- ✅ 项目目录结构清晰合理
- ✅ Git仓库初始化完成
- ✅ 基础文件创建并可运行
- ✅ 开发规范文档就绪

### 优秀标准
- ✅ 目录结构符合前端最佳实践
- ✅ 项目配置完整专业
- ✅ 代码规范和注释标准建立
- ✅ 开发工作流程顺畅

## 具体任务分解

### Task 0.1.1: 项目目录结构创建
**预估时间**: 20分钟
**具体内容**:
- 创建项目根目录和子目录
- 建立文件组织规范
- 创建基础的index.html入口文件
- 设置资源文件夹结构

**目录结构设计**:
```
ai-tavern/
├── index.html                 # 应用入口
├── favicon.ico                # 网站图标
├── manifest.json              # PWA配置(可选)
├── README.md                  # 项目说明
├── package.json               # 项目配置(如需要)
├── .gitignore                 # Git忽略文件
├── css/
│   ├── main.css              # 主样式文件
│   ├── components.css        # 组件样式
│   ├── tavern-theme.css      # 酒馆主题
│   └── reset.css             # 样式重置
├── js/
│   ├── app.js                # 应用主入口
│   ├── config.js             # 配置文件
│   ├── components/
│   │   ├── RoleSelector.js   # 角色选择组件
│   │   ├── ChatInterface.js  # 对话界面组件
│   │   ├── MemoryDisplay.js  # 记忆展示组件
│   │   └── RoleRecommend.js  # 角色推荐组件
│   ├── services/
│   │   ├── LLMService.js     # LLM API服务
│   │   ├── PromptXService.js # PromptX工具服务
│   │   └── StorageService.js # 本地存储服务
│   └── utils/
│       ├── dom.js            # DOM操作工具
│       ├── api.js            # API调用工具
│       ├── storage.js        # 存储工具
│       └── format.js         # 格式化工具
├── assets/
│   ├── images/
│   │   ├── tavern-bg.jpg     # 酒馆背景
│   │   ├── aria-avatar.png   # Aria头像
│   │   └── morgan-avatar.png # Morgan头像
│   ├── icons/
│   │   ├── send.svg          # 发送图标
│   │   ├── memory.svg        # 记忆图标
│   │   └── recommend.svg     # 推荐图标
│   └── fonts/                # 字体文件(如需要)
├── data/
│   ├── roles.json            # 角色配置数据
│   ├── prompts.json          # 提示词模板
│   └── mock-responses.json   # 模拟数据(开发用)
├── docs/
│   ├── README.md             # 详细文档
│   ├── DEVELOPMENT.md        # 开发指南
│   └── DEPLOYMENT.md         # 部署说明
└── tests/                    # 测试文件(可选)
    ├── unit/                 # 单元测试
    └── integration/          # 集成测试
```

### Task 0.1.2: Git仓库初始化
**预估时间**: 10分钟
**具体内容**:
- 初始化Git仓库
- 创建.gitignore文件
- 设置初始提交
- 连接到远程仓库(GitHub)

**Git配置**:
```bash
# 初始化项目
git init
git add .
git commit -m "🎉 Initial commit: AI Tavern project setup"

# 连接远程仓库
git remote add origin https://github.com/[username]/ai-tavern.git
git push -u origin main
```

**.gitignore内容**:
```
# 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 环境配置
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 编辑器
.vscode/
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 构建输出
dist/
build/

# 日志
logs/
*.log

# 临时文件
tmp/
temp/
```

### Task 0.1.3: 基础HTML结构创建
**预估时间**: 15分钟
**具体内容**:
- 创建index.html主页面
- 设置基础的HTML5结构
- 引入必要的meta标签
- 链接CSS和JS文件

**index.html基础结构**:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI酒馆 - 基于PromptX的智能角色演示系统">
    <title>AI酒馆 | PromptX演示</title>
    
    <!-- 样式文件 -->
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/tavern-theme.css">
    
    <!-- PWA配置 -->
    <link rel="manifest" href="manifest.json">
    <link rel="icon" href="favicon.ico">
</head>
<body>
    <!-- 应用主容器 -->
    <div id="app">
        <!-- 加载提示 -->
        <div id="loading" class="loading-screen">
            <div class="loading-spinner"></div>
            <p>正在进入AI酒馆...</p>
        </div>
        
        <!-- 角色选择界面 -->
        <div id="role-selection" class="screen" style="display:none;">
            <!-- Epic 1 内容区域 -->
        </div>
        
        <!-- 对话界面 -->
        <div id="chat-interface" class="screen" style="display:none;">
            <!-- Epic 2 内容区域 -->
        </div>
        
        <!-- 记忆展示界面 -->
        <div id="memory-display" class="screen" style="display:none;">
            <!-- Epic 3 内容区域 -->
        </div>
        
        <!-- 角色推荐界面 -->
        <div id="role-recommend" class="screen" style="display:none;">
            <!-- Epic 4 内容区域 -->
        </div>
    </div>

    <!-- JavaScript文件 -->
    <script src="js/utils/dom.js"></script>
    <script src="js/utils/storage.js"></script>
    <script src="js/utils/api.js"></script>
    <script src="js/services/StorageService.js"></script>
    <script src="js/services/LLMService.js"></script>
    <script src="js/services/PromptXService.js"></script>
    <script src="js/components/RoleSelector.js"></script>
    <script src="js/components/ChatInterface.js"></script>
    <script src="js/components/MemoryDisplay.js"></script>
    <script src="js/components/RoleRecommend.js"></script>
    <script src="js/config.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### Task 0.1.4: 项目配置文件创建
**预估时间**: 15分钟
**具体内容**:
- 创建package.json(如需要npm依赖)
- 创建项目README.md
- 设置开发和部署脚本
- 创建项目配置文件

**package.json (可选)**:
```json
{
  "name": "ai-tavern",
  "version": "1.0.0",
  "description": "AI酒馆 - 基于PromptX的智能角色演示系统",
  "main": "index.html",
  "scripts": {
    "start": "npx serve .",
    "dev": "npx live-server --port=3000",
    "build": "echo 'No build process needed'",
    "deploy": "npm run build && gh-pages -d ."
  },
  "keywords": ["AI", "PromptX", "Chatbot", "Demo"],
  "author": "Sean (姜山)",
  "license": "MIT",
  "devDependencies": {
    "live-server": "^1.2.2",
    "gh-pages": "^4.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/[username]/ai-tavern.git"
  }
}
```

**README.md基础内容**:
```markdown
# AI酒馆 🍺

基于PromptX协议的多Agent演示系统，展示AI的记忆能力和角色概念。

## 🎯 项目目标
- 演示PromptX的记忆功能和Agent概念
- 5-8分钟完整演示流程
- 黑客松48小时开发挑战

## 🚀 快速开始
1. 克隆项目：`git clone [repo-url]`
2. 进入目录：`cd ai-tavern`
3. 启动服务：`npm start` 或直接打开 `index.html`

## 📁 项目结构
- `/css` - 样式文件
- `/js` - JavaScript代码
- `/assets` - 静态资源
- `/data` - 配置数据

## 🛠️ 技术栈
- HTML5 + CSS3 + Vanilla JavaScript
- PromptX MCP工具集成
- 响应式设计

## 📝 开发状态
- [x] 项目搭建
- [ ] 角色选择界面
- [ ] 基础对话系统
- [ ] PromptX记忆演示
- [ ] 简化角色推荐

## 👥 团队
- Sean (姜山) - 项目负责人
```

## 验收标准
1. 项目目录结构清晰，文件组织合理
2. Git仓库正常，有清晰的提交历史
3. 基础HTML文件可在浏览器中正常打开
4. 项目配置文件完整，开发流程顺畅
5. 代码结构为后续开发提供良好基础

## 后续衔接
完成后立即可以开始Epic 1的角色选择界面开发，所有基础设施已准备就绪。