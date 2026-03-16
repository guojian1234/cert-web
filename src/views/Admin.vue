<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>证书管理系统</h1>
      <button @click="logout" class="logout-btn">退出登录</button>
    </header>

    <main class="admin-main">
      <!-- 1. 研究领域 -->
      <section class="domain-section">
        <h2>研究领域</h2>
        <div class="domain-actions">
          <input v-model="newDomain" type="text" placeholder="新增研究领域" @keyup.enter="addDomain" />
          <button @click="addDomain" class="action-btn">新增</button>
        </div>
        <div class="existing-domains">
          <span v-for="domain in domains" :key="domain.id" class="domain-tag">{{ domain.name }}</span>
        </div>
      </section>

      <hr class="divider" />

      <!-- 2. 证书类别 -->
      <section class="category-section">
        <h2>证书类别</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>类别名称 *</label>
            <input v-model="newCategoryForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>所属研究领域 *</label>
            <select v-model="newCategoryForm.domain" required>
              <option value="" disabled>请选择</option>
              <option v-for="d in domains" :key="d.name" :value="d.name">{{ d.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>创建时间 (YYYY-MM) *</label>
            <div style="display: flex; gap: 8px;">
              <select v-model="newCategoryForm.year" required style="flex: 1;">
                <option value="">选择年份</option>
                <option v-for="y in Array.from({length: 31}, (_, i) => 2000 + i)" :key="y" :value="y.toString()">{{ y }} 年</option>
              </select>
              <select v-model="newCategoryForm.month" required style="flex: 1;">
                <option value="">选择月份</option>
                <option v-for="m in 12" :key="m" :value="m.toString().padStart(2, '0')">{{ m }} 月</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>联系人 *</label>
            <input v-model="newCategoryForm.contactPerson" type="text" required placeholder="请输入联系人姓名或职位"/>
          </div>
          <div class="form-group">
            <label>类别图标 (上传) *</label>
            <input type="file" accept="image/*" @change="handleCategoryImageUpload" />
            <img v-if="newCategoryForm.previewUrl" :src="newCategoryForm.previewUrl" class="preview-image" />
          </div>
          <div class="form-group full-width">
            <label>报告摘要（选填）</label>
            <textarea v-model="newCategoryForm.reportSummary" placeholder="请输入该证书类别的技术报告摘要，例如评估维度、核心能力要求等（最多500字）" rows="4"></textarea>
          </div>
        </div>
        <button @click="addCategory" class="action-btn" style="margin-top: 16px;">+ 添加证书类别</button>
        <div class="category-list" style="margin-top: 24px;">
          <div v-for="cat in categories" :key="cat.id" class="category-item">
            <img :src="cat.imageUrl" class="category-icon" alt="类别图标" @error="handleImageError"/>
            <div>
              <strong>{{ cat.name }}</strong><br />
              <small>领域: {{ cat.domain }} | {{ cat.createdAt }}</small><br />
              <small>联系人: {{ cat.contactPerson }}</small>
              <p v-if="cat.reportSummary" class="summary-preview">{{ cat.reportSummary }}</p>
            </div>
          </div>
        </div>
      </section>

      <hr class="divider" />

      <!-- 3. 企业证书 -->
      <section class="enterprise-section">
        <h2>企业证书</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>企业名称 *</label>
            <input v-model="newCertForm.enterpriseName" type="text" required />
          </div>
          <div class="form-group">
            <label>关联证书类别 *</label>
            <select v-model="newCertForm.categoryId" required>
              <option value="" disabled>请选择类别</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>颁发时间 (YYYY-MM) *</label>
            <div style="display: flex; gap: 8px;">
              <select v-model="newCertForm.year" required style="flex: 1;">
                <option value="">选择年份</option>
                <option v-for="y in Array.from({length: 31}, (_, i) => 2000 + i)" :key="y" :value="y.toString()">{{ y }} 年</option>
              </select>
              <select v-model="newCertForm.month" required style="flex: 1;">
                <option value="">选择月份</option>
                <option v-for="m in 12" :key="m" :value="m.toString().padStart(2, '0')">{{ m }} 月</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>企业证书图片 (上传) *</label>
            <input type="file" accept="image/*" @change="handleCertImageUpload" />
            <img v-if="newCertForm.previewUrl" :src="newCertForm.previewUrl" class="preview-image" />
          </div>
        </div>
        <button @click="addEnterpriseCertificate" class="action-btn" style="margin-top: 16px;">+ 添加企业证书</button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { domainApi } from '@/api/domain'
import { categoryApi } from '@/api/category'
import { enterpriseCertApi } from '@/api/enterpriseCert'
import type { Certificate } from '@/types/certificate' 
import type { Domain } from '@/api/domain'

const router = useRouter()

// --- 领域管理 ---
const newDomain = ref('')
const domains = ref<Domain[]>([])

async function loadDomains() {
  domains.value = await domainApi.getAll()
}

async function addDomain() {
  const name = newDomain.value.trim()
  if (!name) return // 空值直接退出

  const isDuplicate = domains.value.some(domain => domain.name === name)
  
  if (!isDuplicate) {
    await domainApi.add(name)
    newDomain.value = ''
    await loadDomains() // 建议加 await 确保刷新
  } else {
    alert('该领域已存在')
  }
}

// --- 证书类别 ---
const newCategoryForm = reactive({
  name: '',
  domain: '',
  year: new Date().getFullYear().toString(),
  month: '01',
  contactPerson: '',
  reportSummary: '',
  file: null as File | null,
  previewUrl: null as string | null,
})

function handleCategoryImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    newCategoryForm.file = file
    newCategoryForm.previewUrl = URL.createObjectURL(file)
  }
}

