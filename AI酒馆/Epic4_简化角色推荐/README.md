# Epic 4: 简化角色推荐

## Epic概述 (黑客松版)

### O (Objective)
基于对话关键词简单匹配，推荐合适的PromptX角色，展示生态价值

### E (Environment)
- **推荐算法**: 简单关键词匹配，无复杂NLP
- **角色库**: hardcode几个核心PromptX角色
- **触发方式**: 对话3-5轮后自动推荐，或用户主动请求
- **展示方式**: 界面卡片展示，无需导出功能
- **黑客松简化**: 规则驱动，避免复杂算法

### S (Success Criteria)
**及格标准**：
- ✅ 能根据对话内容推荐相关角色
- ✅ 推荐内容包含角色名称、专长、使用建议
- ✅ 推荐界面清晰易懂

**优秀标准**：
- ✅ 推荐精准度合理，符合基本逻辑
- ✅ 推荐界面设计美观
- ✅ 推荐触发时机合适

## Story列表 (极简版)

- [Story 4.1: 关键词匹配推荐](./Story4.1_关键词匹配/) - 简单规则匹配算法
- [Story 4.2: 推荐结果展示](./Story4.2_推荐展示/) - 界面展示推荐内容

## 黑客松关键简化

### ✅ 保留核心价值
- 展示PromptX角色生态的丰富性
- 为用户提供明确的下一步行动建议

### ❌ 砍掉复杂功能
- 智能算法和语义分析
- 机器学习推荐
- PDF/PNG导出功能
- 推荐质量评估和优化

## hardcode角色库

### 预设PromptX角色 (5个核心角色)
```javascript
const PROMPTX_ROLES = {
  'sean': {
    name: 'Sean',
    title: '产品决策专家',
    expertise: ['产品战略', '用户洞察', '团队管理'],
    keywords: ['产品', '决策', '管理', '战略', '用户', '团队'],
    description: '帮你分析产品问题，制定战略决策',
    scenarios: ['产品困扰', '决策咨询', '团队管理']
  },
  'luban': {
    name: '鲁班',
    title: 'PromptX工具开发大师',
    expertise: ['工具开发', '技术架构', '系统设计'],
    keywords: ['开发', '技术', '工具', '编程', '架构', '系统'],
    description: '专注PromptX工具开发和技术实现',
    scenarios: ['技术开发', '工具创建', '架构设计']
  },
  'nuwa': {
    name: '女娲',
    title: 'AI角色创造专家',
    expertise: ['角色设计', '创意思维', '内容创作'],
    keywords: ['创意', '设计', '角色', '创作', '想法', '灵感'],
    description: '帮你创建个性化的AI角色和创意内容',
    scenarios: ['角色创建', '创意工作', '内容创作']
  },
  'noface': {
    name: '无面',
    title: '万能学习助手',
    expertise: ['学习指导', '知识整理', '技能提升'],
    keywords: ['学习', '技能', '提升', '知识', '教育', '成长'],
    description: '可转换为任何领域专家，提供学习指导',
    scenarios: ['技能学习', '知识获取', '个人发展']
  },
  'assistant': {
    name: 'Assistant',
    title: '通用AI助手',
    expertise: ['基础对话', '任务处理', '信息查询'],
    keywords: ['帮助', '咨询', '问题', '任务', '信息'],
    description: '提供基础的对话和任务处理服务',
    scenarios: ['日常咨询', '基础任务', '信息查询']
  }
};
```

## 简单匹配规则

### 关键词匹配算法 (极简版)
```javascript
function matchRoles(conversationText) {
  const text = conversationText.toLowerCase();
  const matches = [];
  
  for (const [roleId, role] of Object.entries(PROMPTX_ROLES)) {
    let score = 0;
    
    // 关键词匹配计分
    role.keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1;
      }
    });
    
    // 有匹配才添加
    if (score > 0) {
      matches.push({
        role: role,
        score: score,
        reason: generateReason(role, text)
      });
    }
  }
  
  // 按分数排序，取前3个
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
```

## 演示效果设计

### 推荐触发示例
```
对话内容: "最近在做一个产品项目，遇到用户体验的问题，不知道该怎么决策"
匹配结果:
1. Sean (产品决策专家) - 匹配词: "产品"、"决策" 
2. Assistant (通用助手) - 匹配词: "问题"
3. Nuwa (创造专家) - 匹配词: "用户"

推荐展示:
🎯 为你推荐合适的专家：
[Sean卡片] - 擅长产品战略和用户洞察，可以帮你分析用户体验问题并制定决策方案
[Assistant卡片] - 提供基础咨询服务，解答各类问题  
[Nuwa卡片] - 创意思维专家，能从用户角度提供创新解决方案
```

## Epic依赖关系
- 依赖Epic 2的对话系统获取对话内容
- 依赖Epic 3的记忆系统获取历史上下文
- 为整体演示提供价值闭环