// AI酒馆 - 角色管理模块

// 预定义角色数据
const ROLES_DATA = {
    bartender: {
        id: 'bartender',
        name: '酒保老李',
        avatar: '🍺',
        description: '经验丰富的酒保，善于倾听和调酒',
        personality: '温和、耐心、善解人意',
        specialties: ['调酒技巧', '人生感悟', '倾听烦恼'],
        greeting: '欢迎来到AI酒馆！我是老李，今晚想喝点什么？',
        promptxRole: 'bartender',
        color: '#8B4513'
    },
    storyteller: {
        id: 'storyteller',
        name: '说书人',
        avatar: '📚',
        description: '博学的说书人，知晓古今中外的故事',
        personality: '博学、幽默、富有想象力',
        specialties: ['历史故事', '神话传说', '人生哲理'],
        greeting: '坐下来，听我讲一个故事吧...',
        promptxRole: 'storyteller',
        color: '#4A4A4A'
    },
    musician: {
        id: 'musician',
        name: '流浪歌手',
        avatar: '🎵',
        description: '才华横溢的音乐家，用音乐治愈心灵',
        personality: '浪漫、感性、富有艺术气息',
        specialties: ['音乐创作', '情感表达', '艺术鉴赏'],
        greeting: '音乐是心灵的语言，今晚想听什么曲子？',
        promptxRole: 'musician',
        color: '#9932CC'
    },
    philosopher: {
        id: 'philosopher',
        name: '哲学家',
        avatar: '🤔',
        description: '深邃的思想家，探索生命的意义',
        personality: '深沉、理性、富有洞察力',
        specialties: ['人生哲学', '逻辑思辨', '智慧启发'],
        greeting: '生命的意义在于思考，让我们一起探索真理...',
        promptxRole: 'philosopher',
        color: '#2F4F4F'
    }
};

// 角色管理类
class RoleManager {
    constructor() {
        this.roles = { ...ROLES_DATA };
        this.currentRole = null;
        this.roleHistory = [];
    }
    
    // 获取所有角色
    getAllRoles() {
        return Object.values(this.roles);
    }
    
    // 根据ID获取角色
    getRoleById(roleId) {
        return this.roles[roleId] || null;
    }
    
    // 设置当前角色
    setCurrentRole(roleId) {
        const role = this.getRoleById(roleId);
        if (!role) {
            console.error(`角色不存在: ${roleId}`);
            return false;
        }
        
        // 记录角色切换历史
        if (this.currentRole) {
            this.roleHistory.push({
                role: this.currentRole,
                timestamp: new Date().toISOString()
            });
        }
        
        this.currentRole = role;
        AppState.currentRole = role;
        
        console.log(`切换到角色: ${role.name}`);
        return true;
    }
    
    // 获取当前角色
    getCurrentRole() {
        return this.currentRole;
    }
    
    // 清除当前角色
    clearCurrentRole() {
        this.currentRole = null;
        AppState.currentRole = null;
    }
    
    // 获取角色切换历史
    getRoleHistory() {
        return this.roleHistory;
    }
    
    // 添加自定义角色
    addCustomRole(roleData) {
        if (!roleData.id || this.roles[roleData.id]) {
            console.error('角色ID无效或已存在');
            return false;
        }
        
        const role = {
            id: roleData.id,
            name: roleData.name || '未命名角色',
            avatar: roleData.avatar || '🎭',
            description: roleData.description || '自定义角色',
            personality: roleData.personality || '待定义',
            specialties: roleData.specialties || [],
            greeting: roleData.greeting || '你好！',
            promptxRole: roleData.promptxRole || roleData.id,
            color: roleData.color || '#666666',
            isCustom: true
        };
        
        this.roles[role.id] = role;
        console.log(`添加自定义角色: ${role.name}`);
        return true;
    }
    
    // 删除自定义角色
    removeCustomRole(roleId) {
        const role = this.roles[roleId];
        if (!role || !role.isCustom) {
            console.error('只能删除自定义角色');
            return false;
        }
        
        delete this.roles[roleId];
        
        // 如果删除的是当前角色，清除当前角色
        if (this.currentRole && this.currentRole.id === roleId) {
            this.clearCurrentRole();
        }
        
        console.log(`删除自定义角色: ${role.name}`);
        return true;
    }
}

// 创建全局角色管理器实例
const roleManager = new RoleManager();

// 初始化角色选择界面
function initRoles() {
    const roleGrid = document.querySelector('.role-grid');
    if (!roleGrid) {
        console.warn('角色选择容器不存在');
        return;
    }
    
    // 清空现有内容
    roleGrid.innerHTML = '';
    
    // 渲染所有角色
    const roles = roleManager.getAllRoles();
    roles.forEach(role => {
        const roleCard = createRoleCard(role);
        roleGrid.appendChild(roleCard);
    });
    
    console.log(`初始化了 ${roles.length} 个角色`);
}

