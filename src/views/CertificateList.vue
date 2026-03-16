<!-- src/views/CertificateList.vue -->
<template>
  <div class="container">
    <!-- 标题 + 领域筛选 -->
    <header class="page-header">
      <!-- 研究领域标签 -->
      <div class="domain-tabs">
        <!-- “研究领域” 可点击，用于重置筛选 -->
        <button class="domain-btn domain-title" @click="resetFilter">
          研究领域
        </button>
        <!-- 可点击的筛选按钮 -->
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

    <!-- 加载中 -->
    <div v-if="loading" class="loading">正在加载证书列表...</div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="loadCertificates">重试</button>
    </div>

    <!-- 空数据 -->
    <div v-else-if="filteredCertificates.length === 0" class="empty">
      暂无符合条件的证书
    </div>

    <!-- 证书列表 -->
    <div v-else class="cert-list">
      <CertificateCard
        v-for="cert in paginatedCertificates"
        :key="cert.id"
        :cert="cert"
      />
    </div>

    <!-- 分页控件 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Certificate } from '@/types/certificate'
import CertificateCard from '@/components/CertificateCard.vue'
import { domainApi } from '@/api/domain'
import { categoryApi } from '@/api/category'
import type { Domain } from '@/api/domain' // ✅ 导入 Domain 类型

const filterDomains = ref<Domain[]>([]) // ✅ 类型是 Domain[]
const allCertificates = ref<Certificate[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const activeDomain = ref<string | null>(null) // ✅ 存储字符串（如 "人工智能"）
const pageSize = 5

// 加载领域
async function loadDomains() {
  try {
    filterDomains.value = await domainApi.getAll() // 返回 Domain[]
  } catch (err) {
    console.error('加载领域失败', err)
  }
}

// 加载证书
async function loadCertificates() {
  loading.value = true
  error.value = null
  try {
    allCertificates.value = await categoryApi.getAll()
    currentPage.value = 1
  } catch (err) {
    error.value = '加载证书列表失败，请刷新重试。'
  } finally {
    loading.value = false
  }
}

// 计算属性
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

// 方法
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

// 初始化
onMounted(() => {
  loadDomains()
  loadCertificates()
})
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

/* 领域标签样式 */
.domain-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.domain-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.domain-btn:hover:not(.active):not(.domain-title) {
  background-color: #f0f0f0;
}

/* 激活态：蓝色 */
.domain-btn.active {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

/* “研究领域” 标题样式：固定蓝色，可点击 */
.domain-btn.domain-title {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
  font-weight: bold;
  cursor: pointer;
}

.domain-btn.domain-title:hover {
  background-color: #40a9ff;
}

/* 其他通用样式 */
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
  gap: 8px;
  margin-top: 24px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
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
  padding: 6px 8px;
  background: none;
  border: none;
  color: #999;
}
</style>