<template>
  <!-- 整个页面灰底 -->
  <div class="page-wrapper">
    <div class="container">
      <!-- 新增：内容背景板 -->
      <div class="content-panel">
        <!-- 标题 + 领域筛选 -->
        <header class="page-header">
          <h1 class="page-title">证书列表</h1>
          <div class="domain-tabs">
            <button class="domain-btn domain-title" @click="resetFilter">
              研究领域
            </button>
            <button
              v-for="domain in filterDomains"
              :key="domain.name"
              :class="{ active: activeDomain === domain.name }"
              @click="filterByDomain(domain.name)"
              class="domain-btn"
            >
              {{ domain.name }}
            </button>
          </div>
        </header>

        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载证书列表...</p>
        </div>
        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <p>{{ error }}</p>
          <button @click="loadCertificates" class="retry-btn">重试</button>
        </div>
        <div v-else-if="filteredCertificates.length === 0" class="empty-container">
          <div class="empty-icon">📄</div>
          <p>暂无符合条件的证书</p>
        </div>
        <div v-else class="cert-list">
          <transition-group name="cert-card" tag="div" class="cert-grid">
            <CertificateCard
              v-for="cert in paginatedCertificates"
              :key="cert.id"
              :cert="cert"
            />
          </transition-group>
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            class="page-btn"
          >
            上一页
          </button>
          <span v-for="page in visiblePages" :key="page" class="page-item">
            <button
              v-if="page === '...'"
              class="page-dots"
              disabled
            >
              ...
            </button>
            <button
              v-else
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
              class="page-btn"
            >
              {{ page }}
            </button>
          </span>
          <button
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="page-btn"
          >
            下一页
          </button>
        </div>
      </div> <!-- /.content-panel -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Certificate } from '@/types/certificate'
import CertificateCard from '@/components/CertificateCard.vue'
// import { domainApi } from '@/api/domain'
// import { categoryApi } from '@/api/category'
import type { Domain } from '@/api/domain'

// ====== MOCK DATA 开始 ======
const mockDomains: Domain[] = [
  { name: '人工智能' },
  { name: '大数据' },
  { name: '云计算' },
  { name: '区块链' },
  { name: '物联网' },
  { name: '网络安全' },
]

const mockCertificates: Certificate[] = [
  {
    id: 1,
    name: '人脸识别安全评测证书',
    domain: '人工智能',
    createdAt: '2025-12',
    imageUrl: '/mock-images/face-recognition.png',
    detailUrl: '/certificate/detail/1',
    contactPerson: '张三', // 虽然不显示，但类型需要
  },
  {
    id: 2,
    name: '可信AI系统评估认证',
    domain: '人工智能',
    createdAt: '2025-10',
    imageUrl: '/mock-images/face-recognition.png',
    detailUrl: '/certificate/detail/2',
    contactPerson: '李四',
  },
  {
    id: 3,
    name: '云原生安全合规认证',
    domain: '云计算',
    createdAt: '2025-08',
    imageUrl: '/mock-images/face-recognition.png',
    detailUrl: '/certificate/detail/3',
    contactPerson: '王五',
  },
  {
    id: 4,
    name: '数据要素流通能力评估',
    domain: '大数据',
    createdAt: '2025-06',
    imageUrl: '/mock-images/face-recognition.png',
    detailUrl: '/certificate/detail/4',
    contactPerson: '赵六',
  },
  {
    id: 5,
    name: '隐私计算平台安全认证',
    domain: '网络安全',
    createdAt: '2025-04',
    imageUrl: '/mock-images/face-recognition.png',
    detailUrl: '/certificate/detail/5',
    contactPerson: '陈七',
  },
  {
    id: 6,
    name: '智能物联网设备安全证书',
    domain: '物联网',
    createdAt: '2025-02',
    imageUrl: '/mock-images/face-recognition.png',
    detailUrl: '/certificate/detail/6',
    contactPerson: '周八',
  },
  {
    id: 7,
    name: '智能物联网设备安全证书',
    domain: '物联网',
    createdAt: '2025-02',
    imageUrl: '/mock-images/face-recognition.png',
    detailUrl: '/certificate/detail/6',
    contactPerson: '周八',
  },
]
// ====== MOCK DATA 结束 ======