// 创建角色卡片
function createRoleCard(role) {
    const card = document.createElement('div');
    card.className = 'role-card';
    card.dataset.roleId = role.id;
    
    card.innerHTML = `
        <div class="role-avatar" style="background-color: ${role.color}20; border-color: ${role.color}">
            ${role.avatar}
        </div>
        <div class="role-info">
            <h3 class="role-name">${role.name}</h3>
            <p class="role-description">${role.description}</p>
            <div class="role-specialties">
                ${role.specialties.map(specialty => 
                    `<span class="specialty-tag">${specialty}</span>`
                ).join('')}
            </div>
        </div>
        <div class="role-actions">
            <button class="select-role-btn" onclick="selectRole('${role.id}')">
                选择角色
            </button>
        </div>
    `;
    
    // 添加悬停效果
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = role.color;
        card.style.transform = 'translateY(-2px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.borderColor = '#ddd';
        card.style.transform = 'translateY(0)';
    });
    
    return card;
}

// 选择角色
function selectRole(roleId) {
    console.log(`选择角色: ${roleId}`);
    
    const success = roleManager.setCurrentRole(roleId);
    if (!success) {
        showError('角色选择失败');
        return;
    }
    
    const role = roleManager.getCurrentRole();
    
    // 显示选择成功提示
    showSuccess(`已选择角色: ${role.name}`);
    
    // 保存到本地存储
    Storage.save('currentRole', role);
    
    // 延迟切换到对话界面，让用户看到选择效果
    setTimeout(() => {
        showChatInterface();
        
        // 发送欢迎消息
        addMessage({
            type: 'ai',
            content: role.greeting,
            role: role,
            timestamp: new Date().toISOString()
        });
    }, 500);
}

// 切换角色（在对话中）
function switchRole(roleId) {
    if (!roleId || roleId === roleManager.getCurrentRole()?.id) {
        return;
    }
    
    const oldRole = roleManager.getCurrentRole();
    const success = roleManager.setCurrentRole(roleId);
    
    if (!success) {
        showError('角色切换失败');
        return;
    }
    
    const newRole = roleManager.getCurrentRole();
    
    // 更新界面
    updateChatHeader();
    
    // 添加角色切换消息
    addMessage({
        type: 'system',
        content: `${oldRole.name} 离开了，${newRole.name} 来到了你身边...`,
        timestamp: new Date().toISOString()
    });
    
    // 新角色的欢迎消息
    setTimeout(() => {
        addMessage({
            type: 'ai',
            content: newRole.greeting,
            role: newRole,
            timestamp: new Date().toISOString()
        });
    }, 1000);
    
    showSuccess(`已切换到: ${newRole.name}`);
}

// 获取角色推荐
function getRoleRecommendations(context = '') {
    const allRoles = roleManager.getAllRoles();
    const currentRole = roleManager.getCurrentRole();
    
    // 过滤掉当前角色
    const availableRoles = allRoles.filter(role => 
        !currentRole || role.id !== currentRole.id
    );
    
    // 简单的推荐逻辑（可以根据上下文优化）
    if (context.includes('故事') || context.includes('历史')) {
        return availableRoles.filter(role => role.id === 'storyteller');
    }
    
    if (context.includes('音乐') || context.includes('歌')) {
        return availableRoles.filter(role => role.id === 'musician');
    }
    
    if (context.includes('哲学') || context.includes('思考')) {
        return availableRoles.filter(role => role.id === 'philosopher');
    }
    
    // 默认推荐前2个不同的角色
    return availableRoles.slice(0, 2);
}

// 创建角色推荐卡片
function createRoleRecommendationCard(role) {
    const card = document.createElement('div');
    card.className = 'role-recommendation';
    
    card.innerHTML = `
        <div class="rec-avatar">${role.avatar}</div>
        <div class="rec-info">
            <span class="rec-name">${role.name}</span>
            <span class="rec-desc">${role.description}</span>
        </div>
        <button class="rec-switch-btn" onclick="switchRole('${role.id}')">
            切换
        </button>
    `;
    
    return card;
}

// 恢复上次选择的角色
function restoreLastRole() {
    const savedRole = Storage.load('currentRole');
    if (savedRole && savedRole.id) {
        const success = roleManager.setCurrentRole(savedRole.id);
        if (success) {
            console.log(`恢复上次选择的角色: ${savedRole.name}`);
            return true;
        }
    }
    return false;
}

// 导出函数供全局使用
window.roleManager = roleManager;
window.initRoles = initRoles;
window.selectRole = selectRole;
window.switchRole = switchRole;
window.getRoleRecommendations = getRoleRecommendations;
window.createRoleRecommendationCard = createRoleRecommendationCard;
window.restoreLastRole = restoreLastRole;

console.log('🎭 角色管理模块加载完成');