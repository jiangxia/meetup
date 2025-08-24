<template>
  <div class="chat-interface flex gap-6">
    <!-- 主聊天区域 -->
    <div class="flex-1">
      <!-- 聊天头部 -->
      <div class="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl mb-8 shadow-xl">
        <div class="flex items-center gap-4">
          <div class="text-4xl animate-pulse">{{ selectedRole.avatar }}</div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{{ selectedRole.name }}</h3>
            <p class="text-white/70 text-base mt-1">{{ selectedRole.description }}</p>
          </div>
          <button 
            @click="toggleMemoryPanel"
            class="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-xl border border-purple-400/30 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm"
          >
            🧠 记忆 ({{ memories.length }})
          </button>
        </div>
        <button 
          @click="$emit('back-to-roles')"
          class="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-xl border border-blue-400/30 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 backdrop-blur-sm"
        >
          ← 返回选择
        </button>
      </div>

    <!-- 聊天消息区域 -->
    <div class="chat-messages bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-96 overflow-y-auto mb-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      <div v-if="messages.length === 0" class="text-center text-white/60 mt-20">
        <div class="text-4xl mb-4">💬</div>
        <p class="text-lg">开始与 {{ selectedRole.name }} 对话吧！</p>
        <p class="text-sm mt-2 text-white/40">输入您的问题，我会尽力帮助您</p>
      </div>
      
      <div v-for="message in messages" :key="message.id" class="message mb-6">
        <div :class="['flex', message.type === 'user' ? 'justify-end' : 'justify-start']">
          <div v-if="message.type === 'user'" class="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-2xl rounded-br-md max-w-xs shadow-lg">
            <div class="flex items-start gap-2">
              <div class="text-sm">👤</div>
              <div class="flex-1">
                <p class="text-sm">{{ message.content }}</p>
                <div class="text-xs opacity-60 mt-1">{{ formatTime(message.timestamp) }}</div>
              </div>
            </div>
          </div>
          <div v-else class="bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-2xl rounded-bl-md max-w-xs shadow-lg">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">{{ selectedRole.avatar }}</span>
              <span class="text-sm text-blue-300 font-medium">{{ selectedRole.name }}</span>
            </div>
            <div class="flex items-start gap-2">
              <div class="flex-1">
                <p class="text-sm">{{ message.content }}</p>
                <div class="flex items-center justify-between mt-2">
                  <div class="text-xs opacity-60">{{ formatTime(message.timestamp) }}</div>
                  <button 
                    @click="saveAsMemory(message)"
                    class="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-200"
                    title="保存为记忆"
                  >
                    🧠 记忆
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input 
            v-model="newMessage"
            type="text" 
            placeholder="输入你的消息..."
            class="flex-1 px-4 py-2 bg-tavern-warm bg-opacity-20 border border-tavern-gold border-opacity-30 rounded-lg text-tavern-cream placeholder-tavern-cream placeholder-opacity-60 focus:outline-none focus:border-opacity-60"
          >
          <button 
            type="submit"
            :disabled="!newMessage.trim()"
            class="px-6 py-2 bg-tavern-gold bg-opacity-80 text-tavern-dark rounded-lg hover:bg-opacity-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </form>
      </div>
    </div>

    <!-- 记忆面板 -->
    <div v-if="showMemoryPanel" class="w-80 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-fit">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white">🧠 {{ selectedRole.name }} 的记忆</h3>
        <button 
          @click="toggleMemoryPanel"
          class="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div v-if="loadingMemories" class="text-center text-white/60 py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-purple-400 mx-auto mb-2"></div>
        <p class="text-sm">加载记忆中...</p>
      </div>
      
      <div v-else-if="memories.length === 0" class="text-center text-white/60 py-8">
        <div class="text-3xl mb-2">🤔</div>
        <p class="text-sm">还没有保存任何记忆</p>
        <p class="text-xs mt-1 text-white/40">在对话中点击"记忆"按钮保存重要内容</p>
      </div>
      
      <div v-else class="space-y-3 max-h-96 overflow-y-auto">
        <div 
          v-for="memory in memories" 
          :key="memory.id"
          class="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
        >
          <p class="text-sm text-white/90 mb-2">{{ memory.content }}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-white/50">{{ formatTime(new Date(memory.timestamp)) }}</span>
            <button 
              @click="deleteMemory(memory.id)"
              class="text-xs text-red-400 hover:text-red-300 transition-colors"
              title="删除记忆"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t border-white/10">
        <button 
          @click="clearAllMemories"
          class="w-full px-3 py-2 text-xs bg-red-500/20 text-red-300 rounded border border-red-400/30 hover:bg-red-500/30 transition-all duration-200"
        >
          清空所有记忆
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted } from 'vue'

