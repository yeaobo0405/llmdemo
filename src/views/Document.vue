<template>
  <div class="document-page">
    <div class="container">
      <div class="page-header">
        <h2>涉外法律文书智能处理与生成</h2>
        <p>多语种、跨法域的法律文本全生命周期智能处理平台</p>
      </div>

      <div class="document-layout">
        <div class="document-sidebar">
          <div class="card">
            <h3>文书类型</h3>
            <div class="doc-types">
              <button
                v-for="type in documentTypes"
                :key="type.id"
                class="doc-type-btn"
                :class="{ active: selectedDocType === type.id }"
                @click="selectDocType(type.id)"
              >
                <span class="type-icon">{{ type.icon }}</span>
                <span class="type-name">{{ type.name }}</span>
              </button>
            </div>
          </div>

          <div class="card">
            <h3>快速操作</h3>
            <div class="quick-actions">
              <button class="action-btn" @click="showUploadModal = true">
                <span class="action-icon">📤</span>
                <span>上传文档</span>
              </button>
              <button class="action-btn" @click="showTemplateModal = true">
                <span class="action-icon">📋</span>
                <span>选择模板</span>
              </button>
              <button class="action-btn" @click="showHistoryModal = true">
                <span class="action-icon">📚</span>
                <span>历史记录</span>
              </button>
            </div>
          </div>
        </div>

        <div class="document-main">
          <div class="card document-editor">
            <div class="editor-header">
              <div class="header-left">
                <h3>{{ currentDocTitle }}</h3>
                <span class="doc-status">{{ docStatus }}</span>
              </div>
              <div class="header-right">
                <button class="btn btn-secondary" @click="analyzeDocument">
                  <span class="btn-icon">🔍</span>
                  智能解析
                </button>
                <button class="btn btn-secondary" @click="extractInfo">
                  <span class="btn-icon">📊</span>
                  信息提取
                </button>
                <button class="btn btn-primary" @click="generateDocument">
                  <span class="btn-icon">✨</span>
                  生成文书
                </button>
              </div>
            </div>

            <div class="editor-toolbar">
              <div class="toolbar-group">
                <label>语言：</label>
                <select v-model="selectedLanguage" class="input">
                  <option value="zh">中文</option>
                  <option value="mn">蒙古语</option>
                  <option value="ru">俄语</option>
                  <option value="en">英语</option>
                </select>
              </div>
              <div class="toolbar-group">
                <label>法域：</label>
                <select v-model="selectedJurisdiction" class="input">
                  <option value="cn">中国</option>
                  <option value="mn">蒙古国</option>
                  <option value="ru">俄罗斯</option>
                  <option value="international">国际</option>
                </select>
              </div>
            </div>

            <div class="editor-content">
              <textarea
                v-model="documentContent"
                class="textarea doc-textarea"
                placeholder="在此输入或粘贴法律文书内容，或点击上方按钮进行智能操作..."
              ></textarea>
            </div>

            <div v-if="analysisResult" class="analysis-panel">
              <div class="panel-header">
                <h4>智能解析结果</h4>
                <button class="close-btn" @click="analysisResult = null">×</button>
              </div>
              <div class="panel-content">
                <div class="analysis-section">
                  <h5>文书类型</h5>
                  <p>{{ analysisResult.docType }}</p>
                </div>
                <div class="analysis-section">
                  <h5>核心要素</h5>
                  <div class="key-elements">
                    <span
                      v-for="(element, index) in analysisResult.elements"
                      :key="index"
                      class="element-tag"
                    >
                      {{ element }}
                    </span>
                  </div>
                </div>
                <div class="analysis-section">
                  <h5>法律依据</h5>
                  <ul>
                    <li v-for="(ref, index) in analysisResult.references" :key="index">
                      {{ ref }}
                    </li>
                  </ul>
                </div>
                <div class="analysis-section">
                  <h5>改进建议</h5>
                  <p>{{ analysisResult.suggestions }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card document-templates">
            <div class="templates-header">
              <h3>推荐模板</h3>
              <button class="btn btn-secondary" @click="showAllTemplates">查看全部</button>
            </div>
            <div class="templates-grid">
              <div
                v-for="template in recommendedTemplates"
                :key="template.id"
                class="template-card"
                @click="useTemplate(template)"
              >
                <div class="template-icon">{{ template.icon }}</div>
                <h4 class="template-name">{{ template.name }}</h4>
                <p class="template-desc">{{ template.description }}</p>
                <div class="template-meta">
                  <span class="badge badge-info">{{ template.language }}</span>
                  <span class="badge badge-success">{{ template.jurisdiction }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showUploadModal" class="modal-overlay" @click="showUploadModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>上传文档</h3>
          <button class="close-btn" @click="showUploadModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-area">
            <div class="upload-icon">📁</div>
            <p>拖拽文件到此处或点击上传</p>
            <p class="upload-hint">支持 PDF、DOC、DOCX、TXT 格式</p>
            <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none">
            <button class="btn btn-primary" @click="$refs.fileInput.click()">选择文件</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTemplateModal" class="modal-overlay" @click="showTemplateModal = false">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>选择模板</h3>
          <button class="close-btn" @click="showTemplateModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="template-filters">
            <select v-model="templateFilter.language" class="input">
              <option value="">全部语言</option>
              <option value="zh">中文</option>
              <option value="mn">蒙古语</option>
              <option value="ru">俄语</option>
              <option value="en">英语</option>
            </select>
            <select v-model="templateFilter.jurisdiction" class="input">
              <option value="">全部法域</option>
              <option value="cn">中国</option>
              <option value="mn">蒙古国</option>
              <option value="ru">俄罗斯</option>
              <option value="international">国际</option>
            </select>
          </div>
          <div class="all-templates-grid">
            <div
              v-for="template in allTemplates"
              :key="template.id"
              class="template-card"
              @click="useTemplate(template); showTemplateModal = false"
            >
              <div class="template-icon">{{ template.icon }}</div>
              <h4 class="template-name">{{ template.name }}</h4>
              <p class="template-desc">{{ template.description }}</p>
              <div class="template-meta">
                <span class="badge badge-info">{{ template.language }}</span>
                <span class="badge badge-success">{{ template.jurisdiction }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showHistoryModal" class="modal-overlay" @click="showHistoryModal = false">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>历史记录</h3>
          <button class="close-btn" @click="showHistoryModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="history-list">
            <div
              v-for="(item, index) in historyList"
              :key="index"
              class="history-item"
              @click="loadHistory(item)"
            >
              <div class="history-info">
                <h4>{{ item.title }}</h4>
                <div class="history-meta">
                  <span>{{ item.date }}</span>
                  <span>{{ item.type }}</span>
                  <span>{{ item.language }}</span>
                </div>
              </div>
              <button class="btn btn-secondary">加载</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedDocType = ref('litigation')
const selectedLanguage = ref('zh')
const selectedJurisdiction = ref('cn')
const documentContent = ref('')
const analysisResult = ref(null)
const showUploadModal = ref(false)
const showTemplateModal = ref(false)
const showHistoryModal = ref(false)

const documentTypes = ref([
  { id: 'litigation', name: '涉外诉讼文书', icon: '⚖️' },
  { id: 'cooperation', name: '跨境司法协作文书', icon: '🤝' },
  { id: 'verification', name: '外国法查明文书', icon: '🔎' },
  { id: 'contract', name: '合同文书', icon: '📋' },
  { id: 'compliance', name: '合规文书', icon: '✅' }
])

const currentDocTitle = computed(() => {
  const type = documentTypes.value.find(t => t.id === selectedDocType.value)
  return type ? type.name : '法律文书'
})

const docStatus = computed(() => {
  if (documentContent.value.length === 0) return '未开始'
  if (documentContent.value.length < 100) return '编辑中'
  return '已完成'
})

const recommendedTemplates = ref([
  {
    id: 1,
    name: '涉外民事起诉状',
    description: '适用于涉外民商事案件的起诉状模板',
    icon: '📄',
    language: '中文',
    jurisdiction: '中国'
  },
  {
    id: 2,
    name: '跨境司法协助请求书',
    description: '用于向外国司法机关请求司法协助的文书模板',
    icon: '🤝',
    language: '中文',
    jurisdiction: '国际'
  },
  {
    id: 3,
    name: '外国法查明申请书',
    description: '申请外国法查明的标准文书模板',
    icon: '🔎',
    language: '中文',
    jurisdiction: '中国'
  },
  {
    id: 4,
    name: '蒙古语法律意见书',
    description: '蒙古语法律意见书标准模板',
    icon: '📝',
    language: '蒙古语',
    jurisdiction: '蒙古国'
  }
])

const allTemplates = ref([
  ...recommendedTemplates.value,
  {
    id: 5,
    name: '中俄贸易合同',
    description: '中俄跨境贸易合同标准模板',
    icon: '📋',
    language: '中文',
    jurisdiction: '国际'
  },
  {
    id: 6,
    name: '俄语仲裁申请书',
    description: '俄语仲裁申请书标准模板',
    icon: '⚖️',
    language: '俄语',
    jurisdiction: '俄罗斯'
  },
  {
    id: 7,
    name: '英语涉外授权委托书',
    description: '英语涉外授权委托书模板',
    icon: '✍️',
    language: '英语',
    jurisdiction: '国际'
  },
  {
    id: 8,
    name: '蒙古语合规报告',
    description: '蒙古语合规报告模板',
    icon: '✅',
    language: '蒙古语',
    jurisdiction: '蒙古国'
  }
])

const templateFilter = ref({
  language: '',
  jurisdiction: ''
})

const historyList = ref([
  {
    title: '涉外民事起诉状 - 张三诉李四',
    date: '2024-03-12',
    type: '涉外诉讼文书',
    language: '中文'
  },
  {
    title: '跨境司法协助请求书',
    date: '2024-03-10',
    type: '跨境司法协作文书',
    language: '中文'
  },
  {
    title: '蒙古国投资法律意见书',
    date: '2024-03-08',
    type: '外国法查明文书',
    language: '蒙古语'
  },
  {
    title: '中俄贸易合同审查报告',
    date: '2024-03-05',
    type: '合同文书',
    language: '中文'
  }
])

const selectDocType = (typeId) => {
  selectedDocType.value = typeId
  documentContent.value = ''
  analysisResult.value = null
}

const analyzeDocument = () => {
  if (!documentContent.value.trim()) {
    alert('请先输入或上传文档内容')
    return
  }

  analysisResult.value = {
    docType: '涉外民事起诉状',
    elements: [
      '原告信息',
      '被告信息',
      '诉讼请求',
      '事实与理由',
      '证据清单',
      '法律依据'
    ],
    references: [
      '《中华人民共和国民事诉讼法》',
      '《中华人民共和国涉外民事关系法律适用法》',
      '《中蒙双边司法协助条约》'
    ],
    suggestions: '建议补充具体的诉讼请求金额，明确争议焦点，完善证据材料清单。'
  }
}

const extractInfo = () => {
  if (!documentContent.value.trim()) {
    alert('请先输入或上传文档内容')
    return
  }
  alert('信息提取功能开发中...')
}

const generateDocument = () => {
  if (!documentContent.value.trim()) {
    alert('请先输入或上传文档内容')
    return
  }
  alert('文书生成功能开发中...')
}

const useTemplate = (template) => {
  documentContent.value = `【${template.name}】\n\n【文书编号】\n\n【当事人信息】\n\n【正文内容】\n\n【法律依据】\n\n【附件】`
}

const showAllTemplates = () => {
  showTemplateModal.value = true
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    alert(`已选择文件：${file.name}`)
    showUploadModal.value = false
  }
}

const loadHistory = (item) => {
  documentContent.value = `【${item.title}】\n\n（历史记录内容）`
  showHistoryModal.value = false
}
</script>

<style scoped>
.document-page {
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

.document-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
}

.document-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.document-sidebar h3 {
  font-size: 16px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
}

.doc-types {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-type-btn {
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

.doc-type-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.doc-type-btn.active {
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

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
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
  font-size: 14px;
}

.action-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.action-icon {
  font-size: 18px;
}

.document-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.document-editor {
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.doc-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #e0e0e0;
  color: #666;
}

.header-right {
  display: flex;
  gap: 12px;
}

.btn-icon {
  margin-right: 4px;
}

.editor-toolbar {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f8f9ff;
  border-radius: 8px;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-group label {
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.toolbar-group .input {
  padding: 6px 12px;
  font-size: 13px;
  width: auto;
}

.editor-content {
  margin-bottom: 16px;
}

.doc-textarea {
  min-height: 300px;
  font-family: 'Courier New', monospace;
  line-height: 1.8;
}

.analysis-panel {
  padding: 20px;
  background: #f8f9ff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.analysis-section h5 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.analysis-section p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.key-elements {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.element-tag {
  padding: 4px 12px;
  background: white;
  border: 1px solid #667eea;
  border-radius: 16px;
  font-size: 12px;
  color: #667eea;
}

.analysis-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.analysis-section li {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  padding-left: 20px;
  position: relative;
}

.analysis-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.document-templates {
  display: flex;
  flex-direction: column;
}

.templates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.templates-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.template-card {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.template-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-4px);
}

.template-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.template-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.template-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
  line-height: 1.5;
}

.template-meta {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
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
  max-width: 600px;
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

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.upload-area {
  text-align: center;
  padding: 60px 20px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
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

.upload-area p {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-bottom: 20px;
}

.template-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.all-templates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-item:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.history-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.history-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

@media (max-width: 1024px) {
  .document-layout {
    grid-template-columns: 1fr;
  }

  .document-sidebar {
    display: none;
  }

  .templates-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .all-templates-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
