<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
    <!-- 顶部导航 -->
    <header class="bg-white/10 backdrop-blur-md border-b border-white/20 p-6 shadow-xl">
      <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
          🤖 AI智能助手
        </h1>
        <div class="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
          智能对话系统
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="container mx-auto p-6">
      <!-- 加载状态 -->
      <div v-if="appState === 'LOADING'" class="flex flex-col items-center justify-center min-h-[60vh]">
        <div class="relative">
          <div class="animate-spin rounded-full h-20 w-20 border-4 border-white/20 border-t-blue-400 mb-6"></div>
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        </div>
        <p class="text-xl text-white/80 font-medium">正在启动AI助手...</p>
        <p class="text-sm text-white/60 mt-2">请稍候片刻</p>
      </div>

      <!-- 角色选择界面 -->
      <RoleSelection 
        v-else-if="appState === 'ROLE_SELECTION'"
        @role-selected="selectRole"
      />

      <!-- 聊天界面 -->
      <ChatInterface 
        v-else-if="appState === 'CHAT_ACTIVE'"
        :selected-role="selectedRole"
        @back-to-roles="backToRoles"
      />
    </main>

    <!-- 底部 -->
    <footer class="bg-white/5 backdrop-blur-sm border-t border-white/10 p-6 text-center">
      <p class="text-sm text-white/60">AI智能助手 | 基于现代化技术构建</p>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import RoleSelection from './components/RoleSelection.vue'
import ChatInterface from './components/ChatInterface.vue'

export default {
  name: 'App',
  components: {
    RoleSelection,
    ChatInterface
  },
  setup() {
    const appState = ref('LOADING')
    const selectedRole = ref(null)

    const selectRole = (role) => {
      selectedRole.value = role
      appState.value = 'CHAT_ACTIVE'
    }

    const backToRoles = () => {
      selectedRole.value = null
      appState.value = 'ROLE_SELECTION'
    }

    onMounted(() => {
      // 模拟初始化过程
      setTimeout(() => {
        appState.value = 'ROLE_SELECTION'
      }, 1000)
    })

    return {
      appState,
      selectedRole,
      selectRole,
      backToRoles
    }
  }
}
</script>