async function addCategory() {
  const { name, domain, year, month, contactPerson, reportSummary, file } = newCategoryForm

  const safeTrim = (val: unknown): string => val == null ? '' : String(val).trim();

  const n = safeTrim(name)
  const d = safeTrim(domain)
  const cp = safeTrim(contactPerson)

  if (!n || !d || !year || !month || !cp || !(file instanceof File)) {
    alert('请填写所有必填项')
    return
  }

  const createdAt = `${year}-${month}`

  const formData = new FormData()
  formData.append('name', n)
  formData.append('domain', d)
  formData.append('createdAt', createdAt)
  formData.append('contactPerson', cp)
  if (reportSummary != null) {
    formData.append('reportSummary', safeTrim(reportSummary))
  }
  formData.append('image', file)

  try {
    await categoryApi.create(formData)
    Object.assign(newCategoryForm, {
      name: '',
      domain: '',
      year: new Date().getFullYear().toString(),
      month: '01',
      contactPerson: '',
      reportSummary: '',
      file: null,
      previewUrl: null,
    })
  } catch (err) {
    console.error('添加失败:', err)
    alert('添加失败')
  }
}

// --- 企业证书 ---
const categories = ref<Certificate[]>([])

const newCertForm = reactive({
  enterpriseName: '',
  categoryId: 0,
  year: new Date().getFullYear().toString(),
  month: '01',
  file: null as File | null,
  previewUrl: null as string | null,
})

async function loadCategories() {
  const certs = await categoryApi.getAll()
  categories.value = certs
}

function handleCertImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    newCertForm.file = file
    newCertForm.previewUrl = URL.createObjectURL(file)
  }
}

async function addEnterpriseCertificate() {
  const { enterpriseName, categoryId, year, month, file } = newCertForm
  if (!enterpriseName || !categoryId || !year || !month || !file) {
    alert('请填写所有必填项')
    return
  }

  const issuedAt = `${year}-${month}`

  const formData = new FormData()
  formData.append('enterpriseName', enterpriseName.trim())
  formData.append('categoryId', categoryId.toString())
  formData.append('issuedAt', issuedAt)
  formData.append('image', file)

  try {
    await enterpriseCertApi.create(formData)
    Object.assign(newCertForm, {
      enterpriseName: '',
      categoryId: 0,
      year: new Date().getFullYear().toString(),
      month: '01',
      file: null,
      previewUrl: null,
    })
  } catch (err) {
    alert('添加失败')
  }
}

// --- 初始化 ---
onMounted(() => {
  loadDomains()
  loadCategories()
})

// --- 图片错误处理 ---
function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
}

// --- 登出功能 ---
function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>


<style scoped>
.admin-container {
  box-sizing: border-box;
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.admin-header h1 {
  font-size: 24px;
  margin: 0;
}

.logout-btn {
  padding: 6px 12px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #ff7875;
}

.admin-main > section {
  margin-bottom: 32px;
}

.admin-main h2 {
  margin-bottom: 16px;
  font-size: 20px;
  color: #333;
}

.domain-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.domain-actions input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.action-btn {
  padding: 10px 16px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.action-btn:hover {
  background-color: #40a9ff;
}

.existing-domains {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.domain-tag {
  padding: 4px 12px;
  background-color: #f0f5ff;
  color: #1d39c4;
  border: 1px solid #adc6ff;
  border-radius: 4px;
  font-size: 14px;
}

.divider {
  border: 0;
  border-top: 1px solid #eee;
  margin: 32px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.form-grid .full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  max-height: 200px;
  padding: 10px 12px;
  transition: border-color 0.2s;
}

.form-group textarea:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.preview-image {
  margin-top: 8px;
  max-width: 100px;
  max-height: 100px;
  border-radius: 4px;
  object-fit: cover;
  display: block;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
}

.category-icon {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f5f5f5;
  border: 1px solid #e8e8e8;
  display: block;
}

.summary-preview {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>