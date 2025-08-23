# Epic 0: 技术基础设施

## Epic概述 (黑客松版)

### O (Objective)
搭建AI酒馆项目的技术基础设施，为业务功能开发提供稳定的技术底座

### E (Environment)
- **项目类型**: 前端Web应用，可选轻量后端
- **技术栈**: HTML/CSS/JS + Node.js(可选)
- **开发工具**: VS Code + Git + npm/pnpm
- **部署目标**: GitHub Pages或Vercel
- **时间限制**: 黑客松前置任务，4-6小时完成

### S (Success Criteria)
**及格标准**：
- ✅ 项目结构清晰，代码可运行
- ✅ 开发环境配置完整
- ✅ 基础组件可复用
- ✅ 部署流程可执行

**优秀标准**：
- ✅ 项目结构符合最佳实践
- ✅ 开发体验流畅高效
- ✅ 组件设计简洁优雅
- ✅ 部署自动化完整

## Story列表 (技术基础)

- [Story 0.1: 项目搭建和结构设计](./Story0.1_项目搭建/) - 项目初始化和目录结构
- [Story 0.2: 开发环境配置](./Story0.2_开发环境/) - 开发工具和构建配置
- [Story 0.3: 基础组件开发](./Story0.3_基础组件/) - 通用UI组件和工具函数
- [Story 0.4: 部署配置准备](./Story0.4_部署配置/) - 部署环境和CI/CD配置

## 与业务Epic的关系

### 依赖关系
```
Epic 0 (技术基础) → Epic 1-4 (业务功能)
```

### 并行开发策略
- **Epic 0.1-0.2**: 必须优先完成 (项目搭建+环境)
- **Epic 0.3**: 可与Epic 1-2并行开发 (基础组件)
- **Epic 0.4**: 最后完成 (部署配置)

## 黑客松时间分配

| Story | 预估时间 | 优先级 | 建议时机 |
|-------|----------|--------|----------|
| Story 0.1 | 1小时 | P0 | 开发第1天开始前 |
| Story 0.2 | 1小时 | P0 | 开发第1天开始前 |
| Story 0.3 | 2小时 | P1 | 与Epic 1并行 |
| Story 0.4 | 1小时 | P2 | 开发第2天结束时 |

总计：5小时 (不计入48小时开发时间)

## 技术决策

### 项目架构选择
- **方案1 (推荐)**: 纯前端 + 静态部署
- **方案2 (备选)**: 前端 + Node.js后端

### 技术栈确定
```javascript
const TechStack = {
  前端: "HTML5 + CSS3 + Vanilla JavaScript",
  构建: "无构建工具 或 Vite(如需要)",
  样式: "CSS自定义属性 + CSS Grid/Flexbox",
  状态: "原生JavaScript + localStorage",
  网络: "Fetch API + Promise",
  部署: "GitHub Pages / Vercel"
}
```

### 文件结构设计
```
ai-tavern/
├── index.html              # 入口页面
├── css/
│   ├── main.css            # 主样式
│   ├── components.css      # 组件样式
│   └── tavern-theme.css    # 酒馆主题
├── js/
│   ├── app.js              # 应用主逻辑
│   ├── components/         # UI组件
│   ├── services/           # 业务服务
│   └── utils/              # 工具函数
├── assets/
│   ├── images/             # 图片资源
│   └── fonts/              # 字体文件
├── data/
│   └── roles.json          # 角色配置数据
└── docs/
    └── README.md           # 项目文档
```

## Epic依赖关系
- **Epic 0 → Epic 1**: 项目结构为角色选择界面提供基础
- **Epic 0 → Epic 2**: 基础组件为对话系统提供UI支持
- **Epic 0 → Epic 3**: 服务层为PromptX集成提供封装
- **Epic 0 → Epic 4**: 工具函数为角色推荐提供支持