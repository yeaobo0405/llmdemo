import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  const setUser = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const getUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
    return user.value
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const isLoggedIn = () => {
    return !!user.value
  }

  const hasPermission = (permission) => {
    if (!user.value) return false
    return user.value.permissions?.includes(permission)
  }

  const canAccessData = (dataSensitivity) => {
    if (!user.value) return false

    const accessRules = {
      'public': ['public'],
      'authorized': ['public', 'private']
    }

    const allowedSensitivities = accessRules[user.value.role] || ['public']
    return allowedSensitivities.includes(dataSensitivity)
  }

  return {
    user,
    setUser,
    getUser,
    logout,
    isLoggedIn,
    hasPermission,
    canAccessData
  }
})
