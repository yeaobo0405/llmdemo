<template>
  <header class="header">
    <div class="container header-content">
      <div class="logo">
        <h1>涉外法治大模型智能服务平台</h1>
        <p class="subtitle">Foreign Rule of Law Large Model Intelligent Service Platform</p>
      </div>
      <nav class="nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </nav>
      <div v-if="userStore.user" class="user-info">
        <div class="user-avatar">{{ userStore.user.icon }}</div>
        <div class="user-details">
          <div class="user-name">{{ userStore.user.name }}</div>
          <div class="user-role">{{ userStore.user.roleName }}</div>
        </div>
        <button class="logout-btn" @click="handleLogout">
          退出
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

userStore.getUser()

const navItems = ref([
  { path: '/consultation', name: '智能咨询', icon: '💬' },
  { path: '/regulations', name: '法规检索', icon: '📋' },
  { path: '/cases', name: '案例检索', icon: '⚖️' },
  { path: '/knowledge', name: '知识库', icon: '📚' },
  { path: '/monitor', name: '动态监测', icon: '📊' },
  { path: '/document', name: '文书处理', icon: '📄' },
  { path: '/contract', name: '合同审查', icon: '📋' }
])

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.container {
  max-width: 100%;
  padding: 0 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
}

.logo {
  flex-shrink: 0;
  text-align: left;
  min-width: 350px;
}

.nav {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  flex: 1;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  flex-shrink: 0;
}

.subtitle {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 300;
}

.logo h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-item.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.nav-icon {
  font-size: 18px;
}

.nav-text {
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  white-space: nowrap;
}

.user-avatar {
  font-size: 32px;
  background: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 60px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
