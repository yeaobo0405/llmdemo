<template>
  <div class="cases-page">
    <div class="container">
      <div class="page-header">
        <div class="header-left">
          <span class="page-icon">⚖️</span>
          <h2>案例检索</h2>
        </div>
      </div>

      <div class="search-layout">
        <div class="filter-sidebar">
          <div class="filter-section">
            <div class="filter-header" @click="toggleFilter('judgmentDate')">
              <span>裁判日期</span>
              <span class="arrow">{{ filters.judgmentDate.expanded ? '∧' : '∨' }}</span>
            </div>
            <div v-show="filters.judgmentDate.expanded" class="filter-content">
              <div class="date-range">
                <input type="date" v-model="filters.judgmentDate.start" class="date-input" placeholder="开始日期">
                <span class="separator">-</span>
                <input type="date" v-model="filters.judgmentDate.end" class="date-input" placeholder="结束日期">
              </div>
              <div class="year-list">
                <div v-for="year in yearOptions" :key="year.id" class="year-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="year.selected">
                    <span>{{ year.label }}</span>
                    <span class="item-count">{{ year.count }}万条</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-header" @click="toggleFilter('cause')">
              <span>案由</span>
              <span class="arrow">{{ filters.cause.expanded ? '∧' : '∨' }}</span>
            </div>
            <div v-show="filters.cause.expanded" class="filter-content">
              <input type="text" v-model="filters.cause.search" class="search-input" placeholder="输入关键字进行过滤">
              <div class="checkbox-list">
                <div v-for="item in causeOptions" :key="item.id" class="checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="item.selected">
                    <span class="expand-icon" v-if="item.children" @click.stop="toggleCause(item)">
                      {{ item.expanded ? '▾' : '▸' }}
                    </span>
                    <span>{{ item.label }}</span>
                    <span class="item-count">{{ item.count }}万条</span>
                  </label>
                  <div v-if="item.children && item.expanded" class="sub-list">
                    <div v-for="child in item.children" :key="child.id" class="checkbox-item">
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="child.selected">
                        <span>{{ child.label }}</span>
                        <span class="item-count">{{ child.count }}万条</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-header" @click="toggleFilter('court')">
              <span>法院名称</span>
              <span class="arrow">{{ filters.court.expanded ? '∧' : '∨' }}</span>
            </div>
            <div v-show="filters.court.expanded" class="filter-content">
              <input type="text" v-model="filters.court.search" class="search-input" placeholder="输入关键字进行过滤">
              <div class="checkbox-list">
                <div v-for="item in courtOptions" :key="item.id" class="checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="item.selected">
                    <span class="expand-icon" v-if="item.children" @click.stop="toggleCourt(item)">
                      {{ item.expanded ? '▾' : '▸' }}
                    </span>
                    <span>{{ item.label }}</span>
                    <span class="item-count">{{ item.count }}万条</span>
                  </label>
                  <div v-if="item.children && item.expanded" class="sub-list">
                    <div v-for="child in item.children" :key="child.id" class="checkbox-item">
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="child.selected">
                        <span>{{ child.label }}</span>
                        <span class="item-count">{{ child.count }}万条</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="filter-actions">
            <button class="btn-reset" @click="resetFilters">重置</button>
            <button class="btn-confirm" @click="applyFilters">确认</button>
          </div>
        </div>

        <div class="search-main">
          <div class="search-tabs">
            <button class="tab-btn active">智能检索</button>
            <button class="tab-btn">精准匹配</button>
          </div>

          <div class="search-bar">
            <input type="text" v-model="searchQuery" class="search-input" placeholder="请输入检索关键词...">
            <button class="btn-search" @click="handleSearch">
              <span class="search-icon">🔍</span>
              搜索
            </button>
          </div>

          <div class="search-results">
            <div class="results-header">
              <h3>检索到<span class="highlight">{{ totalResults }}万条</span></h3>
              <div class="sort-options">
                <button class="sort-btn" @click="sortBy = 'relevance'; sortOrder = -sortOrder">
                  相关性 {{ sortBy === 'relevance' ? (sortOrder > 0 ? '∧' : '∨') : '' }}
                </button>
                <button class="sort-btn" @click="sortBy = 'judgmentDate'; sortOrder = -sortOrder">
                  判决日期 {{ sortBy === 'judgmentDate' ? (sortOrder > 0 ? '∧' : '∨') : '' }}
                </button>
              </div>
            </div>

            <div class="result-list">
              <div
                v-for="item in cases"
                :key="item.id"
                class="result-item"
                @click="viewDetail(item)"
              >
                <div class="result-header">
                  <h4 class="result-title">{{ item.title }}</h4>
                  <span class="case-type" :class="item.typeClass">{{ item.type }}</span>
                </div>
                <div class="result-meta">
                  <span class="meta-item">案号：{{ item.caseNumber }}</span>
                  <span class="meta-item">判决时间：{{ item.judgmentDate }}</span>
                  <span class="meta-item">审理法院：{{ item.court }}</span>
                </div>
                <p class="result-summary">{{ item.summary }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetail" class="modal-overlay" @click="showDetail = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedItem?.title }}</h3>
          <button class="modal-close" @click="showDetail = false">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-meta">
            <p><strong>案号：</strong>{{ selectedItem?.caseNumber }}</p>
            <p><strong>判决时间：</strong>{{ selectedItem?.judgmentDate }}</p>
            <p><strong>审理法院：</strong>{{ selectedItem?.court }}</p>
            <p><strong>案件类型：</strong>{{ selectedItem?.type }}</p>
            <p><strong>案由：</strong>{{ selectedItem?.cause }}</p>
          </div>
          <div class="detail-content">
            <h4>争议焦点</h4>
            <p>{{ selectedItem?.focus }}</p>
            <h4>裁判要旨</h4>
            <p>{{ selectedItem?.summary }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showDetail = false">关闭</button>
          <button class="btn-primary">下载</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const searchQuery = ref('')
const sortBy = ref('relevance')
const sortOrder = ref(-1)
const showDetail = ref(false)
const selectedItem = ref(null)
const totalResults = ref(6721.1)

const filters = reactive({
  judgmentDate: { expanded: true, start: '', end: '' },
  cause: { expanded: false, search: '' },
  court: { expanded: false, search: '' }
})

const toggleFilter = (filterName) => {
  filters[filterName].expanded = !filters[filterName].expanded
}

const toggleCause = (item) => {
  item.expanded = !item.expanded
}

const toggleCourt = (item) => {
  item.expanded = !item.expanded
}

const yearOptions = ref([
  { id: 1, label: '2025 年', count: 667.7, selected: false },
  { id: 2, label: '2024 年', count: 736.8, selected: false },
  { id: 3, label: '2023 年', count: 637.8, selected: false },
  { id: 4, label: '2022 年', count: 769.3, selected: false },
  { id: 5, label: '2021 年', count: 1620.6, selected: false }
])

const causeOptions = ref([
  { id: 1, label: '刑事案由', count: 273, selected: false, expanded: false },
  { id: 2, label: '民事案由', count: 5148.37, selected: false, expanded: false },
  { id: 3, label: '行政案由', count: 31.1, selected: false, expanded: false },
  { id: 4, label: '赔偿案由', count: 1.3, selected: false, expanded: false },
  { id: 5, label: '执行案由', count: 1873, selected: false, expanded: false },
  { id: 6, label: '其他案由', count: 102.8, selected: false, expanded: false }
])

const courtOptions = ref([
  { 
    id: 1, 
    label: '最高人民法院', 
    count: 2.1, 
    selected: false, 
    expanded: false 
  },
  { 
    id: 2, 
    label: '北京市', 
    count: 218.5, 
    selected: false, 
    expanded: false,
    children: [
      { id: 21, label: '北京市高级人民法院', count: 15.2, selected: false },
      { id: 22, label: '北京市第一中级人民法院', count: 45.8, selected: false },
      { id: 23, label: '北京市第二中级人民法院', count: 38.6, selected: false },
      { id: 24, label: '北京市朝阳区人民法院', count: 68.9, selected: false },
      { id: 25, label: '北京市海淀区人民法院', count: 50.0, selected: false }
    ]
  },
  { 
    id: 3, 
    label: '上海市', 
    count: 195.4, 
    selected: false, 
    expanded: false,
    children: [
      { id: 31, label: '上海市高级人民法院', count: 12.8, selected: false },
      { id: 32, label: '上海市第一中级人民法院', count: 42.3, selected: false },
      { id: 33, label: '上海市浦东新区人民法院', count: 85.6, selected: false }
    ]
  },
  { 
    id: 4, 
    label: '广东省', 
    count: 356.2, 
    selected: false, 
    expanded: false,
    children: [
      { id: 41, label: '广东省高级人民法院', count: 18.5, selected: false },
      { id: 42, label: '广州市中级人民法院', count: 78.9, selected: false },
      { id: 43, label: '深圳市中级人民法院', count: 95.6, selected: false }
    ]
  },
  { 
    id: 5, 
    label: '浙江省', 
    count: 245.8, 
    selected: false, 
    expanded: false,
    children: [
      { id: 51, label: '浙江省高级人民法院', count: 15.6, selected: false },
      { id: 52, label: '杭州市中级人民法院', count: 68.9, selected: false },
      { id: 53, label: '宁波市中级人民法院', count: 52.3, selected: false }
    ]
  }
])

const cases = ref([
  {
    id: 1,
    title: '王某群危险驾驶案',
    type: '指导性案例',
    typeClass: 'guiding',
    caseNumber: '（2025）浙 0113 刑初 59 号',
    judgmentDate: '2025-09-19',
    court: '杭州市临平区人民法院',
    cause: '危险驾驶罪',
    focus: '本案的争议焦点为，被告人王某群醉酒后激活车载辅助驾驶功能，没有在主驾驶位执行驾驶操作，是否属于驾驶行为，其行为是否构成危险驾驶罪。',
    summary: '一、被告人王某群系在道路上醉酒驾驶机动车，其行为已构成危险驾驶罪。二、关于被告人王某群是否属于"驾驶"行为的问题。本院认为，被告人王某群在醉酒状态下激活车载辅助驾驶功能，虽未直接操控方向盘，但仍属于驾驶行为。'
  },
  {
    id: 2,
    title: '厦门某健康管理有限公司与福建某体育产业有限公司财产保全扣划实施案',
    type: '指导性案例',
    typeClass: 'guiding',
    caseNumber: '（2024）闽 0205 民初 4139 号',
    judgmentDate: '2024-10-24',
    court: '厦门市海沧区人民法院',
    cause: '财产保全',
    focus: '对于被保全的款项，人民法院在作出生效裁判后、立案执行前，可以依法对该款项作出扣划裁定（以下简称为执行立案前保全扣划措施）。',
    summary: '这种措施可以使债权人在不解除财产保全措施的情况下，直接实现债权的清偿，避免了因解除保全措施后债务人转移财产而导致债权人利益受损的风险。同时，该措施也有利于提高司法效率，减少当事人的诉累。'
  },
  {
    id: 3,
    title: '四川某化工股份有限公司与山东某化工股份有限公司等执行实施案',
    type: '指导性案例',
    typeClass: 'guiding',
    caseNumber: '（2023）川 01 执 4918 号',
    judgmentDate: '2024-08-28',
    court: '四川省成都市中级人民法院',
    cause: '执行异议',
    focus: '本案为知识产权领域行为类执行的疑难复杂案件，采取何种执行方式和策略引导、促成执行和解，推动矛盾纠纷"一揽子"化解。',
    summary: '实现双赢多赢共赢，是推动本案依法妥善办理的关键。执行法院在查明被执行人确无可供执行财产的情况下，积极促成双方当事人达成执行和解协议，既保障了申请执行人的合法权益，又给被执行人留出了缓冲时间。'
  },
  {
    id: 4,
    title: '北京市昌平区某环境研究所诉某流域水电开发有限公司生态破坏民事公益诉讼案',
    type: '指导性案例',
    typeClass: 'guiding',
    caseNumber: '（2024）川民终 4 号',
    judgmentDate: '2024-07-31',
    court: '四川省高级人民法院',
    cause: '生态破坏责任纠纷',
    focus: '高质量发展和高水平保护相辅相成、相得益彰。发展经济不能对资源和生态环境竭泽而渔。',
    summary: '本案系在长江流域进行水电开发引发的生态破坏民事公益诉讼案件。人民法院坚持生态优先、绿色发展理念，准确把握高质量发展与高水平保护的关系，依法判令被告承担生态环境修复责任，实现了案件办理政治效果、社会效果、法律效果的有机统一。'
  },
  {
    id: 5,
    title: '张某与某科技有限公司劳动争议案',
    type: '典型案例',
    typeClass: 'typical',
    caseNumber: '（2024）京 02 民终 1234 号',
    judgmentDate: '2024-06-15',
    court: '北京市第二中级人民法院',
    cause: '劳动争议',
    focus: '本案涉及互联网行业加班费认定问题，对于规范互联网企业用工管理具有典型意义。',
    summary: '法院认为，用人单位应当依法支付劳动者加班费。对于互联网企业实行的弹性工作制，不能成为规避加班费支付义务的理由。劳动者能够提供证据证明存在加班事实的，用人单位应当依法支付加班费。'
  },
  {
    id: 6,
    title: '李某与某银行股份有限公司信用卡纠纷案',
    type: '典型案例',
    typeClass: 'typical',
    caseNumber: '（2024）沪 01 民终 5678 号',
    judgmentDate: '2024-05-20',
    court: '上海市第一中级人民法院',
    cause: '信用卡纠纷',
    focus: '本案涉及信用卡透支利息计算问题，对于规范银行信用卡业务具有指导意义。',
    summary: '法院认为，银行应当按照合同约定和法律规定计算信用卡透支利息。对于复利、罚息等计算方式，银行应当履行明确告知义务。未告知的，相关条款可能对持卡人不产生效力。'
  }
])

const resetFilters = () => {
  filters.judgmentDate.start = ''
  filters.judgmentDate.end = ''
  filters.cause.search = ''
  filters.court.search = ''
  
  yearOptions.value.forEach(item => {
    item.selected = false
  })
  
  causeOptions.value.forEach(item => {
    item.selected = false
    item.expanded = false
    if (item.children) {
      item.children.forEach(child => child.selected = false)
    }
  })
  
  courtOptions.value.forEach(item => {
    item.selected = false
    item.expanded = false
    if (item.children) {
      item.children.forEach(child => child.selected = false)
    }
  })
}

const applyFilters = () => {
  alert('筛选功能开发中...')
}

const handleSearch = () => {
  alert('搜索功能开发中...')
}

const viewDetail = (item) => {
  selectedItem.value = item
  showDetail.value = true
}
</script>

<style scoped>
.cases-page {
  min-height: calc(100vh - 120px);
  padding: 24px 0;
}

.page-header {
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-icon {
  font-size: 32px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.search-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
}

.filter-sidebar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.filter-section {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.filter-section:last-of-type {
  border-bottom: none;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  font-weight: 500;
  color: #333;
  transition: color 0.3s ease;
}

.filter-header:hover {
  color: #1890ff;
}

.arrow {
  font-size: 12px;
  color: #999;
}

.filter-content {
  margin-top: 12px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.date-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.3s ease;
}

.date-input:focus {
  border-color: #1890ff;
}

.separator {
  color: #999;
}

.year-list {
  margin-top: 12px;
}

.year-item {
  margin-bottom: 8px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 12px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #1890ff;
}

.checkbox-list {
  max-height: 300px;
  overflow-y: auto;
}

.checkbox-item {
  margin-bottom: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: color 0.3s ease;
}

.checkbox-label:hover {
  color: #1890ff;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.expand-icon {
  font-size: 12px;
  color: #999;
  margin-right: 4px;
}

.item-count {
  margin-left: auto;
  font-size: 12px;
  color: #999;
}

.sub-list {
  margin-left: 24px;
  margin-top: 8px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
}

.btn-reset,
.btn-confirm {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #666;
}

.btn-reset:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-confirm {
  background: #1890ff;
  border: 1px solid #1890ff;
  color: white;
}

.btn-confirm:hover {
  background: #40a9ff;
}

.search-main {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.tab-btn {
  padding: 12px 0;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
}

.tab-btn:hover {
  color: #1890ff;
}

.tab-btn.active {
  color: #1890ff;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1890ff;
}

.search-bar {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.search-bar .search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  margin: 0;
  font-size: 14px;
}

.btn-search {
  padding: 12px 24px;
  background: #1890ff;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-icon {
  font-size: 16px;
}

.btn-search:hover {
  background: #40a9ff;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.highlight {
  color: #1890ff;
  font-weight: 600;
  font-size: 18px;
}

.sort-options {
  display: flex;
  gap: 16px;
}

.sort-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.sort-btn:hover {
  color: #40a9ff;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-item:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
  transform: translateY(-2px);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

.case-type {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.case-type.guiding {
  background: #fff7e6;
  color: #fa8c16;
}

.case-type.typical {
  background: #e6f7ff;
  color: #1890ff;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 13px;
  color: #999;
}

.result-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.detail-meta {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.detail-meta p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.detail-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 12px 0;
}

.detail-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-secondary,
.btn-primary {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #666;
}

.btn-secondary:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.btn-primary {
  background: #1890ff;
  border: 1px solid #1890ff;
  color: white;
}

.btn-primary:hover {
  background: #40a9ff;
}
</style>
