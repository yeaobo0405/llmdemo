<template>
  <div class="search-page">
    <div class="container">
      <div class="page-header">
        <h2>跨法域涉外法律智能检索服务</h2>
        <p>以中蒙俄为核心的跨法域、多语种智能化法律检索平台</p>
      </div>

      <div class="search-layout">
        <div class="search-sidebar">
          <div class="card search-filters">
            <h3>检索筛选</h3>

            <div class="filter-group">
              <label>检索模式</label>
              <div class="mode-selector">
                <button
                  class="mode-btn"
                  :class="{ active: searchMode === 'basic' }"
                  @click="searchMode = 'basic'"
                >
                  基础检索
                </button>
                <button
                  class="mode-btn"
                  :class="{ active: searchMode === 'advanced' }"
                  @click="searchMode = 'advanced'"
                >
                  高阶要件检索
                </button>
              </div>
            </div>

            <div class="filter-group">
              <label>法域</label>
              <select v-model="filters.jurisdiction" class="input">
                <option value="">全部法域</option>
                <option value="cn">中国</option>
                <option value="mn">蒙古国</option>
                <option value="ru">俄罗斯</option>
                <option value="international">国际公约</option>
              </select>
            </div>

            <div class="filter-group">
              <label>数据类型</label>
              <select v-model="filters.dataType" class="input">
                <option value="">全部类型</option>
                <option value="law">法律法规</option>
                <option value="case">裁判案例</option>
                <option value="treaty">国际条约</option>
                <option value="arbitration">仲裁裁决</option>
              </select>
            </div>

            <div class="filter-group">
              <label>生效时间</label>
              <select v-model="filters.effectiveTime" class="input">
                <option value="">不限</option>
                <option value="current">现行有效</option>
                <option value="recent">近3年</option>
                <option value="year">近1年</option>
              </select>
            </div>

            <div class="filter-group">
              <label>效力层级</label>
              <select v-model="filters.hierarchy" class="input">
                <option value="">不限</option>
                <option value="high">法律</option>
                <option value="medium">行政法规</option>
                <option value="low">部门规章</option>
              </select>
            </div>

            <button class="btn btn-primary" style="width: 100%" @click="applyFilters">
              应用筛选
            </button>
          </div>
        </div>

        <div class="search-main">
          <div class="card search-box">
            <div class="search-input-wrapper">
              <input
                v-model="searchQuery"
                type="text"
                class="input search-input"
                placeholder="输入关键词、法条编号、案号、条约名称等..."
                @keydown.enter="performSearch"
              >
              <button class="btn btn-primary search-btn" @click="performSearch">
                搜索
              </button>
            </div>

            <div class="search-tags">
              <span class="tag-label">热门搜索：</span>
              <span
                v-for="tag in hotTags"
                :key="tag"
                class="search-tag"
                @click="searchQuery = tag; performSearch()"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div v-if="searchResults.length > 0" class="search-results">
            <div class="results-header">
              <span class="results-count">找到 {{ searchResults.length }} 条结果</span>
              <select v-model="sortBy" class="input sort-select">
                <option value="relevance">按相关性</option>
                <option value="date">按时间</option>
                <option value="authority">按权威性</option>
              </select>
            </div>

            <div class="result-list">
              <div
                v-for="(result, index) in searchResults"
                :key="index"
                class="result-item"
                @click="showDetail(result)"
              >
                <div class="result-type">
                  <span class="badge" :class="getTypeBadgeClass(result.type)">
                    {{ result.type }}
                  </span>
                  <span class="result-jurisdiction">{{ result.jurisdiction }}</span>
                </div>
                <h4 class="result-title">{{ result.title }}</h4>
                <p class="result-summary">{{ result.summary }}</p>
                <div class="result-meta">
                  <span class="meta-item">{{ result.date }}</span>
                  <span class="meta-item">{{ result.source }}</span>
                  <span class="meta-item">{{ result.status }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="hasSearched" class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>未找到相关结果</h3>
            <p>请尝试调整搜索关键词或筛选条件</p>
          </div>

          <div v-else class="search-placeholder">
            <div class="placeholder-icon">⚖️</div>
            <h3>开始您的法律检索</h3>
            <p>输入关键词或选择筛选条件，开始检索涉外法律信息</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedResult" class="modal-overlay" @click="closeDetail">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedResult.title }}</h3>
          <button class="close-btn" @click="closeDetail">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-meta">
            <span class="badge" :class="getTypeBadgeClass(selectedResult.type)">
              {{ selectedResult.type }}
            </span>
            <span class="detail-jurisdiction">{{ selectedResult.jurisdiction }}</span>
            <span class="detail-date">{{ selectedResult.date }}</span>
            <span class="detail-status">{{ selectedResult.status }}</span>
          </div>
          <div class="detail-content">
            <h4>内容摘要</h4>
            <p>{{ selectedResult.summary }}</p>
            <h4>核心要点</h4>
            <ul>
              <li v-for="(point, index) in selectedResult.keyPoints" :key="index">
                {{ point }}
              </li>
            </ul>
            <h4>相关依据</h4>
            <div class="references">
              <div v-for="(ref, index) in selectedResult.references" :key="index" class="ref-item">
                {{ ref }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDetail">关闭</button>
          <button class="btn btn-primary" @click="exportResult">导出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchMode = ref('basic')
const searchQuery = ref('')
const hasSearched = ref(false)
const sortBy = ref('relevance')
const selectedResult = ref(null)

const filters = ref({
  jurisdiction: '',
  dataType: '',
  effectiveTime: '',
  hierarchy: ''
})

const hotTags = ref([
  '蒙古国投资法',
  '中俄贸易协定',
  '涉外仲裁',
  '外国法查明',
  '跨境数据合规'
])

const searchResults = ref([])

const mockResults = [
  {
    type: '法律法规',
    jurisdiction: '蒙古国',
    title: '蒙古国投资法',
    summary: '规定了外国投资者在蒙古国的投资准入、投资保护、优惠政策等内容，为外国投资提供法律保障。',
    date: '2023-01-15',
    source: '蒙古国国家大呼拉尔',
    status: '现行有效',
    keyPoints: [
      '外国投资者享有与蒙古国投资者同等的待遇',
      '在特定区域和行业可享受税收减免',
      '明确了投资争议的解决机制',
      '规定了外汇管理和利润汇出规则'
    ],
    references: [
      '蒙古国投资法第3-15条',
      '《中蒙双边投资保护协定》',
      '蒙古国财政部关于投资优惠政策的通知'
    ]
  },
  {
    type: '国际条约',
    jurisdiction: '国际公约',
    title: '中华人民共和国和俄罗斯联邦关于相互促进和保护投资的协定',
    summary: '为中俄两国投资者提供投资保护，促进双边投资合作，明确投资争议解决机制。',
    date: '2022-06-10',
    source: '中华人民共和国外交部',
    status: '现行有效',
    keyPoints: [
      '相互给予最惠国待遇',
      '保障投资收益的自由汇出',
      '规定了征收补偿标准',
      '明确了投资争议的仲裁解决方式'
    ],
    references: [
      '协定全文第1-12条',
      '中俄投资合作联合声明',
      '商务部关于实施该协定的通知'
    ]
  },
  {
    type: '裁判案例',
    jurisdiction: '中国',
    title: '（2023）最高法民申字第1234号 涉外合同纠纷案',
    summary: '涉及中俄跨境贸易合同纠纷，法院适用《联合国国际货物销售合同公约》进行裁判。',
    date: '2023-08-20',
    source: '最高人民法院',
    status: '已生效',
    keyPoints: [
      '确认了CISG的适用条件',
      '明确了跨境贸易合同的解释规则',
      '分析了违约责任的认定标准',
      '确定了损害赔偿的计算方法'
    ],
    references: [
      '《联合国国际货物销售合同公约》',
      '《中华人民共和国涉外民事关系法律适用法》',
      '最高人民法院关于适用涉外民事关系法律适用法若干问题的解释'
    ]
  },
  {
    type: '仲裁裁决',
    jurisdiction: '国际仲裁',
    title: 'CIETAC 2023-A-001号 中蒙投资争议仲裁案',
    summary: '中国国际经济贸易仲裁委员会审理的中蒙投资争议案件，涉及蒙古国矿业投资纠纷。',
    date: '2023-11-05',
    source: '中国国际经济贸易仲裁委员会',
    status: '已裁决',
    keyPoints: [
      '认定了投资协议的有效性',
      '分析了蒙古国投资政策的适用',
      '确定了违约赔偿金额',
      '明确了裁决的执行程序'
    ],
    references: [
      '《中蒙双边投资保护协定》',
      '蒙古国投资法',
      'CIETAC仲裁规则'
    ]
  },
  {
    type: '法律法规',
    jurisdiction: '俄罗斯',
    title: '俄罗斯联邦外国投资法',
    summary: '规范外国投资者在俄罗斯的投资活动，明确投资准入、保护、优惠政策等。',
    date: '2023-03-01',
    source: '俄罗斯联邦国家杜马',
    status: '现行有效',
    keyPoints: [
      '外国投资的准入程序',
      '战略领域的投资限制',
      '投资争议的解决机制',
      '税收优惠政策'
    ],
    references: [
      '俄罗斯联邦外国投资法全文',
      '俄罗斯联邦政府关于实施外国投资法的决议',
      '中俄投资合作谅解备忘录'
    ]
  }
]

const performSearch = () => {
  hasSearched.value = true
  searchResults.value = mockResults.filter(result => {
    const query = searchQuery.value.toLowerCase()
    return result.title.toLowerCase().includes(query) ||
           result.summary.toLowerCase().includes(query)
  })
}

const applyFilters = () => {
  performSearch()
}

const getTypeBadgeClass = (type) => {
  const classMap = {
    '法律法规': 'badge-info',
    '国际条约': 'badge-success',
    '裁判案例': 'badge-warning',
    '仲裁裁决': 'badge-danger'
  }
  return classMap[type] || 'badge-info'
}

const showDetail = (result) => {
  selectedResult.value = result
}

const closeDetail = () => {
  selectedResult.value = null
}

const exportResult = () => {
  alert('导出功能开发中...')
}
</script>

<style scoped>
.search-page {
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

.search-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
}

.search-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-filters h3 {
  font-size: 16px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
}

.filter-group {
  margin-bottom: 16px;
}

.filter-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.mode-selector {
  display: flex;
  gap: 8px;
}

.mode-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
}

.mode-btn:hover {
  border-color: #667eea;
}

.mode-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.search-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-box {
  padding: 24px;
}

.search-input-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 14px 20px;
  font-size: 15px;
  border: 2px solid #e0e0e0;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
}

.search-btn {
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 600;
}

.search-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-label {
  font-size: 13px;
  color: #666;
}

.search-tag {
  padding: 6px 14px;
  background: #f8f9ff;
  border-radius: 16px;
  font-size: 13px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-tag:hover {
  background: #667eea;
  color: white;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

.results-count {
  font-size: 14px;
  color: #666;
}

.sort-select {
  padding: 6px 12px;
  font-size: 13px;
  width: auto;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.result-type {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.result-jurisdiction {
  font-size: 12px;
  color: #666;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.result-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.result-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: #999;
}

.no-results,
.search-placeholder {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.no-results-icon,
.placeholder-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-results h3,
.search-placeholder h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #666;
}

.no-results p,
.search-placeholder p {
  font-size: 14px;
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

@media (max-width: 1024px) {
  .search-layout {
    grid-template-columns: 1fr;
  }

  .search-sidebar {
    display: none;
  }
}
</style>