export default {
  name: 'ChatInterface',
  props: {
    selectedRole: {
      type: Object,
      required: true
    }
  },
  emits: ['back-to-roles'],
  setup(props) {
    const messages = ref([])
    const newMessage = ref('')
    const memories = ref([])
    const showMemoryPanel = ref(false)
    const loadingMemories = ref(false)
    
    // 生成持久的用户ID（基于角色）
    const userId = `user_${props.selectedRole.id}`

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return

      // 添加用户消息
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: newMessage.value,
        timestamp: new Date()
      }
      messages.value.push(userMessage)

      const userInput = newMessage.value
      newMessage.value = ''

      try {
        // 调用后端API获取AI回复
        const response = await fetch('http://localhost:3001/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userInput,
            roleId: props.selectedRole.id,
            sessionId: 'default'
          })
        })

        if (!response.ok) {
          throw new Error('Failed to get AI response')
        }

        const data = await response.json()
        
        if (data.success && data.data && data.data.message) {
          const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: data.data.message,
            timestamp: new Date()
          }
          messages.value.push(aiMessage)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Error sending message:', error)
        // 显示错误信息而不是模拟回复
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: `抱歉，我遇到了一些问题：${error.message}。请稍后再试或检查网络连接。`,
          timestamp: new Date()
        }
        messages.value.push(errorMessage)
      }
    }

    const generateAIResponse = (input, role) => {
      const responses = {
        'assistant': `作为AI助手，我理解你的问题："${input}"。让我为你提供帮助...`,
        'developer': `从技术角度来看，关于"${input}"这个问题，我建议...`,
        'designer': `从设计的角度，"${input}"让我想到了用户体验的重要性...`,
        'analyst': `基于数据分析的视角，"${input}"这个话题值得深入探讨...`,
        'writer': `作为内容创作者，"${input}"激发了我的创作灵感...`,
        'consultant': `从商业角度分析，"${input}"涉及到战略层面的考虑...`
      }
      return responses[role.id] || `感谢你的问题："${input}"，让我思考一下如何回答...`
    }

    const formatTime = (timestamp) => {
      return timestamp.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    // 记忆相关功能
    const toggleMemoryPanel = () => {
      showMemoryPanel.value = !showMemoryPanel.value
      if (showMemoryPanel.value) {
        loadMemories()
      }
    }
    
    const loadMemories = async () => {
      loadingMemories.value = true
      try {
        const response = await fetch(`http://localhost:3001/api/memory/user/${userId}?limit=20`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            memories.value = data.data.memories || []
          }
        }
      } catch (error) {
        console.error('Error loading memories:', error)
      } finally {
        loadingMemories.value = false
      }
    }
    
    const saveAsMemory = async (message) => {
      try {
        const response = await fetch('http://localhost:3001/api/memory/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            sessionId: 'default',
            memory: message.content
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // 添加到本地记忆列表
            memories.value.push({
              id: data.data.memoryId,
              content: message.content,
              timestamp: new Date().toISOString()
            })
            
            // 显示成功提示
            console.log('记忆保存成功')
          }
        }
      } catch (error) {
        console.error('Error saving memory:', error)
      }
    }
    
    const deleteMemory = async (memoryId) => {
      try {
        const response = await fetch(`http://localhost:3001/api/memory/${memoryId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId
          })
        })
        
        if (response.ok) {
          // 从本地列表中移除
          memories.value = memories.value.filter(m => m.id !== memoryId)
        }
      } catch (error) {
        console.error('Error deleting memory:', error)
      }
    }
    
    const clearAllMemories = async () => {
      if (confirm('确定要清空所有记忆吗？此操作不可恢复。')) {
        try {
          const response = await fetch(`http://localhost:3001/api/memory/user/${userId}/all`, {
            method: 'DELETE'
          })
          
          if (response.ok) {
            memories.value = []
          }
        } catch (error) {
          console.error('Error clearing memories:', error)
        }
      }
    }
    
    // 组件挂载时加载记忆
    onMounted(() => {
      loadMemories()
    })

    return {
      messages,
      newMessage,
      memories,
      showMemoryPanel,
      loadingMemories,
      sendMessage,
      formatTime,
      toggleMemoryPanel,
      saveAsMemory,
      deleteMemory,
      clearAllMemories
    }
  }
}
</script>