const filterDomains = ref<Domain[]>([])
const allCertificates = ref<Certificate[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const activeDomain = ref<string | null>(null)
const pageSize = 6

// 使用 mock 数据代替 API 调用
async function loadDomains() {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  filterDomains.value = mockDomains
}

async function loadCertificates() {
  loading.value = true
  error.value = null
  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟加载
    allCertificates.value = mockCertificates
    currentPage.value = 1
  } catch (err) {
    error.value = '加载证书列表失败，请刷新重试。'
  } finally {
    loading.value = false
  }
}

const filteredCertificates = computed(() =>
  activeDomain.value
    ? allCertificates.value.filter(c => c.domain === activeDomain.value)
    : allCertificates.value
)

const totalPages = computed(() =>
  Math.ceil(filteredCertificates.value.length / pageSize)
)

const paginatedCertificates = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCertificates.value.slice(start, start + pageSize)
})

const visiblePages = computed<(number | string)[]>(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const delta = 2
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)
  const range: (number | string)[] = [1]
  if (left > 2) range.push('...')
  for (let i = left; i <= right; i++) range.push(i)
  if (right < total - 1) range.push('...')
  range.push(total)
  return range
})

function filterByDomain(domainName: string) {
  activeDomain.value = domainName
  currentPage.value = 1
}

function resetFilter() {
  activeDomain.value = null
  currentPage.value = 1
}

function goToPage(page: number | string) {
  if (typeof page === 'number') {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  loadDomains()
  loadCertificates()
})
</script>

<style scoped>
/* 整个页面灰色背景 */
.page-wrapper {
  background-color: #f5f7fa; /* 浅灰色，类似 Ant Design 风格 */
  min-height: 100vh;
  padding: 32px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-panel {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
  margin-bottom: 32px;
  animation: fadeIn 0.5s ease-out;
}

/* 页面标题 */
.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
}

/* 领域筛选标签 */
.domain-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.domain-btn {
  padding: 10px 20px;
  border: 1px solid #d9d9d9;
  background-color: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.domain-btn:hover:not(.active):not(.domain-title) {
  background-color: #f5f5f5;
  border-color: #1890ff;
  transform: translateY(-1px);
}

.domain-btn.active,
.domain-btn.domain-title {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.domain-btn.domain-title:hover {
  background-color: #40a9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

/* 加载容器 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(24, 144, 255, 0.2);
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-container p {
  color: #666;
  font-size: 16px;
}

/* 错误容器 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
  background-color: rgba(255, 77, 79, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 77, 79, 0.1);
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-container p {
  color: #666;
  font-size: 16px;
  margin-bottom: 24px;
  max-width: 400px;
}

.retry-btn {
  padding: 10px 24px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background-color: #40a9ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

/* 空状态容器 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-container p {
  color: #999;
  font-size: 16px;
}

/* 证书网格 */
.cert-list {
  margin-bottom: 32px;
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* 证书卡片过渡动画 */
.cert-card-enter-active,
.cert-card-leave-active {
  transition: all 0.3s ease;
}

.cert-card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.cert-card-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  margin-bottom: 24px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 40px;
  text-align: center;
}

.page-btn:hover:not(:disabled) {
  background-color: #f0f0f0;
  border-color: #1890ff;
  transform: translateY(-1px);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.page-btn.active {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.page-dots {
  padding: 8px 12px;
  background: none;
  border: none;
  color: #999;
  font-size: 14px;
}

/* 动画定义 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-wrapper {
    padding: 16px 0;
  }
  
  .content-panel {
    padding: 24px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .domain-tabs {
    gap: 8px;
  }
  
  .domain-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .cert-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .loading-container,
  .error-container,
  .empty-container {
    padding: 48px 16px;
  }
  
  .pagination {
    gap: 4px;
  }
  
  .page-btn {
    padding: 6px 12px;
    font-size: 12px;
    min-width: 32px;
  }
}
</style>