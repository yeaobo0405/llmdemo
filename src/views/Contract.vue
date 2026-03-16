<template>
  <div class="contract-page">
    <div class="container">
      <div class="page-header">
        <h2>涉外合同智能审查与跨境合规风险防控</h2>
        <p>多语种、跨法域的涉外合同智能审查与合规防控平台</p>
      </div>

      <div class="contract-layout">
        <div class="contract-sidebar">
          <div class="card">
            <h3>合同类型</h3>
            <div class="contract-types">
              <button
                v-for="type in contractTypes"
                :key="type.id"
                class="contract-type-btn"
                :class="{ active: selectedContractType === type.id }"
                @click="selectContractType(type.id)"
              >
                <span class="type-icon">{{ type.icon }}</span>
                <span class="type-name">{{ type.name }}</span>
              </button>
            </div>
          </div>

          <div class="card">
            <h3>审查维度</h3>
            <div class="review-dimensions">
              <label v-for="dim in reviewDimensions" :key="dim.id" class="dimension-item">
                <input
                  type="checkbox"
                  v-model="selectedDimensions"
                  :value="dim.id"
                >
                <span class="dimension-label">{{ dim.name }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="contract-main">
          <div class="card contract-upload">
            <div class="upload-section" v-if="!contractContent">
              <div class="upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
                <div class="upload-icon">📄</div>
                <h3>上传合同文件</h3>
                <p>拖拽文件到此处或点击上传</p>
                <p class="upload-hint">支持 PDF、DOC、DOCX、TXT 格式，最大 10MB</p>
                <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" accept=".pdf,.doc,.docx,.txt">
              </div>

              <div class="or-divider">
                <span>或</span>
              </div>

              <div class="paste-section">
                <h4>粘贴合同内容</h4>
                <textarea
                  v-model="pastedContent"
                  class="textarea paste-textarea"
                  placeholder="在此粘贴合同文本内容..."
                  rows="8"
                ></textarea>
                <button class="btn btn-primary" @click="loadPastedContent" :disabled="!pastedContent.trim()">
                  开始审查
                </button>
              </div>
            </div>

            <div v-else class="contract-content">
              <div class="content-header">
                <div class="header-left">
                  <h3>{{ contractFileName }}</h3>
                  <span class="badge badge-info">{{ contractType }}</span>
                </div>
                <div class="header-right">
                  <button class="btn btn-secondary" @click="resetContract">重新上传</button>
                  <button class="btn btn-primary" @click="startReview" :disabled="isReviewing">
                    {{ isReviewing ? '审查中...' : '开始审查' }}
                  </button>
                </div>
              </div>

              <div class="content-preview">
                <div class="preview-header">
                  <h4>合同内容预览</h4>
                  <div class="preview-actions">
                    <button class="action-btn" @click="expandAll">展开全部</button>
                    <button class="action-btn" @click="collapseAll">收起全部</button>
                  </div>
                </div>
                <div class="preview-content">
                  {{ contractContent.substring(0, 500) }}...
                </div>
              </div>
            </div>
          </div>

          <div v-if="reviewResult" class="card review-result">
            <div class="result-header">
              <h3>审查结果</h3>
              <div class="result-summary">
                <div class="summary-item high">
                  <span class="summary-label">高风险</span>
                  <span class="summary-value">{{ reviewResult.highRisk }}</span>
                </div>
                <div class="summary-item medium">
                  <span class="summary-label">中风险</span>
                  <span class="summary-value">{{ reviewResult.mediumRisk }}</span>
                </div>
                <div class="summary-item low">
                  <span class="summary-label">低风险</span>
                  <span class="summary-value">{{ reviewResult.lowRisk }}</span>
                </div>
                <div class="summary-item total">
                  <span class="summary-label">总计</span>
                  <span class="summary-value">{{ reviewResult.total }}</span>
                </div>
              </div>
            </div>

            <div class="result-content">
              <div
                v-for="(issue, index) in reviewResult.issues"
                :key="index"
                class="issue-item"
                :class="issue.level"
              >
                <div class="issue-header">
                  <div class="issue-title">
                    <span class="issue-icon">{{ getIssueIcon(issue.level) }}</span>
                    <span>{{ issue.title }}</span>
                  </div>
                  <span class="badge" :class="getIssueBadgeClass(issue.level)">
                    {{ issue.level }}
                  </span>
                </div>
                <div class="issue-location">
                  <strong>位置：</strong>{{ issue.location }}
                </div>
                <div class="issue-description">
                  <strong>问题描述：</strong>{{ issue.description }}
                </div>
                <div class="issue-legal-basis">
                  <strong>法律依据：</strong>{{ issue.legalBasis }}
                </div>
                <div class="issue-suggestion">
                  <strong>修订建议：</strong>{{ issue.suggestion }}
                </div>
                <div class="issue-actions">
                  <button class="btn btn-secondary" @click="viewDetail(issue)">查看详情</button>
                  <button class="btn btn-primary" @click="applySuggestion(issue)">应用建议</button>
                </div>
              </div>
            </div>

            <div class="result-footer">
              <button class="btn btn-secondary" @click="exportReport">导出审查报告</button>
              <button class="btn btn-primary" @click="generateRevisedContract">生成修订版合同</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>问题详情</h3>
          <button class="close-btn" @click="showDetailModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h4>问题标题</h4>
            <p>{{ selectedIssue?.title }}</p>
          </div>
          <div class="detail-section">
            <h4>风险等级</h4>
            <span class="badge" :class="getIssueBadgeClass(selectedIssue?.level)">
              {{ selectedIssue?.level }}
            </span>
          </div>
          <div class="detail-section">
            <h4>位置</h4>
            <p>{{ selectedIssue?.location }}</p>
          </div>
          <div class="detail-section">
            <h4>问题描述</h4>
            <p>{{ selectedIssue?.description }}</p>
          </div>
          <div class="detail-section">
            <h4>法律依据</h4>
            <p>{{ selectedIssue?.legalBasis }}</p>
          </div>
          <div class="detail-section">
            <h4>修订建议</h4>
            <p>{{ selectedIssue?.suggestion }}</p>
          </div>
          <div class="detail-section">
            <h4>参考案例</h4>
            <ul>
              <li v-for="(ref, index) in selectedIssue?.references" :key="index">
                {{ ref }}
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDetailModal = false">关闭</button>
          <button class="btn btn-primary" @click="applySuggestion(selectedIssue)">应用建议</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedContractType = ref('trade')
const selectedDimensions = ref(['legal', 'compliance', 'risk'])
const pastedContent = ref('')
const contractContent = ref('')
const contractFileName = ref('')
const contractType = ref('')
const isReviewing = ref(false)
const reviewResult = ref(null)
const showDetailModal = ref(false)
const selectedIssue = ref(null)

const contractTypes = ref([
  { id: 'trade', name: '跨境贸易合同', icon: '🌐' },
  { id: 'investment', name: '投资合同', icon: '💼' },
  { id: 'mining', name: '矿产开发合同', icon: '⛏️' },
  { id: 'data', name: '数据跨境合同', icon: '📊' },
  { id: 'service', name: '服务合同', icon: '🤝' }
])

const reviewDimensions = ref([
  { id: 'legal', name: '法律合规性' },
  { id: 'compliance', name: '跨境合规' },
  { id: 'risk', name: '风险防控' },
  { id: 'terms', name: '条款公平性' },
  { id: 'language', name: '语言准确性' }
])

const selectContractType = (typeId) => {
  selectedContractType.value = typeId
}

const triggerFileUpload = () => {
  document.querySelector('input[type="file"]').click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file) => {
  contractFileName.value = file.name
  contractType.value = contractTypes.value.find(t => t.id === selectedContractType.value)?.name || '合同'
  contractContent.value = `【${file.name}】\n\n合同内容已加载，包含以下主要条款：\n\n1. 合同主体\n2. 合同标的\n3. 价格条款\n4. 交付条款\n5. 质量标准\n6. 违约责任\n7. 争议解决\n8. 适用法律\n\n（此处为模拟的合同内容）`
}

const loadPastedContent = () => {
  if (pastedContent.value.trim()) {
    contractFileName.value = '粘贴的合同内容'
    contractType.value = contractTypes.value.find(t => t.id === selectedContractType.value)?.name || '合同'
    contractContent.value = pastedContent.value
    pastedContent.value = ''
  }
}

const resetContract = () => {
  contractContent.value = ''
  contractFileName.value = ''
  contractType.value = ''
  reviewResult.value = null
}

const startReview = () => {
  isReviewing.value = true
  setTimeout(() => {
    reviewResult.value = generateMockReviewResult()
    isReviewing.value = false
  }, 2000)
}

const generateMockReviewResult = () => {
  return {
    highRisk: 2,
    mediumRisk: 3,
    lowRisk: 4,
    total: 9,
    issues: [
      {
        title: '争议解决条款不明确',
        level: '高风险',
        location: '第7条 争议解决',
        description: '合同中仅约定"协商解决"，未明确仲裁机构或管辖法院，可能导致争议解决困难。',
        legalBasis: '《中华人民共和国仲裁法》第16条；《联合国国际货物销售合同公约》第74条',
        suggestion: '建议明确约定仲裁机构（如中国国际经济贸易仲裁委员会）或管辖法院，并约定仲裁规则和适用法律。',
        references: [
          '（2022）最高法民申字第1234号',
          'CIETAC 2023-A-001号仲裁案'
        ]
      },
      {
        title: '适用法律条款缺失',
        level: '高风险',
        location: '第8条 适用法律',
        description: '合同未明确约定适用的法律，在发生争议时可能面临法律适用的不确定性。',
        legalBasis: '《中华人民共和国涉外民事关系法律适用法》第41条',
        suggestion: '建议增加适用法律条款，明确约定适用中国法律、蒙古国法律或国际公约。',
        references: [
          '《中蒙双边贸易协定》第5条'
        ]
      },
      {
        title: '违约责任条款过于笼统',
        level: '中风险',
        location: '第6条 违约责任',
        description: '违约责任条款仅约定"承担相应责任"，未明确具体的违约金计算方式和赔偿范围。',
        legalBasis: '《中华人民共和国民法典》第585条',
        suggestion: '建议明确违约金的计算方式、赔偿范围及上限，增加可执行性。',
        references: []
      },
      {
        title: '外汇支付条款不完整',
        level: '中风险',
        location: '第3条 价格条款',
        description: '合同未明确外汇支付的币种、汇率确定方式及汇率风险承担方。',
        legalBasis: '《中华人民共和国外汇管理条例》；蒙古国《外汇管理法》',
        suggestion: '建议明确支付币种、汇率确定方式（如支付日中国银行外汇牌价中间价）及汇率风险承担。',
        references: []
      },
      {
        title: '质量标准引用不明确',
        level: '中风险',
        location: '第5条 质量标准',
        description: '质量标准条款引用"相关国家标准"，未明确具体的标准编号和版本。',
        legalBasis: '《中华人民共和国产品质量法》',
        suggestion: '建议明确引用具体的标准编号和版本，如GB/T XXXX-XXXX。',
        references: []
      },
      {
        title: '交付期限表述模糊',
        level: '低风险',
        location: '第4条 交付条款',
        description: '交付期限表述为"合理期限内"，缺乏明确的时间界定。',
        legalBasis: '《中华人民共和国民法典》第509条',
        suggestion: '建议明确具体的交付期限，如"合同签订后30日内"。',
        references: []
      },
      {
        title: '合同主体信息不完整',
        level: '低风险',
        location: '第1条 合同主体',
        description: '合同中未完整列明双方主体的注册地址、法定代表人等基本信息。',
        legalBasis: '《中华人民共和国民法典》',
        suggestion: '建议补充完整的主体信息，包括注册地址、法定代表人、联系方式等。',
        references: []
      },
      {
        title: '通知条款缺失',
        level: '低风险',
        location: '合同条款',
        description: '合同中未约定双方的通知方式和送达地址。',
        legalBasis: '《中华人民共和国民法典》',
        suggestion: '建议增加通知条款，明确通知方式、送达地址及送达效力。',
        references: []
      },
      {
        title: '不可抗力条款过于简单',
        level: '低风险',
        location: '合同条款',
        description: '不可抗力条款仅简单列举，未明确通知义务、减损义务等。',
        legalBasis: '《中华人民共和国民法典》第590条',
        suggestion: '建议完善不可抗力条款，明确通知义务、减损义务、合同解除条件等。',
        references: []
      }
    ]
  }
}

const getIssueIcon = (level) => {
  const iconMap = {
    '高风险': '🔴',
    '中风险': '🟡',
    '低风险': '🟢'
  }
  return iconMap[level] || '⚪'
}

const getIssueBadgeClass = (level) => {
  const classMap = {
    '高风险': 'badge-danger',
    '中风险': 'badge-warning',
    '低风险': 'badge-success'
  }
  return classMap[level] || 'badge-info'
}

const viewDetail = (issue) => {
  selectedIssue.value = issue
  showDetailModal.value = true
}

const applySuggestion = (issue) => {
  alert(`已应用修订建议：${issue.title}`)
}

const expandAll = () => {
  alert('展开全部功能开发中...')
}

const collapseAll = () => {
  alert('收起全部功能开发中...')
}

const exportReport = () => {
  alert('导出审查报告功能开发中...')
}

const generateRevisedContract = () => {
  alert('生成修订版合同功能开发中...')
}
</script>

<style scoped>
.contract-page {
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

.contract-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
}

.contract-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contract-sidebar h3 {
  font-size: 16px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
}

.contract-types {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contract-type-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
}

.contract-type-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.contract-type-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.type-icon {
  font-size: 20px;
}

.type-name {
  font-size: 14px;
  font-weight: 500;
}

.review-dimensions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dimension-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.dimension-item:hover {
  background: #f8f9ff;
}

.dimension-item input[type="checkbox"] {
  cursor: pointer;
}

.dimension-label {
  font-size: 14px;
  color: #333;
}

.contract-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contract-upload {
  display: flex;
  flex-direction: column;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.upload-area {
  text-align: center;
  padding: 60px 20px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-area h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.upload-area p {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.or-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #999;
  font-size: 14px;
}

.or-divider::before,
.or-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.paste-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.paste-textarea {
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
}

.contract-content {
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  gap: 12px;
}

.content-preview {
  padding: 20px;
  background: #f8f9ff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.preview-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.preview-content {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  white-space: pre-wrap;
}

.review-result {
  display: flex;
  flex-direction: column;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.result-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.result-summary {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  min-width: 80px;
}

.summary-item.high {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%);
  border: 1px solid #dc3545;
}

.summary-item.medium {
  background: linear-gradient(135deg, #fffbf0 0%, #fff3cd 100%);
  border: 1px solid #ffc107;
}

.summary-item.low {
  background: linear-gradient(135deg, #f0fff4 0%, #d4edda 100%);
  border: 1px solid #28a745;
}

.summary-item.total {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
  border: 1px solid #667eea;
}

.summary-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
}

.summary-item.high .summary-value {
  color: #dc3545;
}

.summary-item.medium .summary-value {
  color: #ffc107;
}

.summary-item.low .summary-value {
  color: #28a745;
}

.summary-item.total .summary-value {
  color: #667eea;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.issue-item {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.issue-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.issue-item.high {
  border-left: 4px solid #dc3545;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%);
}

.issue-item.medium {
  border-left: 4px solid #ffc107;
  background: linear-gradient(135deg, #fffbf0 0%, #fff3cd 100%);
}

.issue-item.low {
  border-left: 4px solid #28a745;
  background: linear-gradient(135deg, #f0fff4 0%, #d4edda 100%);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.issue-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.issue-icon {
  font-size: 20px;
}

.issue-location,
.issue-description,
.issue-legal-basis,
.issue-suggestion {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  color: #666;
}

.issue-location strong,
.issue-description strong,
.issue-legal-basis strong,
.issue-suggestion strong {
  color: #333;
}

.issue-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.result-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
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
  max-width: 700px;
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

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.detail-section p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.detail-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-section li {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  padding-left: 20px;
  position: relative;
  margin-bottom: 8px;
}

.detail-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 1024px) {
  .contract-layout {
    grid-template-columns: 1fr;
  }

  .contract-sidebar {
    display: none;
  }
}
</style>
