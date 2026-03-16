import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Consultation from '@/views/Consultation.vue'
import Search from '@/views/Search.vue'
import Regulations from '@/views/Regulations.vue'
import Cases from '@/views/Cases.vue'
import Monitor from '@/views/Monitor.vue'
import Document from '@/views/Document.vue'
import Contract from '@/views/Contract.vue'
import Knowledge from '@/views/Knowledge.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    redirect: '/consultation'
  },
  {
    path: '/consultation',
    name: 'Consultation',
    component: Consultation
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/regulations',
    name: 'Regulations',
    component: Regulations
  },
  {
    path: '/cases',
    name: 'Cases',
    component: Cases
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: Monitor
  },
  {
    path: '/document',
    name: 'Document',
    component: Document
  },
  {
    path: '/contract',
    name: 'Contract',
    component: Contract
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: Knowledge
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  userStore.getUser()

  if (to.path !== '/login' && !userStore.isLoggedIn()) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn()) {
    next('/')
  } else {
    next()
  }
})

export default router
