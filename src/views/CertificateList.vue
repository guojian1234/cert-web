<template>
  <!-- 整个页面灰底 -->
  <div class="page-wrapper">
    <div class="container">
      <!-- 新增：内容背景板 -->
      <div class="content-panel">
        <!-- 标题 + 领域筛选 -->
        <header class="page-header">
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

        <div v-if="loading" class="loading">正在加载证书列表...</div>
        <div v-else-if="error" class="error">
          {{ error }}
          <button @click="loadCertificates">重试</button>
        </div>
        <div v-else-if="filteredCertificates.length === 0" class="empty">
          暂无符合条件的证书
        </div>
        <div v-else class="cert-list">
          <CertificateCard
            v-for="cert in paginatedCertificates"
            :key="cert.id"
            :cert="cert"
          />
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
]
// ====== MOCK DATA 结束 ======

const filterDomains = ref<Domain[]>([])
const allCertificates = ref<Certificate[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const activeDomain = ref<string | null>(null)
const pageSize = 5

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

.content-panel {
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 32px;
  margin-bottom: 24px;
}

/* 整个页面灰色背景 */
.page-wrapper {
  background-color: #f5f7fa; /* 浅灰色，类似 Ant Design 风格 */
  min-height: 100vh;
  padding: 16px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 其余样式保持不变（略作微调以适配新结构） */
.domain-tabs {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.domain-btn {
  padding: 12px 24px;
  border: 1px solid #d9d9d9;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 80px;
  text-align: center;
}

.domain-btn:hover:not(.active):not(.domain-title) {
  background-color: #f5f5f5;
}

.domain-btn.active,
.domain-btn.domain-title {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
  font-weight: bold;
}

.domain-btn.domain-title:hover {
  background-color: #40a9ff;
}

.loading,
.empty,
.error {
  padding: 32px;
  text-align: center;
  color: #666;
}

.error button {
  margin-left: 12px;
  padding: 6px 12px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error button:hover {
  background-color: #40a9ff;
}

.cert-list {
  margin-bottom: 24px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
  margin-bottom: 24px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

.page-dots {
  padding: 8px 12px;
  background: none;
  border: none;
  color: #999;
}
</style>