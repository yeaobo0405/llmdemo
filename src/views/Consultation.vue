<template>
  <div class="consultation-page">
    <div class="container">
      <div class="page-header">
        <h2>多语种涉外法律咨询服务</h2>
        <p>支持中、蒙、俄、英四大语种的智能法律咨询平台</p>
      </div>

      <div class="consultation-layout">
        <div class="sidebar">
          <div class="card language-selector">
            <h3>选择对话语种</h3>
            <div class="language-options">
              <button
                v-for="lang in languages"
                :key="lang.code"
                class="lang-btn"
                :class="{ active: selectedLanguage === lang.code }"
                @click="selectLanguage(lang.code)"
              >
                <span class="lang-flag">{{ lang.flag }}</span>
                <span class="lang-name">{{ lang.name }}</span>
              </button>
            </div>
          </div>

          <div class="card quick-questions">
            <h3>常见问题</h3>
            <div class="question-list">
              <div
                v-for="q in quickQuestions"
                :key="q.id"
                class="question-item"
                @click="selectQuestion(q)"
              >
                {{ q.text }}
              </div>
            </div>
          </div>
        </div>

        <div class="main-chat">
          <div class="card chat-container">
            <div class="chat-messages" ref="messagesContainer">
              <div
                v-for="(msg, index) in messages"
                :key="index"
                class="message"
                :class="msg.role"
              >
                <div class="message-content">
                  <div class="message-text">{{ msg.content }}</div>
                  <div v-if="msg.references && msg.references.length > 0" class="references">
                    <div class="ref-title">参考依据：</div>
                    <div
                      v-for="(ref, refIndex) in msg.references"
                      :key="refIndex"
                      class="ref-item"
                    >
                      <span class="ref-badge">{{ ref.type }}</span>
                      <span class="ref-text">{{ ref.content }}</span>
                    </div>
                  </div>
                </div>
                <div class="message-actions">
                  <button class="action-btn" @click="copyMessage(msg.content)">复制</button>
                  <button class="action-btn" @click="regenerate(index)">重新生成</button>
                </div>
              </div>
            </div>

            <div class="chat-input">
              <textarea
                v-model="inputMessage"
                class="input chat-textarea"
                placeholder="请输入您的涉外法律问题..."
                @keydown.enter.prevent="sendMessage"
                rows="3"
              ></textarea>
              <div class="input-actions">
                <button class="btn btn-secondary" @click="clearMemory">清除记忆</button>
                <button class="btn btn-primary" @click="sendMessage" :disabled="!inputMessage.trim()">
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const languages = ref([
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'mn', name: '蒙古语', flag: '🇲🇳' },
  { code: 'ru', name: '俄语', flag: '🇷🇺' },
  { code: 'en', name: '英语', flag: '🇬🇧' }
])

const selectedLanguage = ref('zh')
const inputMessage = ref('')
const messages = ref([])
const messagesContainer = ref(null)

const quickQuestions = ref([
  { id: 1, text: '蒙古国投资法律环境如何？' },
  { id: 2, text: '中俄跨境贸易合同需要注意哪些法律问题？' },
  { id: 3, text: '外国法查明的程序和要求是什么？' },
  { id: 4, text: '涉外仲裁裁决的承认与执行条件' },
  { id: 5, text: '跨境数据合规的法律要求' }
])

const selectLanguage = (code) => {
  selectedLanguage.value = code
}

const selectQuestion = (question) => {
  inputMessage.value = question.text
  sendMessage()
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const userMessage = {
    role: 'user',
    content: inputMessage.value
  }
  messages.value.push(userMessage)

  const question = inputMessage.value
  inputMessage.value = ''

  await nextTick()
  scrollToBottom()

  setTimeout(() => {
    const aiResponse = generateAIResponse(question)
    messages.value.push(aiResponse)
    nextTick(() => scrollToBottom())
  }, 1000)
}

