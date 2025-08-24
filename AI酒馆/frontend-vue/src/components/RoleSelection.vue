<template>
  <div class="role-selection">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
        选择你的AI助手
      </h2>
      <p class="text-white/70 text-lg">智能对话，专业服务</p>
    </div>

    <div v-if="loading" class="text-center">
      <div class="text-white/70 text-lg">正在加载角色...</div>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="role in roles" 
        :key="role.id"
        @click="selectRole(role)"
        class="role-card group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 hover:-translate-y-2"
      >
        <div class="text-center">
          <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{{ role.avatar }}</div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">{{ role.name }}</h3>
          <p class="text-white/70 text-base mb-6 leading-relaxed">{{ role.description }}</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <span 
              v-for="skill in role.skills" 
              :key="skill"
              class="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm rounded-full border border-blue-400/30 backdrop-blur-sm"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'RoleSelection',
  emits: ['role-selected'],
  setup(props, { emit }) {
    const roles = ref([])
    const loading = ref(true)

    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/roles')
        if (!response.ok) {
          throw new Error('Failed to fetch roles')
        }
        const data = await response.json()
        roles.value = data.data
      } catch (error) {
        console.error('Error fetching roles:', error)
        // 降级到默认角色
        roles.value = [
          {
            id: 'assistant',
            name: 'AI助手',
            avatar: '🤖',
            description: '通用AI助手，可以帮助处理各种问题',
            skills: ['问答', '任务处理']
          }
        ]
      } finally {
        loading.value = false
      }
    }

    const selectRole = (role) => {
      emit('role-selected', role)
    }

    onMounted(() => {
      fetchRoles()
    })

    return {
      roles,
      loading,
      selectRole
    }
  }
}
</script>