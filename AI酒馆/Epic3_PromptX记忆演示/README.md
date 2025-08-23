# Epic 3: PromptX记忆演示

## Epic概述 (黑客松版)

### O (Objective)
使用PromptX的remember和recall工具，演示AI记忆能力

### E (Environment)
- **技术架构**: LangChain Memory系统 + PromptX MCP工具 (双重记忆)
- **LangChain记忆**: BufferMemory, ConversationSummaryMemory (内置框架)
- **PromptX工具**: promptx_remember, promptx_recall, promptx_action (长期记忆)
- **集成方式**: LangChain自动管理短期记忆，PromptX处理长期记忆
- **记忆策略**: 会话内用LangChain，跨会话用PromptX
- **演示场景**: 双重记忆展示 - 会话记忆 + 长期记忆
- **技术优势**: LangChain处理复杂性，开发效率提升80%

### S (Success Criteria)
**及格标准**：
- ✅ 对话中能自动调用promptx_remember保存信息
- ✅ 新会话能调用promptx_recall获取历史记忆
- ✅ AI能自然地提及之前的对话内容

**优秀标准**：
- ✅ 记忆回调自然贴切，不显突兀
- ✅ 记忆内容准确相关
- ✅ 演示效果明显，观众能感受到记忆能力

## Story列表 (简化版)

- [Story 3.1: 记忆保存集成](./Story3.1_记忆保存集成/) - 集成promptx_remember工具
- [Story 3.2: 记忆回调演示](./Story3.2_记忆回调演示/) - 集成promptx_recall工具

## 黑客松关键简化

### ✅ 保留核心价值
- PromptX记忆能力的直观演示
- 用户能明显感受到AI"记住"了对话

### ❌ 砍掉复杂功能  
- 记忆管理界面
- 复杂的记忆分类和权重
- 记忆编辑删除功能

## 演示效果设计

### 第一次对话示例
```
用户：今天工作压力很大，项目deadline快到了
AI(Aria)：我理解你的压力，项目截止日期确实会让人焦虑...
[系统自动调用promptx_remember保存: "用户工作压力大，项目deadline临近"]
```

### 回访对话示例  
```
用户：[重新进入酒馆]
AI(Aria)：欢迎回来！上次你说项目deadline让你压力很大，现在情况怎么样了？
[系统自动调用promptx_recall获取相关记忆]
```

## Epic依赖关系
- 依赖Epic 2的对话系统
- 为Epic 4的角色推荐提供历史上下文