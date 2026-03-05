<!-- src/views/CertificateDetail.vue -->
<template>
  <div class="cert-detail-container">
    <!-- 加载中 -->
    <div v-if="loading" class="loading">正在加载证书详情...</div>

    <!-- 错误 -->
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="loadCertificate">重试</button>
    </div>

    <!-- 证书详情 -->
    <div v-else-if="cert" class="cert-detail">
      <!-- 标题区 -->
      <header class="cert-header">
        <h1 class="cert-title">{{ cert.title }}</h1>
        <div v-if="cert.keywords" class="cert-keywords">
          <span class="keyword" v-for="(kw, idx) in cert.keywords" :key="idx">
            {{ kw }}
          </span>
        </div>
      </header>

      <!-- 主体内容：图片 + 摘要 + 企业 -->
      <div class="cert-body">
        <!-- 左侧：证书图片 -->
        <div class="cert-image-wrapper">
          <img
            v-if="cert.imageUrl"
            :src="cert.imageUrl"
            :alt="cert.title"
            class="cert-image"
          />
          <div v-else class="cert-image-placeholder">无证书图片</div>
        </div>

        <!-- 右侧：摘要与联系人 -->
        <div class="cert-info">
          <!-- 摘要 -->
          <section v-if="cert.summary" class="cert-section">
            <h2>报告摘要</h2>
            <p class="summary-text">{{ cert.summary }}</p>
          </section>

          <!-- 联系人 -->
          <section v-if="cert.contact" class="cert-section">
            <h2>联系人</h2>
            <p>{{ cert.contact }}</p>
          </section>
        </div>
      </div>

<!-- 认证企业列表 -->
<section v-if="cert.certifiedCompanies && cert.certifiedCompanies.length > 0" class="companies-section">
  <h2>已获认证企业</h2>
  <div class="companies-grid">
    <!-- 每个企业卡片：证书图片 + 企业名称 -->
    <div
      v-for="(company, index) in cert.certifiedCompanies"
      :key="index"
      class="company-card"
    >
      <!-- 证书图片 -->
      <div class="cert-image-wrapper">
        <img
          v-if="company.logo"
          :src="company.logo"
          :alt="company.name"
          class="cert-image"
        />
        <div v-else class="cert-image-placeholder">无证书图片</div>
      </div>

      <!-- 企业名称（在图片下方） -->
      <div class="company-name-display">
        <p class="company-name-text">{{ company.name }}</p>
      </div>
    </div>
  </div>
</section>
    </div>

    <!-- 返回按钮 -->
    <div class="back-link">
      <router-link to="/">&larr; 返回证书列表</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { CertificateDetail } from '@/types/certificate'
import { categoryApi } from '@/api/category'
import { enterpriseCertApi } from '@/api/enterpriseCert' // ← 新增导入

const route = useRoute()
const cert = ref<CertificateDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function loadCertificate(id: number) {
  loading.value = true
  error.value = null
  try {
    // 1. 加载证书类别详情
    const detail = await categoryApi.getById(id)
    
    // 2. 加载关联的企业证书
    const companies = await enterpriseCertApi.getByCategoryId(id)
    
    // 3. 合并数据
    cert.value = {
      ...detail,
      certifiedCompanies: companies.map(c => ({
        name: c.enterpriseName,
        logo: c.imageUrl // 后端返回的是 imageUrl
      }))
    }
  } catch (err: any) {
    if (err.response?.status === 404) {
      error.value = '证书详情不存在'
    } else {
      console.error('加载失败:', err)
      error.value = '加载失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  (newId) => {
    const id = Number(newId)
    if (!isNaN(id)) {
      loadCertificate(id)
    } else {
      error.value = '无效的证书ID'
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.cert-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  background-color: white;
  min-height: calc(100vh - 120px);
}

.loading,
.error {
  text-align: center;
  padding: 40px;
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

.cert-header {
  margin-bottom: 32px;
}

.cert-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 16px;
}

.cert-keywords {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.keyword {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.cert-body {
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

/* 调整公司卡片的样式 */
.company-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}

.company-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.cert-image-wrapper {
  width: 100%;
  max-width: 200px; /* 统一宽度 */
  margin-bottom: 8px; /* 图片与文字之间的间距 */
}

.cert-image {
  width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  object-fit: contain;
}

.cert-image-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  color: #999;
  font-size: 14px;
  border: 1px dashed #ddd;
  border-radius: 4px;
}

.company-name-display {
  text-align: center;
  width: 100%;
}

.company-name-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal; /* 支持换行 */
  max-width: 100%;
}

.cert-info {
  flex: 1;
  min-width: 300px;
}

.cert-section {
  margin-bottom: 24px;
}

.cert-section h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #333;
}

.summary-text,
.cert-section p {
  line-height: 1.6;
  color: #555;
}

/* 企业列表 */
.companies-section h2 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 更新以适应新设计 */
  gap: 16px;
}

/* 返回链接 */
.back-link {
  margin-top: 24px;
  text-align: left;
}

.back-link a {
  color: #1890ff;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 768px) {
  .cert-body {
    flex-direction: column;
  }

  .cert-image-wrapper {
    flex: none;
  }

  .cert-image {
    width: 160px;
    margin: 0 auto;
  }
  
  .companies-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>