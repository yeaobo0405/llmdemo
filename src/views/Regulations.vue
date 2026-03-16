<template>
  <div class="regulations-page">
    <div class="container">
      <div class="page-header">
        <div class="header-left">
          <span class="page-icon">📋</span>
          <h2>法规检索</h2>
        </div>
      </div>

      <div class="search-layout">
        <div class="filter-sidebar">
          <div class="filter-section">
            <div class="filter-header" @click="toggleFilter('publishDate')">
              <span>发布日期</span>
              <span class="arrow">{{ filters.publishDate.expanded ? '∧' : '∨' }}</span>
            </div>
            <div v-show="filters.publishDate.expanded" class="filter-content">
              <div class="date-range">
                <input type="date" v-model="filters.publishDate.start" class="date-input" placeholder="开始时间">
                <span class="separator">-</span>
                <input type="date" v-model="filters.publishDate.end" class="date-input" placeholder="结束时间">
              </div>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-header" @click="toggleFilter('effectiveDate')">
              <span>施行日期</span>
              <span class="arrow">{{ filters.effectiveDate.expanded ? '∧' : '∨' }}</span>
            </div>
            <div v-show="filters.effectiveDate.expanded" class="filter-content">
              <div class="date-range">
                <input type="date" v-model="filters.effectiveDate.start" class="date-input" placeholder="开始时间">
                <span class="separator">-</span>
                <input type="date" v-model="filters.effectiveDate.end" class="date-input" placeholder="结束时间">
              </div>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-header" @click="toggleFilter('hierarchy')">
              <span>效力位阶</span>
              <span class="arrow">{{ filters.hierarchy.expanded ? '∧' : '∨' }}</span>
            </div>
            <div v-show="filters.hierarchy.expanded" class="filter-content">
              <input type="text" v-model="filters.hierarchy.search" class="search-input" placeholder="输入关键字进行过滤">
              <div class="checkbox-list">
                <div v-for="item in hierarchyOptions" :key="item.id" class="checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="item.selected">
                    <span v-if="item.children" class="expand-icon" @click.stop="toggleHierarchy(item)">
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
            <div class="filter-header" @click="toggleFilter('validity')">
              <span>时效性</span>
              <span class="arrow">{{ filters.validity.expanded ? '∧' : '∨' }}</span>
            </div>
            <div v-show="filters.validity.expanded" class="filter-content">
              <div class="checkbox-list">
                <div v-for="item in validityOptions" :key="item.id" class="checkbox-item">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="item.selected">
                    <span>{{ item.label }}</span>
                    <span class="item-count">{{ item.count }}万条</span>
                  </label>
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
            <button class="tab-btn active">精准匹配</button>
            <button class="tab-btn">智能检索</button>
          </div>

          <div class="search-bar">
            <select v-model="searchField" class="field-select">
              <option value="title">标题</option>
              <option value="content">全文</option>
              <option value="keyword">关键词</option>
            </select>
            <input type="text" v-model="searchQuery" class="search-input" placeholder="请输入检索关键词...">
            <button class="btn-search" @click="handleSearch">搜索</button>
          </div>

          <div class="search-results">
            <div class="results-header">
              <h3>相关法规</h3>
              <div class="sort-options">
                <button class="sort-btn" @click="sortBy = 'publishDate'; sortOrder = -sortOrder">
                  发布日期 {{ sortBy === 'publishDate' ? (sortOrder > 0 ? '∧' : '∨') : '' }}
                </button>
                <button class="sort-btn" @click="sortBy = 'effectiveDate'; sortOrder = -sortOrder">
                  施行日期 {{ sortBy === 'effectiveDate' ? (sortOrder > 0 ? '∧' : '∨') : '' }}
                </button>
              </div>
            </div>

            <div class="result-group">
              <div class="group-header">
                <span class="group-title">❘ 宪法</span>
                <span class="group-count">共{{ regulations.length }}条</span>
              </div>
              <div class="result-list">
                <div
                  v-for="item in regulations"
                  :key="item.id"
                  class="result-item"
                  @click="viewDetail(item)"
                >
                  <h4 class="result-title">{{ item.title }}</h4>
                  <div class="result-meta">
                    <span class="status-tag" :class="item.status">{{ item.status }}</span>
                    <span class="meta-item">{{ item.organization }}</span>
                    <span class="meta-item">发布日期：{{ item.publishDate }}</span>
                    <span class="meta-item">施行日期：{{ item.effectiveDate }}</span>
                  </div>
                </div>
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
            <p><strong>发布机关：</strong>{{ selectedItem?.organization }}</p>
            <p><strong>发布日期：</strong>{{ selectedItem?.publishDate }}</p>
            <p><strong>施行日期：</strong>{{ selectedItem?.effectiveDate }}</p>
            <p><strong>时效性：</strong>{{ selectedItem?.status }}</p>
          </div>
          <div class="detail-content">
            <p>{{ selectedItem?.content }}</p>
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
const searchField = ref('title')
const sortBy = ref('publishDate')
const sortOrder = ref(-1)
const showDetail = ref(false)
const selectedItem = ref(null)

const filters = reactive({
  publishDate: { expanded: false, start: '', end: '' },
  effectiveDate: { expanded: false, start: '', end: '' },
  hierarchy: { expanded: true, search: '' },
  validity: { expanded: false }
})

const toggleFilter = (filterName) => {
  filters[filterName].expanded = !filters[filterName].expanded
}

const toggleHierarchy = (item) => {
  item.expanded = !item.expanded
}

