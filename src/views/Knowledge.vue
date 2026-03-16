<template>
  <div class="knowledge-page">
    <div class="container">
      <div class="page-header">
        <h2>涉外法治知识库</h2>
        <p>外部权威知识库与内部专属知识库，支撑大模型智能服务的核心载体</p>
      </div>

      <div class="knowledge-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.name }}</span>
        </button>
      </div>

      <div class="knowledge-content">
        <div v-if="activeTab === 'external'" class="tab-panel">
          <div class="card">
            <div class="panel-header">
              <h3>外部权威知识库</h3>
              <div class="header-actions">
                <select v-model="externalFilter.category" class="input">
                  <option value="">全部类别</option>
                  <option value="law">法律法规</option>
                  <option value="case">裁判案例</option>
                  <option value="treaty">国际条约</option>
                  <option value="academic">学术研究</option>
                </select>
                <select v-model="externalFilter.jurisdiction" class="input">
                  <option value="">全部法域</option>
                  <option value="cn">中国</option>
                  <option value="mn">蒙古国</option>
                  <option value="ru">俄罗斯</option>
                  <option value="international">国际</option>
                </select>
                <button class="btn btn-primary" @click="applyExternalFilter">筛选</button>
              </div>
            </div>

            <div class="knowledge-stats">
              <div class="stat-item">
                <div class="stat-icon">📚</div>
                <div class="stat-info">
                  <div class="stat-value">{{ externalStats.total }}</div>
                  <div class="stat-label">总条目数</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🔄</div>
                <div class="stat-info">
                  <div class="stat-value">{{ externalStats.updated }}</div>
                  <div class="stat-label">今日更新</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                  <div class="stat-value">{{ externalStats.valid }}</div>
                  <div class="stat-label">现行有效</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🌐</div>
                <div class="stat-info">
                  <div class="stat-value">{{ externalStats.countries }}</div>
                  <div class="stat-label">覆盖国家</div>
                </div>
              </div>
            </div>

            <div class="knowledge-categories">
              <div
                v-for="category in externalCategories"
                :key="category.id"
                class="category-card"
                @click="viewCategory(category)"
              >
                <div class="category-icon">{{ category.icon }}</div>
                <h4 class="category-name">{{ category.name }}</h4>
                <p class="category-desc">{{ category.description }}</p>
                <div class="category-meta">
                  <span class="meta-item">{{ category.count }} 条</span>
                  <span class="meta-item">{{ category.lastUpdate }}</span>
                </div>
              </div>
            </div>

            <div class="recent-updates">
              <h3>最近更新</h3>
              <div v-if="filteredRecentUpdates.length > 0" class="update-list">
                <div
                  v-for="(item, index) in filteredRecentUpdates"
                  :key="index"
                  class="update-item"
                  @click="viewItem(item)"
                >
                  <div class="update-icon">{{ getCategoryIcon(item.category) }}</div>
                  <div class="update-content">
                    <h4 class="update-title">{{ item.title }}</h4>
                    <div class="update-meta">
                      <span class="badge" :class="getCategoryBadgeClass(item.category)">
                        {{ item.category }}
                      </span>
                      <span class="meta-item">{{ item.jurisdiction }}</span>
                      <span class="meta-item">{{ item.updateTime }}</span>
                    </div>
                    <p class="update-summary">{{ item.summary }}</p>
                  </div>
                </div>
              </div>
              <div v-if="filteredRecentUpdates.length === 0" class="no-access">
                <div class="no-access-icon">🔒</div>
                <h3>权限不足</h3>
                <p>您当前的身份无法查看此内容</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'internal'" class="tab-panel">
          <div class="card">
            <div class="panel-header">
              <h3>内部专属知识库</h3>
              <div class="header-actions">
                <select v-model="internalFilter.type" class="input">
                  <option value="">全部类型</option>
                  <option value="judicial">司法实务</option>
                  <option value="research">课题研究</option>
                  <option value="user">用户专属</option>
                </select>
                <select v-model="internalFilter.access" class="input">
                  <option value="">全部权限</option>
                  <option value="public">公开</option>
                  <option value="internal">内部</option>
                  <option value="confidential">机密</option>
                </select>
                <button class="btn btn-primary" @click="applyInternalFilter">筛选</button>
              </div>
            </div>

            <div class="knowledge-stats">
              <div class="stat-item">
                <div class="stat-icon">🔒</div>
                <div class="stat-info">
                  <div class="stat-value">{{ internalStats.total }}</div>
                  <div class="stat-label">总条目数</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                  <div class="stat-value">{{ internalStats.users }}</div>
                  <div class="stat-label">授权用户</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">📊</div>
                <div class="stat-info">
                  <div class="stat-value">{{ internalStats.reports }}</div>
                  <div class="stat-label">分析报告</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">📁</div>
                <div class="stat-info">
                  <div class="stat-value">{{ internalStats.archives }}</div>
                  <div class="stat-label">用户归档</div>
                </div>
              </div>
            </div>

            <div class="internal-types">
              <template v-if="filteredInternalTypes.length > 0">
                <div
                  v-for="type in filteredInternalTypes"
                  :key="type.id"
                  class="type-card"
                  @click="viewInternalType(type)"
                >
                  <div class="type-header">
                    <div class="type-icon">{{ type.icon }}</div>
                    <div class="type-info">
                      <h4 class="type-name">{{ type.name }}</h4>
                      <span class="type-access" :class="type.accessLevel">
                        {{ type.accessLevel }}
                      </span>
                    </div>
                  </div>
                  <p class="type-desc">{{ type.description }}</p>
                  <div class="type-meta">
                    <span class="meta-item">{{ type.count }} 条</span>
                    <span class="meta-item">{{ type.lastUpdate }}</span>
                  </div>
                </div>
              </template>
              <div v-else class="no-access">
                <div class="no-access-icon">🔒</div>
                <h3>权限不足</h3>
                <p>您当前的身份无法查看隐私数据</p>
              </div>
            </div>

            <div class="access-logs">
              <h3>访问日志</h3>
              <div class="log-list">
                <div
                  v-for="(log, index) in accessLogs"
                  :key="index"
                  class="log-item"
                >
                  <div class="log-icon">{{ getLogIcon(log.action) }}</div>
                  <div class="log-content">
                    <div class="log-header">
                      <span class="log-user">{{ log.user }}</span>
                      <span class="log-action">{{ log.action }}</span>
                      <span class="log-time">{{ log.time }}</span>
                    </div>
                    <p class="log-detail">{{ log.detail }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedItem?.title }}</h3>
          <button class="close-btn" @click="showDetailModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-meta">
            <span class="badge" :class="getCategoryBadgeClass(selectedItem?.category)">
              {{ selectedItem?.category }}
            </span>
            <span class="detail-jurisdiction">{{ selectedItem?.jurisdiction }}</span>
            <span class="detail-date">{{ selectedItem?.updateTime }}</span>
            <span class="detail-status">{{ selectedItem?.status }}</span>
          </div>
          <div class="detail-content">
            <h4>内容摘要</h4>
            <p>{{ selectedItem?.summary }}</p>
            <h4>核心要点</h4>
            <ul>
              <li v-for="(point, index) in selectedItem?.keyPoints" :key="index">
                {{ point }}
              </li>
            </ul>
            <h4>适用场景</h4>
            <div class="scenarios">
              <span
                v-for="(scenario, index) in selectedItem?.scenarios"
                :key="index"
                class="scenario-tag"
              >
                {{ scenario }}
              </span>
            </div>
            <h4>相关依据</h4>
            <div class="references">
              <div v-for="(ref, index) in selectedItem?.references" :key="index" class="ref-item">
                {{ ref }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDetailModal = false">关闭</button>
          <button class="btn btn-primary" @click="exportItem">导出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const activeTab = ref('external')
const showDetailModal = ref(false)
const selectedItem = ref(null)

const tabs = ref([
  { id: 'external', name: '外部权威知识库', icon: '🌐' },
  { id: 'internal', name: '内部专属知识库', icon: '🔒' }
])

const externalFilter = ref({
  category: '',
  jurisdiction: ''
})

const internalFilter = ref({
  type: '',
  access: ''
})

const externalStats = ref({
  total: 12580,
  updated: 156,
  valid: 11890,
  countries: 15
})

const internalStats = ref({
  total: 3240,
  users: 156,
  reports: 89,
  archives: 2995
})

const externalCategories = ref([
  {
    id: 1,
    name: '官方权威法律库',
    icon: '⚖️',
    description: '对接目标国官方立法与司法机构数据源，获取全量权威法律法规、裁判文书、立法动态数据',
    count: 5680,
    lastUpdate: '2024-03-12',
    sensitivity: 'public'
  },
  {
    id: 2,
    name: '国际组织与双边合作库',
    icon: '🤝',
    description: '对接联合国国际贸易法委员会、国际商会、海牙国际私法会议等国际组织官方数据源',
    count: 2340,
    lastUpdate: '2024-03-11',
    sensitivity: 'public'
  },
  {
    id: 3,
    name: '学术与行业合规库',
    icon: '📖',
    description: '对接国内主流学术平台、国内外知名法学院校、涉外法律服务机构，获取公开发布的法律学术研究成果',
    count: 4560,
    lastUpdate: '2024-03-10',
    sensitivity: 'public'
  }
])

const recentUpdates = ref([
  {
    title: '蒙古国《投资法》修订草案',
    category: '法律法规',
    jurisdiction: '蒙古国',
    updateTime: '2024-03-12 10:30',
    summary: '蒙古国国家大呼拉尔发布《投资法》修订草案，对外资准入、优惠政策等条款进行重大调整。',
    status: '现行有效',
    sensitivity: 'public',
    keyPoints: [
      '扩大外资准入范围',
      '优化税收优惠政策',
      '完善投资争议解决机制',
      '加强投资者权益保护'
    ],
    scenarios: ['投资咨询', '合规审查', '风险评估'],
    references: [
      '蒙古国《投资法》修订草案全文',
      '蒙古国国家大呼拉尔公告',
      '《中蒙双边投资保护协定》'
    ]
  },
  {
    title: '中俄跨境贸易合规指引',
    category: '学术研究',
    jurisdiction: '俄罗斯',
    updateTime: '2024-03-11 15:20',
    summary: '针对中俄跨境贸易中的合同、支付、物流、合规等关键环节提供操作指引。',
    status: '现行有效',
    sensitivity: 'public',
    keyPoints: [
      '贸易合同核心条款',
      '外汇支付合规要求',
      '跨境物流法律风险',
      '争议解决机制选择'
    ],
    scenarios: ['贸易咨询', '合同审查', '合规管理'],
    references: [
      '《中俄贸易协定》',
      '俄罗斯联邦《对外贸易法》',
      '中国国际商会跨境贸易指引'
    ]
  },
  {
    title: '（2023）最高法民申字第1234号',
    category: '裁判案例',
    jurisdiction: '中国',
    updateTime: '2024-03-10 09:15',
    summary: '涉及中俄跨境贸易合同纠纷，法院适用《联合国国际货物销售合同公约》进行裁判。',
    status: '已生效',
    sensitivity: 'public',
    keyPoints: [
      '确认CISG的适用条件',
      '明确跨境贸易合同解释规则',
      '分析违约责任认定标准',
      '确定损害赔偿计算方法'
    ],
    scenarios: ['案例研究', '裁判参考', '法律检索'],
    references: [
      '《联合国国际货物销售合同公约》',
      '《中华人民共和国涉外民事关系法律适用法》',
      '最高人民法院相关司法解释'
    ]
  },
  {
    title: 'CIETAC 2023-A-001号仲裁裁决',
    category: '仲裁裁决',
    jurisdiction: '国际仲裁',
    updateTime: '2024-03-09 14:45',
    summary: '中国国际经济贸易仲裁委员会审理的中蒙投资争议案件，涉及蒙古国矿业投资纠纷。',
    status: '已裁决',
    sensitivity: 'public',
    keyPoints: [
      '认定投资协议有效性',
      '分析蒙古国投资政策适用',
      '确定违约赔偿金额',
      '明确裁决执行程序'
    ],
    scenarios: ['仲裁研究', '投资争议', '案例参考'],
    references: [
      '《中蒙双边投资保护协定》',
      '蒙古国投资法',
      'CIETAC仲裁规则'
    ]
  }
])

const internalTypes = ref([
  {
    id: 1,
    name: '司法实务专属库',
    icon: '⚖️',
    description: '归集自治区公检法司机关授权提供的脱敏涉外案件数据、跨境司法协作内部指引、未公开的实务裁判规则',
    accessLevel: '内部',
    count: 890,
    lastUpdate: '2024-03-12',
    sensitivity: 'private'
  },
  {
    id: 2,
    name: '课题与决策支撑库',
    icon: '📊',
    description: '存储平台自主开展的涉蒙古国法律研究课题成果、中蒙俄经贸合作法律风险专项分析报告、政策建议报告',
    accessLevel: '内部',
    count: 355,
    lastUpdate: '2024-03-11',
    sensitivity: 'private'
  },
  {
    id: 3,
    name: '用户专属归档库',
    icon: '👤',
    description: '按用户主体独立划分加密存储空间，存储用户在平台内的咨询记录、检索结果、文书生成、合同审查报告等归档数据',
    accessLevel: '机密',
    count: 1995,
    lastUpdate: '2024-03-12',
    sensitivity: 'private'
  }
])

const accessLogs = ref([
  {
    user: '张法官',
    action: '查看',
    time: '2024-03-12 14:30',
    detail: '查看了蒙古国《投资法》修订草案及相关分析报告'
  },
  {
    user: '李律师',
    action: '下载',
    time: '2024-03-12 13:15',
    detail: '下载了中俄跨境贸易合规指引文档'
  },
  {
    user: '王研究员',
    action: '查询',
    time: '2024-03-12 11:45',
    detail: '查询了涉外仲裁裁决案例库'
  },
  {
    user: '赵顾问',
    action: '上传',
    time: '2024-03-12 10:20',
    detail: '上传了中蒙经贸合作法律风险分析报告'
  }
])

const filteredRecentUpdates = computed(() => {
  if (!userStore.user) return []
  return recentUpdates.value.filter(item => {
    return userStore.canAccessData(item.sensitivity)
  })
})

const filteredInternalTypes = computed(() => {
  if (!userStore.user) return []
  return internalTypes.value.filter(type => {
    return userStore.canAccessData(type.sensitivity)
  })
})

const applyExternalFilter = () => {
  alert('筛选功能开发中...')
}

const applyInternalFilter = () => {
  alert('筛选功能开发中...')
}

const viewCategory = (category) => {
  alert(`查看类别：${category.name}`)
}

const viewInternalType = (type) => {
  alert(`查看类型：${type.name}`)
}

const viewItem = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const getCategoryIcon = (category) => {
  const iconMap = {
    '法律法规': '⚖️',
    '裁判案例': '📜',
    '国际条约': '🤝',
    '学术研究': '📖',
    '仲裁裁决': '⚖️'
  }
  return iconMap[category] || '📄'
}

const getCategoryBadgeClass = (category) => {
  const classMap = {
    '法律法规': 'badge-info',
    '裁判案例': 'badge-warning',
    '国际条约': 'badge-success',
    '学术研究': 'badge-info',
    '仲裁裁决': 'badge-danger'
  }
  return classMap[category] || 'badge-info'
}

const getLogIcon = (action) => {
  const iconMap = {
    '查看': '👁️',
    '下载': '📥',
    '查询': '🔍',
    '上传': '📤'
  }
  return iconMap[action] || '📄'
}

const exportItem = () => {
  alert('导出功能开发中...')
}
</script>

<style scoped>
.knowledge-page {
  min-height: calc(100vh - 100px);
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.page-header h2 {
  font-size: 28px;
  margin-bottom: 8px;
  font-weight: 600;
}

.page-header p {
  font-size: 14px;
  opacity: 0.9;
}

.knowledge-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.tab-btn.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.tab-icon {
  font-size: 18px;
}

.tab-text {
  font-size: 14px;
}

.knowledge-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.knowledge-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.stat-icon {
  font-size: 32px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.knowledge-categories,
.internal-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.category-card,
.type-card {
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover,
.type-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-4px);
}

.category-icon,
.type-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.category-name,
.type-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.category-desc,
.type-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.category-meta,
.type-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.type-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-access {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.type-access.内部 {
  background: #fff3cd;
  color: #856404;
}

.type-access.机密 {
  background: #f8d7da;
  color: #721c24;
}

.recent-updates,
.access-logs {
  margin-top: 24px;
}

.recent-updates h3,
.access-logs h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.update-list,
.log-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.update-item,
.log-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.update-item:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.update-icon,
.log-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.update-content,
.log-content {
  flex: 1;
}

.update-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.update-meta,
.log-header {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.update-summary,
.log-detail {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.log-user {
  font-weight: 600;
  color: #333;
}

.log-action {
  color: #667eea;
  font-weight: 500;
}

.log-time {
  color: #999;
  font-size: 12px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.large-modal {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.detail-jurisdiction,
.detail-date,
.detail-status {
  font-size: 13px;
  color: #666;
}

.detail-content h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 20px 0 12px;
  color: #333;
}

.detail-content p {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 12px;
}

.detail-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-content li {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  padding-left: 20px;
  position: relative;
  margin-bottom: 8px;
}

.detail-content li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.scenarios {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.scenario-tag {
  padding: 4px 12px;
  background: #f8f9ff;
  border: 1px solid #667eea;
  border-radius: 16px;
  font-size: 12px;
  color: #667eea;
}

.references {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ref-item {
  padding: 10px 14px;
  background: #f8f9ff;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
}

.no-access {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%);
  border-radius: 12px;
  margin-top: 24px;
}

.no-access-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.no-access h3 {
  font-size: 20px;
  font-weight: 600;
  color: #dc3545;
  margin-bottom: 12px;
}

.no-access p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .knowledge-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .knowledge-categories,
  .internal-types {
    grid-template-columns: 1fr;
  }
}
</style>
