# Story 0.2: API路由设计和实现

## O (Objective)
设计并实现AI酒馆后端的API路由架构，为前后端通信建立标准接口

## E (Environment)
- **基础**: 基于Story 0.1的Express服务器
- **路由模式**: RESTful API设计
- **数据格式**: JSON
- **错误处理**: 统一的错误响应格式

## S (Success Criteria)

### 及格标准
- ✅ 所有API接口定义清晰
- ✅ 请求/响应格式统一
- ✅ 基础的数据验证
- ✅ 错误处理完整

### 优秀标准
- ✅ API文档完整
- ✅ 数据验证全面
- ✅ 响应时间监控
- ✅ API版本控制

## API接口设计

### 1. 对话相关API (/api/chat)
```javascript
// routes/chat.js
const express = require('express');
const router = express.Router();

// 发送消息
router.post('/', async (req, res) => {
  try {
    const { message, roleId = 'aria', conversationId } = req.body;
    
    // TODO: 调用LLM服务
    const response = await llmService.sendMessage(message, roleId, conversationId);
    
    res.json({
      success: true,
      data: {
        message: response.message,
        roleId: response.roleId,
        conversationId: response.conversationId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取对话历史
router.get('/history/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    // TODO: 实现获取历史的逻辑
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### 2. PromptX工具API (/api/promptx)
```javascript
// routes/promptx.js
const express = require('express');
const router = express.Router();

// 激活角色
router.post('/action', async (req, res) => {
  try {
    const { roleId } = req.body;
    
    // TODO: 调用PromptX action工具
    const result = await promptxService.activateRole(roleId);
    
    res.json({
      success: true,
      data: {
        roleId,
        activated: result.success,
        roleInfo: result.roleInfo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 保存记忆
router.post('/remember', async (req, res) => {
  try {
    const { roleId, content, context } = req.body;
    
    // TODO: 调用PromptX remember工具
    const result = await promptxService.saveMemory(roleId, content, context);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 回调记忆
router.get('/recall/:roleId/:query', async (req, res) => {
  try {
    const { roleId, query } = req.params;
    
    // TODO: 调用PromptX recall工具
    const memories = await promptxService.recallMemory(roleId, query);
    
    res.json({ success: true, data: memories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### 3. 角色相关API (/api/roles)
```javascript
// routes/roles.js
const express = require('express');
const router = express.Router();

// 获取所有可用角色
router.get('/', (req, res) => {
  const roles = [
    {
      id: 'aria',
      name: 'Aria',
      description: '温柔体贴的调酒师，善于倾听和安慰',
      avatar: '/assets/images/aria-avatar.png',
      personality: ['温柔', '体贴', '善解人意']
    },
    {
      id: 'morgan',
      name: 'Morgan',
      description: '经验丰富的调酒师，直率且富有智慧',
      avatar: '/assets/images/morgan-avatar.png',
      personality: ['直率', '智慧', '经验丰富']
    }
  ];
  
  res.json({ success: true, data: roles });
});

// 获取角色推荐
router.post('/recommend', async (req, res) => {
  try {
    const { keywords, context } = req.body;
    
    // TODO: 实现角色推荐逻辑
    const recommendations = await roleService.getRecommendations(keywords, context);
    
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

## 数据验证中间件

### 请求数据验证
```javascript
// middleware/validation.js
const validateChatMessage = (req, res, next) => {
  const { message, roleId } = req.body;
  
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: '消息内容不能为空'
    });
  }
  
  if (roleId && !['aria', 'morgan'].includes(roleId)) {
    return res.status(400).json({
      success: false,
      error: '无效的角色ID'
    });
  }
  
  next();
};

const validatePromptXAction = (req, res, next) => {
  const { roleId } = req.body;
  
  if (!roleId || typeof roleId !== 'string') {
    return res.status(400).json({
      success: false,
      error: '角色ID必须提供'
    });
  }
  
  next();
};

module.exports = {
  validateChatMessage,
  validatePromptXAction
};
```

## 统一响应格式

### 响应工具类
```javascript
// utils/response.js
class ApiResponse {
  static success(data, message = '操作成功') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }
  
  static error(message, code = 500, details = null) {
    return {
      success: false,
      error: {
        message,
        code,
        details
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ApiResponse;
```

## API文档示例

### 对话API文档
```markdown
## POST /api/chat
发送消息给AI角色

### 请求参数
- message (string, required): 用户消息
- roleId (string, optional): 角色ID，默认'aria'
- conversationId (string, optional): 对话ID

### 响应示例
{
  "success": true,
  "data": {
    "message": "AI的回复内容",
    "roleId": "aria",
    "conversationId": "uuid-string",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 验收标准
1. 所有API接口可正常访问
2. 数据验证正确拦截无效请求
3. 错误响应格式统一
4. API响应时间合理
5. 接口文档完整准确

## 后续衔接
为Epic2的LLM集成和Epic3的PromptX集成提供标准的API接口基础。