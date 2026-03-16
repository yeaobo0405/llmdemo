<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>涉外法治大模型智能服务平台</h1>
          <p>Foreign Rule of Law Large Model Intelligent Service Platform</p>
        </div>

        <div class="login-tabs">
          <button
            class="tab-btn"
            :class="{ active: loginMode === 'account' }"
            @click="loginMode = 'account'"
          >
            账号登录
          </button>
          <button
            class="tab-btn"
            :class="{ active: loginMode === 'demo' }"
            @click="loginMode = 'demo'"
          >
            演示账号
          </button>
        </div>

        <div v-if="loginMode === 'account'" class="login-form">
          <div class="form-group">
            <label>用户名</label>
            <input
              v-model="loginForm.username"
              type="text"
              class="input"
              placeholder="请输入用户名"
            >
          </div>
          <div class="form-group">
            <label>密码</label>
            <input
              v-model="loginForm.password"
              type="password"
              class="input"
              placeholder="请输入密码"
            >
          </div>
          <button class="btn btn-primary login-btn" @click="handleLogin">
            登录
          </button>
        </div>

        <div v-if="loginMode === 'demo'" class="demo-accounts">
          <h3>选择演示账号</h3>
          <div class="account-list">
            <div
              v-for="account in demoAccounts"
              :key="account.id"
              class="account-card"
              :class="{ active: selectedAccount?.id === account.id }"
              @click="selectAccount(account)"
            >
              <div class="account-icon">{{ account.icon }}</div>
              <div class="account-info">
                <h4 class="account-name">{{ account.name }}</h4>
                <p class="account-role">{{ account.roleName }}</p>
                <p class="account-desc">{{ account.description }}</p>
                <div class="account-permissions">
                  <span
                    v-for="(perm, index) in account.permissions"
                    :key="index"
                    class="permission-tag"
                  >
                    {{ perm }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button class="btn btn-primary login-btn" @click="handleDemoLogin" :disabled="!selectedAccount">
            以此账号登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginMode = ref('demo')
const loginForm = ref({
  username: '',
  password: ''
})
const selectedAccount = ref(null)

const demoAccounts = ref([
  {
    id: 1,
    name: '普通用户',
    role: 'public',
    roleName: '普通用户',
    icon: '👤',
    description: '仅可访问公开的开源数据',
    permissions: ['开源数据'],
    color: '#6c757d'
  },
  {
    id: 2,
    name: '授权用户',
    role: 'authorized',
    roleName: '授权用户',
    icon: '🔐',
    description: '可访问开源数据和隐私数据',
    permissions: ['开源数据', '隐私数据'],
    color: '#28a745'
  }
])

const selectAccount = (account) => {
  selectedAccount.value = account
}

const handleLogin = () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert('请输入用户名和密码')
    return
  }
  alert('账号登录功能开发中，请使用演示账号')
}

const handleDemoLogin = () => {
  if (!selectedAccount.value) {
    alert('请选择演示账号')
    return
  }

  userStore.setUser({
    id: selectedAccount.value.id,
    name: selectedAccount.value.name,
    role: selectedAccount.value.role,
    roleName: selectedAccount.value.roleName,
    permissions: selectedAccount.value.permissions,
    icon: selectedAccount.value.icon
  })

  router.push('/')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 900px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: #999;
}

.login-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 2px solid #e0e0e0;
}

.tab-btn {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #667eea;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.login-btn {
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
}

.demo-accounts h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.account-list {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.account-card {
  flex: 1;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.account-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.account-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
}

.account-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.account-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.account-role {
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
  margin-bottom: 8px;
}

.account-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.account-permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: #f0f0f0;
  color: #666;
}

@media (max-width: 768px) {
  .account-list {
    grid-template-columns: 1fr;
  }
}
</style>