const hierarchyOptions = ref([
  { id: 1, label: '宪法', count: 8, selected: false, expanded: false },
  { 
    id: 2, 
    label: '法律', 
    count: 273, 
    selected: false, 
    expanded: false,
    children: [
      { id: 21, label: '民事法律', count: 45, selected: false },
      { id: 22, label: '刑事法律', count: 12, selected: false },
      { id: 23, label: '行政法律', count: 89, selected: false },
      { id: 24, label: '经济法律', count: 127, selected: false }
    ]
  },
  { 
    id: 3, 
    label: '行政法规', 
    count: 518, 
    selected: false, 
    expanded: false,
    children: [
      { id: 31, label: '国务院条例', count: 256, selected: false },
      { id: 32, label: '国务院规定', count: 262, selected: false }
    ]
  },
  { id: 4, label: '政党和组织文件', count: 15, selected: false, expanded: false },
  { 
    id: 5, 
    label: '地方性法规', 
    count: 1028, 
    selected: false, 
    expanded: false,
    children: [
      { id: 51, label: '北京市', count: 218, selected: false },
      { id: 52, label: '上海市', count: 195, selected: false },
      { id: 53, label: '广东省', count: 245, selected: false },
      { id: 54, label: '浙江省', count: 180, selected: false },
      { id: 55, label: '江苏省', count: 190, selected: false }
    ]
  }
])

const validityOptions = ref([
  { id: 1, label: '有效', count: 1189, selected: false },
  { id: 2, label: '尚未生效', count: 12, selected: false },
  { id: 3, label: '已修改', count: 256, selected: false },
  { id: 4, label: '已废止', count: 89, selected: false },
  { id: 5, label: '其他', count: 5, selected: false }
])

const regulations = ref([
  {
    id: 1,
    title: '中华人民共和国宪法（2018 年修正文本）',
    organization: '全国人民代表大会',
    publishDate: '2018-03-11',
    effectiveDate: '2018-03-11',
    status: '有效',
    content: '中华人民共和国宪法是国家的根本法，具有最高的法律效力。宪法规定了国家的根本制度和根本任务，是治国安邦的总章程。'
  },
  {
    id: 2,
    title: '中华人民共和国宪法修正案（2018 年）',
    organization: '全国人民代表大会',
    publishDate: '2018-03-11',
    effectiveDate: '2018-03-11',
    status: '有效',
    content: '宪法修正案（2018 年）对宪法进行了部分修改，主要包括：确立科学发展观、习近平新时代中国特色社会主义思想在国家政治和社会生活中的指导地位等。'
  },
  {
    id: 3,
    title: '中华人民共和国宪法修正案（2004 年）',
    organization: '全国人民代表大会',
    publishDate: '2004-03-14',
    effectiveDate: '2004-03-14',
    status: '已修改',
    content: '宪法修正案（2004 年）主要内容包括："三个代表"重要思想写入宪法，完善土地征用制度，进一步明确国家对发展非公有制经济的方针等。'
  },
  {
    id: 4,
    title: '中华人民共和国宪法修正案（1999 年）',
    organization: '全国人民代表大会',
    publishDate: '1999-03-15',
    effectiveDate: '1999-03-15',
    status: '已修改',
    content: '宪法修正案（1999 年）将邓小平理论写入宪法，规定中华人民共和国实行依法治国，建设社会主义法治国家。'
  },
  {
    id: 5,
    title: '中华人民共和国宪法修正案（1993 年）',
    organization: '全国人民代表大会',
    publishDate: '1993-03-29',
    effectiveDate: '1993-03-29',
    status: '已修改',
    content: '宪法修正案（1993 年）将"我国正处于社会主义初级阶段"写入宪法，规定国家实行社会主义市场经济。'
  },
  {
    id: 6,
    title: '中华人民共和国宪法修正案（1988 年）',
    organization: '全国人民代表大会',
    publishDate: '1988-04-11',
    effectiveDate: '1988-04-11',
    status: '已修改',
    content: '宪法修正案（1988 年）规定国家允许私营经济在法律规定的范围内存在和发展，土地的使用权可以依照法律的规定转让。'
  }
])

const resetFilters = () => {
  filters.publishDate.start = ''
  filters.publishDate.end = ''
  filters.effectiveDate.start = ''
  filters.effectiveDate.end = ''
  filters.hierarchy.search = ''
  hierarchyOptions.value.forEach(item => {
    item.selected = false
    item.expanded = false
    if (item.children) {
      item.children.forEach(child => child.selected = false)
    }
  })
  validityOptions.value.forEach(item => {
    item.selected = false
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
.regulations-page {
  min-height: calc(100vh - 120px);
  background: #f5f7fa;
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

.field-select {
  padding: 12px 16px;
  border: none;
  border-right: 1px solid #d9d9d9;
  background: #fafafa;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  outline: none;
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

.result-group {
  margin-bottom: 24px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.group-title {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.group-count {
  font-size: 13px;
  color: #999;
  margin-left: auto;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  padding: 16px;
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

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.有效 {
  background: #e6f7ff;
  color: #1890ff;
}

.status-tag.已修改 {
  background: #fff7e6;
  color: #fa8c16;
}

.status-tag.已废止 {
  background: #fff1f0;
  color: #f5222d;
}

.status-tag.尚未生效 {
  background: #f6ffed;
  color: #52c41a;
}

.meta-item {
  font-size: 13px;
  color: #999;
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

.detail-content {
  line-height: 1.8;
  font-size: 14px;
  color: #333;
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