const generateAIResponse = (question) => {
  const responses = {
    '蒙古国投资法律环境如何？': {
      content: '根据蒙古国《投资法》及相关法规，蒙古国投资法律环境具有以下特点：\n\n1. **投资准入**：蒙古国对外国投资总体持开放态度，除特定战略领域外，大部分行业允许外资进入。\n\n2. **投资保护**：蒙古国已与中国签订《中蒙双边投资保护协定》，为投资者提供法律保障。\n\n3. **优惠政策**：在特定区域和行业可享受税收减免、土地优惠等政策。\n\n4. **风险提示**：需关注蒙古国法律政策稳定性、外汇管制、劳工保护等潜在风险。\n\n建议在进行投资前，结合具体项目进行详细的法律尽职调查。',
      references: [
        { type: '法规', content: '蒙古国《投资法》第3-15条' },
        { type: '条约', content: '《中蒙双边投资保护协定》' },
        { type: '案例', content: '（2023）蒙商初字第001号' }
      ]
    },
    '中俄跨境贸易合同需要注意哪些法律问题？': {
      content: '中俄跨境贸易合同需要重点关注以下法律问题：\n\n1. **适用法律选择**：建议明确选择适用法律，可考虑《联合国国际货物销售合同公约》（CISG）。\n\n2. **争议解决机制**：建议选择国际仲裁，如中国国际经济贸易仲裁委员会或俄罗斯联邦工商会国际商事仲裁院。\n\n3. **支付与结算**：需考虑外汇管制、支付方式、汇率风险等问题。\n\n4. **质量标准与检验**：明确货物质量标准、检验机构、检验时间等。\n\n5. **知识产权保护**：涉及技术贸易时，需特别关注知识产权保护条款。',
      references: [
        { type: '公约', content: '《联合国国际货物销售合同公约》' },
        { type: '条约', content: '《中俄关于相互促进和保护投资的协定》' },
        { type: '法规', content: '《中华人民共和国对外贸易法》' }
      ]
    },
    '外国法查明的程序和要求是什么？': {
      content: '外国法查明是指在国际民商事案件中，根据冲突规范应适用外国法时，对该外国法内容的确定和证明。主要程序和要求如下：\n\n1. **查明途径**：\n   - 当事人提供\n   - 法院依职权查明\n   - 通过中外法律专家意见\n   - 通过司法协助途径\n\n2. **证明要求**：\n   - 提供外国法条文的官方文本\n   - 提供权威法律解释\n   - 说明法律的现行有效性\n\n3. **无法查明时的处理**：如无法查明外国法内容，法院可适用中国法律或国际惯例。',
      references: [
        { type: '法规', content: '《涉外民事关系法律适用法》第10条' },
        { type: '解释', content: '最高人民法院关于适用涉外民事关系法律适用法若干问题的解释' },
        { type: '案例', content: '（2022）最高法民申字第1234号' }
      ]
    },
    '涉外仲裁裁决的承认与执行条件': {
      content: '涉外仲裁裁决的承认与执行需满足以下条件：\n\n1. **有效仲裁协议**：当事人之间存在有效的仲裁协议。\n\n2. **仲裁程序合法**：仲裁程序符合仲裁规则和当事人约定。\n\n3. **裁决可执行**：裁决具有可执行内容且未超过执行期限。\n\n4. **不违反公共政策**：裁决内容不违反承认与执行地的公共政策。\n\n5. **条约依据**：依据《纽约公约》或双边司法协助条约申请承认与执行。\n\n中国是《纽约公约》缔约国，涉外仲裁裁决可依据公约在缔约国境内申请承认与执行。',
      references: [
        { type: '公约', content: '《承认及执行外国仲裁裁决公约》（纽约公约）' },
        { type: '法规', content: '《中华人民共和国仲裁法》' },
        { type: '解释', content: '最高人民法院关于执行涉外仲裁裁决若干问题的规定' }
      ]
    },
    '跨境数据合规的法律要求': {
      content: '跨境数据合规涉及多国法律法规，主要要求如下：\n\n1. **中国法律要求**：\n   - 《网络安全法》《数据安全法》《个人信息保护法》\n   - 数据出境安全评估\n   - 重要数据目录管理\n\n2. **欧盟GDPR要求**：\n   - 数据主体权利保障\n   - 数据保护影响评估\n   - 标准合同条款（SCC）\n\n3. **俄罗斯法律要求**：\n   - 数据本地化存储\n   - 个人数据跨境传输限制\n\n4. **蒙古国法律要求**：\n   - 个人信息保护法\n   - 数据跨境传输审批\n\n建议建立完善的数据合规管理体系，定期进行合规风险评估。',
      references: [
        { type: '法规', content: '《中华人民共和国数据安全法》' },
        { type: '法规', content: '《中华人民共和国个人信息保护法》' },
        { type: '法规', content: '欧盟《通用数据保护条例》（GDPR）' }
      ]
    }
  }

  const defaultResponse = {
    content: '感谢您的咨询。根据涉外法律知识库，您的问题涉及跨法域法律适用，建议您提供更多具体信息，以便我们提供更精准的法律建议。\n\n您可以补充以下信息：\n1. 具体的业务场景和背景\n2. 涉及的国家或地区\n3. 相关的法律关系主体\n4. 您希望解决的具体法律问题',
    references: [
      { type: '指引', content: '涉外法律咨询操作指引' }
    ]
  }

  return {
    role: 'assistant',
    ...responses[question] || defaultResponse
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const copyMessage = (content) => {
  navigator.clipboard.writeText(content)
}

const regenerate = (index) => {
  if (index > 0 && messages.value[index].role === 'assistant') {
    const userMessage = messages.value[index - 1]
    messages.value = messages.value.slice(0, index)
    inputMessage.value = userMessage.content
    sendMessage()
  }
}

const clearMemory = () => {
  messages.value = []
}
</script>

<style scoped>
.consultation-page {
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

.consultation-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.language-selector h3,
.quick-questions h3 {
  font-size: 16px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
}

.language-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lang-btn {
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
}

.lang-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.lang-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.lang-flag {
  font-size: 24px;
}

.lang-name {
  font-size: 14px;
  font-weight: 500;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-item {
  padding: 12px 16px;
  background: #f8f9ff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  color: #333;
  line-height: 1.5;
}

.question-item:hover {
  background: #e8ecff;
  transform: translateX(4px);
}

.main-chat {
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 16px 20px;
  border-radius: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.assistant .message-content {
  background: #f8f9ff;
  color: #333;
  border: 1px solid #e8ecff;
}

.message-text {
  font-size: 14px;
  line-height: 1.8;
}

.references {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.ref-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #666;
}

.ref-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
}

.ref-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  background: #667eea;
  color: white;
}

.ref-text {
  color: #666;
}

.message-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.message:hover .message-actions {
  opacity: 1;
}

.action-btn {
  padding: 4px 12px;
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

.chat-input {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.chat-textarea {
  margin-bottom: 12px;
  font-family: inherit;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 1024px) {
  .consultation-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }
}
</style>
