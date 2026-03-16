<template>
  <div class="monitor-page">
    <div class="container">
      <div class="page-header">
        <h2>涉外法律动态监测、风险预警与决策支撑</h2>
        <p>域外法律常态化监测、趋势研判、风险评估、决策建议全链路服务</p>
      </div>

      <div class="monitor-tabs">
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

      <div class="monitor-content">
        <div v-if="activeTab === 'monitor'" class="tab-panel">
          <div class="card">
            <div class="panel-header">
              <h3>常态化动态监测</h3>
              <div class="header-actions">
                <select v-model="selectedCountry" class="input">
                  <option value="">全部国家</option>
                  <option value="mn">蒙古国</option>
                  <option value="ru">俄罗斯</option>
                  <option value="other">其他</option>
                </select>
                <select v-model="selectedField" class="input">
                  <option value="">全部领域</option>
                  <option value="investment">投资</option>
                  <option value="trade">贸易</option>
                  <option value="mining">矿产</option>
                  <option value="data">数据安全</option>
                </select>
              </div>
            </div>

            <div class="monitor-stats">
              <div class="stat-item">
                <div class="stat-icon">📊</div>
                <div class="stat-info">
                  <div class="stat-value">{{ monitorStats.total }}</div>
                  <div class="stat-label">监测总数</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">📈</div>
                <div class="stat-info">
                  <div class="stat-value">{{ monitorStats.newToday }}</div>
                  <div class="stat-label">今日新增</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">⚠️</div>
                <div class="stat-info">
                  <div class="stat-value">{{ monitorStats.highRisk }}</div>
                  <div class="stat-label">高风险</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                  <div class="stat-value">{{ monitorStats.coverage }}%</div>
                  <div class="stat-label">覆盖率</div>
                </div>
              </div>
            </div>

            <div class="monitor-list">
              <div
                v-for="(item, index) in monitorList"
                :key="index"
                class="monitor-item"
                :class="getRiskClass(item.riskLevel)"
              >
                <div class="item-header">
                  <div class="item-title">{{ item.title }}</div>
                  <span class="badge" :class="getRiskBadgeClass(item.riskLevel)">
                    {{ item.riskLevel }}
                  </span>
                </div>
                <div class="item-meta">
                  <span class="meta-item">{{ item.country }}</span>
                  <span class="meta-item">{{ item.field }}</span>
                  <span class="meta-item">{{ item.date }}</span>
                </div>
                <p class="item-summary">{{ item.summary }}</p>
                <div class="item-actions">
                  <button class="btn btn-secondary" @click="viewDetail(item)">查看详情</button>
                  <button class="btn btn-primary" @click="analyzeImpact(item)">影响评估</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'warning'" class="tab-panel">
          <div class="card">
            <div class="panel-header">
              <h3>趋势预警与风险评估</h3>
              <div class="header-actions">
                <select v-model="warningLevel" class="input">
                  <option value="">全部级别</option>
                  <option value="high">高风险</option>
                  <option value="medium">中风险</option>
                  <option value="low">低风险</option>
                </select>
              </div>
            </div>

            <div class="warning-chart">
              <div class="chart-header">
                <h4>风险趋势图</h4>
                <div class="chart-legend">
                  <span class="legend-item high">高风险</span>
                  <span class="legend-item medium">中风险</span>
                  <span class="legend-item low">低风险</span>
                </div>
              </div>
              <div class="chart-content">
                <div class="chart-bar" v-for="(value, index) in chartData" :key="index">
                  <div class="bar-container">
                    <div
                      class="bar"
                      :class="value.level"
                      :style="{ height: value.height + '%' }"
                    ></div>
                  </div>
                  <div class="bar-label">{{ value.label }}</div>
                </div>
              </div>
            </div>

            <div class="warning-list">
              <div
                v-for="(warning, index) in warningList"
                :key="index"
                class="warning-item"
                :class="warning.level"
              >
                <div class="warning-icon">{{ getWarningIcon(warning.level) }}</div>
                <div class="warning-content">
                  <div class="warning-title">{{ warning.title }}</div>
                  <div class="warning-meta">
                    <span>{{ warning.country }}</span>
                    <span>{{ warning.field }}</span>
                    <span>{{ warning.date }}</span>
                  </div>
                  <p class="warning-desc">{{ warning.description }}</p>
                  <div class="warning-impact">
                    <strong>影响评估：</strong>{{ warning.impact }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'analysis'" class="tab-panel">
          <div class="card">
            <div class="panel-header">
              <h3>专项分析与决策建议</h3>
              <button class="btn btn-primary" @click="generateReport">生成分析报告</button>
            </div>

            <div class="analysis-grid">
              <div class="analysis-card">
                <div class="card-header">
                  <h4>📋 中蒙经贸合作法律风险分析</h4>
                  <span class="badge badge-info">年度报告</span>
                </div>
                <div class="card-body">
                  <p>基于2023年度中蒙经贸合作数据，分析投资、贸易、矿产等领域的法律风险变化趋势。</p>
                  <div class="card-stats">
                    <div class="stat">
                      <span class="stat-label">分析领域</span>
                      <span class="stat-value">8个</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">风险点</span>
                      <span class="stat-value">24个</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">建议措施</span>
                      <span class="stat-value">16项</span>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <button class="btn btn-secondary" @click="viewReport('cn-mn')">查看报告</button>
                  <button class="btn btn-primary" @click="downloadReport('cn-mn')">下载</button>
                </div>
              </div>

              <div class="analysis-card">
                <div class="card-header">
                  <h4>📋 中俄跨境贸易合规指引</h4>
                  <span class="badge badge-success">专项报告</span>
                </div>
                <div class="card-body">
                  <p>针对中俄跨境贸易中的合同、支付、物流、合规等关键环节提供操作指引。</p>
                  <div class="card-stats">
                    <div class="stat">
                      <span class="stat-label">业务场景</span>
                      <span class="stat-value">12个</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">合规要点</span>
                      <span class="stat-value">36个</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">操作指引</span>
                      <span class="stat-value">24条</span>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <button class="btn btn-secondary" @click="viewReport('cn-ru')">查看报告</button>
                  <button class="btn btn-primary" @click="downloadReport('cn-ru')">下载</button>
                </div>
              </div>

              <div class="analysis-card">
                <div class="card-header">
                  <h4>📋 蒙古国矿业投资法律风险评估</h4>
                  <span class="badge badge-warning">行业报告</span>
                </div>
                <div class="card-body">
                  <p>深入分析蒙古国矿业投资的法律环境、政策变化、风险点及应对策略。</p>
                  <div class="card-stats">
                    <div class="stat">
                      <span class="stat-label">风险等级</span>
                      <span class="stat-value">中高</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">关键风险</span>
                      <span class="stat-value">8个</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">应对策略</span>
                      <span class="stat-value">10项</span>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <button class="btn btn-secondary" @click="viewReport('mining')">查看报告</button>
                  <button class="btn btn-primary" @click="downloadReport('mining')">下载</button>
                </div>
              </div>

              <div class="analysis-card">
                <div class="card-header">
                  <h4>📋 涉外数据合规专项分析</h4>
                  <span class="badge badge-danger">合规报告</span>
                </div>
                <div class="card-body">
                  <p>全面分析跨境数据传输的合规要求，涵盖中国、欧盟、俄罗斯、蒙古国等主要法域。</p>
                  <div class="card-stats">
                    <div class="stat">
                      <span class="stat-label">覆盖法域</span>
                      <span class="stat-value">6个</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">合规要求</span>
                      <span class="stat-value">28项</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">操作建议</span>
                      <span class="stat-value">18条</span>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <button class="btn btn-secondary" @click="viewReport('data')">查看报告</button>
                  <button class="btn btn-primary" @click="downloadReport('data')">下载</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('monitor')
const selectedCountry = ref('')
const selectedField = ref('')
const warningLevel = ref('')

const tabs = ref([
  { id: 'monitor', name: '常态化动态监测', icon: '📊' },
  { id: 'warning', name: '趋势预警与风险评估', icon: '⚠️' },
  { id: 'analysis', name: '专项分析与决策建议', icon: '📋' }
])

const monitorStats = ref({
  total: 1248,
  newToday: 15,
  highRisk: 23,
  coverage: 65
})

const monitorList = ref([
  {
    title: '蒙古国投资法修订草案发布',
    country: '蒙古国',
    field: '投资',
    date: '2024-03-12',
    riskLevel: '高风险',
    summary: '蒙古国国家大呼拉尔发布《投资法》修订草案，对外资准入、优惠政策等条款进行重大调整。'
  },
  {
    title: '俄罗斯数据本地化新规生效',
    country: '俄罗斯',
    field: '数据安全',
    date: '2024-03-11',
    riskLevel: '中风险',
    summary: '俄罗斯联邦政府关于数据本地化存储的新规正式生效，对跨境数据传输提出更严格要求。'
  },
  {
    title: '中蒙双边贸易协定补充协议签署',
    country: '蒙古国',
    field: '贸易',
    date: '2024-03-10',
    riskLevel: '低风险',
    summary: '中蒙两国签署双边贸易协定补充协议，进一步降低关税壁垒，扩大贸易便利化措施。'
  },
  {
    title: '蒙古国矿业法实施细则更新',
    country: '蒙古国',
    field: '矿产',
    date: '2024-03-09',
    riskLevel: '中风险',
    summary: '蒙古国矿业部发布矿业法实施细则更新，对矿产勘探、开采许可审批流程进行调整。'
  },
  {
    title: '俄罗斯外商投资负面清单调整',
    country: '俄罗斯',
    field: '投资',
    date: '2024-03-08',
    riskLevel: '低风险',
    summary: '俄罗斯联邦政府调整外商投资负面清单，放宽部分行业的外资准入限制。'
  }
])

const chartData = ref([
  { label: '1月', height: 60, level: 'medium' },
  { label: '2月', height: 75, level: 'medium' },
  { label: '3月', height: 90, level: 'high' },
  { label: '4月', height: 45, level: 'low' },
  { label: '5月', height: 55, level: 'medium' },
  { label: '6月', height: 70, level: 'medium' }
])

const warningList = ref([
  {
    title: '蒙古国投资环境变化预警',
    country: '蒙古国',
    field: '投资',
    date: '2024-03-12',
    level: 'high',
    description: '蒙古国《投资法》修订草案可能对外资准入产生重大影响，建议密切关注立法进展。',
    impact: '可能影响现有投资项目，需评估新规对投资回报的影响，及时调整投资策略。'
  },
  {
    title: '俄罗斯数据合规风险提示',
    country: '俄罗斯',
    field: '数据安全',
    date: '2024-03-11',
    level: 'high',
    description: '俄罗斯数据本地化新规生效，跨境数据传输面临更严格监管。',
    impact: '需重新评估数据处理流程，确保符合俄罗斯数据本地化要求，避免合规风险。'
  },
  {
    title: '中蒙贸易便利化机遇',
    country: '蒙古国',
    field: '贸易',
    date: '2024-03-10',
    level: 'low',
    description: '中蒙双边贸易协定补充协议签署，贸易环境进一步优化。',
    impact: '建议抓住贸易便利化机遇，扩大对蒙贸易规模，优化贸易结构。'
  }
])

const getRiskClass = (level) => {
  const classMap = {
    '高风险': 'risk-high',
    '中风险': 'risk-medium',
    '低风险': 'risk-low'
  }
  return classMap[level] || ''
}

const getRiskBadgeClass = (level) => {
  const classMap = {
    '高风险': 'badge-danger',
    '中风险': 'badge-warning',
    '低风险': 'badge-success'
  }
  return classMap[level] || 'badge-info'
}

const getWarningIcon = (level) => {
  const iconMap = {
    'high': '🔴',
    'medium': '🟡',
    'low': '🟢'
  }
  return iconMap[level] || '⚪'
}

const viewDetail = (item) => {
  alert(`查看详情：${item.title}`)
}

const analyzeImpact = (item) => {
  alert(`影响评估：${item.title}`)
}

const generateReport = () => {
  alert('正在生成专项分析报告...')
}

const viewReport = (type) => {
  alert(`查看报告：${type}`)
}

const downloadReport = (type) => {
  alert(`下载报告：${type}`)
}
</script>

<style scoped>
.monitor-page {
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

.monitor-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
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

.monitor-content {
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
}

.monitor-stats {
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
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 28px !important;
  font-weight: 700 !important;
  line-height: 1.2;
  color: #ffffff !important;
}

.stat-label {
  font-size: 13px !important;
  font-weight: 500 !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

.monitor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.monitor-item {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.monitor-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.monitor-item.risk-high {
  border-left: 4px solid #dc3545;
}

.monitor-item.risk-medium {
  border-left: 4px solid #ffc107;
}

.monitor-item.risk-low {
  border-left: 4px solid #28a745;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.item-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: #999;
}

.item-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.item-actions {
  display: flex;
  gap: 12px;
}

.warning-chart {
  margin-bottom: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.legend-item.high::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #dc3545;
  border-radius: 2px;
}

.legend-item.medium::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #ffc107;
  border-radius: 2px;
}

.legend-item.low::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #28a745;
  border-radius: 2px;
}

.chart-content {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 12px;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-container {
  width: 40px;
  height: 160px;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: flex-end;
  padding: 4px;
}

.bar {
  width: 100%;
  border-radius: 4px;
  transition: height 0.5s ease;
}

.bar.high {
  background: linear-gradient(180deg, #dc3545 0%, #c82333 100%);
}

.bar.medium {
  background: linear-gradient(180deg, #ffc107 0%, #e0a800 100%);
}

.bar.low {
  background: linear-gradient(180deg, #28a745 0%, #218838 100%);
}

.bar-label {
  font-size: 12px;
  color: #666;
}

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.warning-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.warning-item.high {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%);
  border-color: #dc3545;
}

.warning-item.medium {
  background: linear-gradient(135deg, #fffbf0 0%, #fff3cd 100%);
  border-color: #ffc107;
}

.warning-item.low {
  background: linear-gradient(135deg, #f0fff4 0%, #d4edda 100%);
  border-color: #28a745;
}

.warning-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.warning-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #999;
}

.warning-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.warning-impact {
  font-size: 13px;
  color: #333;
  line-height: 1.6;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.analysis-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.analysis-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-bottom: 1px solid #e0e0e0;
}

.card-header h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.card-body {
  padding: 20px;
}

.card-body p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
}

.card-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: #f8f9ff;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 1024px) {
  .monitor-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }
}
</style>
