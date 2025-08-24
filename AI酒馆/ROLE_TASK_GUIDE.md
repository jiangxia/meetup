# AI酒馆角色任务分配指南

## 概述

本指南说明如何使用PromptX角色系统来分配和执行AI酒馆项目的开发任务。每个角色都有明确的任务范围和职责分工。

## 角色与任务映射

### 🔧 ai-tavern-backend (后端开发专家)
**负责目录**: `AI_Tavern_Tasks/Backend_Tasks/`

**主要职责**:
- Epic0_后端基础设施: Node.js + Express项目搭建
- Epic1_基础API: 实现核心对话API接口
- Epic2_AI服务集成: LangChain集成和AI对话处理
- Epic3_PromptX集成: MCP协议连接和记忆系统

**激活方式**: `promptx_action("ai-tavern-backend")`

### 🎨 ai-tavern-frontend (前端开发专家)
**负责目录**: `AI_Tavern_Tasks/Frontend_Tasks/`

**主要职责**:
- Epic0_前端基础设施: 项目结构和TailwindCSS配置
- Epic1_角色选择界面: 酒馆风格的角色选择UI
- Epic2_对话界面: 实时对话和流式响应界面

**激活方式**: `promptx_action("ai-tavern-frontend")`

### 🔗 ai-tavern-integrator (集成协调专家)
**负责目录**: `AI_Tavern_Tasks/Fullstack_Tasks/` + 跨域协调

**主要职责**:
- Epic3_记忆演示: 端到端记忆功能演示
- API接口规范制定和维护
- 前后端集成测试和调试
- 演示环境搭建和验证

**激活方式**: `promptx_action("ai-tavern-integrator")`

## 使用流程

### 1. 激活角色
```bash
# 激活后端开发角色
prompx_action("ai-tavern-backend")

# 激活前端开发角色
prompx_action("ai-tavern-frontend")

# 激活集成协调角色
prompx_action("ai-tavern-integrator")
```

### 2. 查看任务
每个角色激活后，会自动了解自己的任务范围。你也可以手动查看对应的任务目录：
- 后端任务: `AI_Tavern_Tasks/Backend_Tasks/`
- 前端任务: `AI_Tavern_Tasks/Frontend_Tasks/`
- 全栈任务: `AI_Tavern_Tasks/Fullstack_Tasks/`

### 3. 执行任务
按照优先级（P0 > P1 > P2）和Epic顺序执行任务：
1. 先完成Epic0（基础设施）
2. 再完成Epic1和Epic2（核心功能）
3. 最后完成Epic3（高级功能和集成）

### 4. 协调配合
- 前后端开发需要保持API接口同步
- 遇到跨域问题时，联系集成协调专家
- 定期更新任务状态和完成情况

## 任务优先级说明

- **P0 (最高优先级)**: MVP核心功能，必须在第一天完成
- **P1 (高优先级)**: 重要功能，第二天完成
- **P2 (中优先级)**: 增强功能，时间允许时完成

## 注意事项

1. **专注核心**: 遵循PRD中"专注核心"的原则，避免功能复杂化
2. **MVP优先**: 优先实现MVP范围内的功能
3. **及时沟通**: 遇到阻塞问题及时与其他角色协调
4. **文档更新**: 完成任务后及时更新状态和文档

## 快速开始

想要开始开发？选择你的角色：

```bash
# 我要做后端开发
prompx_action("ai-tavern-backend")

# 我要做前端开发  
prompx_action("ai-tavern-frontend")

# 我要做集成协调
prompx_action("ai-tavern-integrator")
```

激活角色后，AI助手将以对应的专家身份为你提供专业的开发指导和任务执行支持。