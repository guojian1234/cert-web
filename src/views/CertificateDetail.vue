<template>
  <div class="cert-detail-container">
    <div class="breadcrumb">
      <router-link to="/">证书</router-link>
      <span class="breadcrumb-separator"> &gt; </span>
      <span class="breadcrumb-current">证书详情</span>
    </div>
    <div v-if="loading" class="loading">正在加载证书详情...</div>
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="retryLoad">重试</button>
    </div>
    <div v-else-if="cert" class="cert-detail">
      <!-- 图片 + 标题/关键词/联系人（左右布局） -->
      <div class="cert-body">
        <!-- 左侧：证书图片 -->
        <div class="cert-image-wrapper">
          <img v-if="cert.imageUrl" :src="cert.imageUrl" :alt="cert.name" class="cert-image" />
          <div v-else class="cert-image-placeholder">无证书图片</div>
        </div>

        <!-- 右侧：标题 + 关键词 + 联系人 -->
        <div class="cert-info">
          <h1 class="cert-title">{{ cert.name }}</h1>
          <div v-if="cert.keywords" class="cert-keywords">
            <span class="keyword" v-for="(kw, idx) in cert.keywords" :key="idx">{{ kw }}</span>
          </div>
          <div v-if="cert.contact" class="cert-contact">
            <p>{{ cert.contact }}</p>
          </div>
        </div>
      </div>

      <!-- 报告摘要：全宽，位于 cert-body 下方 -->
      <section v-if="cert.summary" class="summary-section full-width-section">
        <h2>报告摘要</h2>
        <div class="summary-content">{{ cert.summary }}</div>
      </section>

      <!-- 已获认证企业（保持不变） -->
      <section v-if="cert.certifiedCompanies && cert.certifiedCompanies.length > 0" class="companies-section">
        <h2>已获认证企业</h2>
        <div class="companies-grid">
          <div v-for="(company, index) in cert.certifiedCompanies" :key="index" class="company-card">
            <div class="cert-image-wrapper">
              <img v-if="company.logo" :src="company.logo" :alt="company.name" class="cert-image" />
              <div v-else class="cert-image-placeholder">无证书图片</div>
            </div>
            <div class="company-name-display">
              <p class="company-name-text">{{ company.name }}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { CertificateDetail } from '@/types/certificate'
// import { categoryApi } from '@/api/category'       // ← 注释掉真实 API
// import { enterpriseCertApi } from '@/api/enterpriseCert'

const route = useRoute()
const cert = ref<CertificateDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// ====== MOCK DATA ======
function mockGetCertificateDetail(id: number) {
  return new Promise<CertificateDetail>((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) {
        resolve({
          id: 1,
          name: '人脸识别安全评测证书',
          keywords: ['AI 安全', '生物识别', '隐私保护'],
          summary: '本证书依据《人工智能安全评估规范 V2.1》对人脸识别系统在活体检测、抗攻击能力、数据脱敏等方面进行综合评测，确认其达到“可信 AI”三级安全标准。',
          contact: '张三（认证工程师）\n电话：138-0000-1234\n邮箱：zhangsan@cert.org',
          imageUrl: '/mock-images/face-recognition.png',
          certifiedCompanies: [
            {
              name: '深智科技有限公司',
              logo: '/mock-images/face-recognition.png'
            },
            {
              name: '云瞳智能',
              logo: '/mock-images/face-recognition.png'
            },
             {
              name: '深智科技有限公司',
              logo: '/mock-images/face-recognition.png'
            },
            {
              name: '云瞳智能',
              logo: '/mock-images/face-recognition.png'
            }, {
              name: '深智科技有限公司',
              logo: '/mock-images/face-recognition.png'
            },
            {
              name: '云瞳智能',
              logo: '/mock-images/face-recognition.png'
            }, {
              name: '深智科技有限公司',
              logo: '/mock-images/face-recognition.png'
            },
            {
              name: '云瞳智能',
              logo: '/mock-images/face-recognition.png'
            }
          ]
        })
      } else if (id === 2) {
        resolve({
          id: 2,
          name: '可信AI系统评估认证',
          keywords: ['可解释性', '公平性', '鲁棒性'],
          summary: '该系统通过了算法透明度、决策公平性、对抗样本鲁棒性等 12 项核心指标测试，符合国家新一代人工智能治理原则。',
          contact: '李四\n联系电话：010-88889999',
          imageUrl: '/mock-images/face-recognition.png',
          certifiedCompanies: [
            { name: '智算未来', logo: '/mock-images/face-recognition.png' },
            { name: '数智研究院', logo: '/mock-images/face-recognition.png' }
          ]
        })
      } else {
        reject({ response: { status: 404 } })
      }
    }, 500) // 模拟网络延迟
  })
}

async function loadCertificate(id: number) {
  loading.value = true
  error.value = null
  try {
    // 使用 Mock 数据替代 API
    const mockData = await mockGetCertificateDetail(id)
    cert.value = mockData
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

// 重试按钮
function retryLoad() {
  const id = Number(route.params.id)
  if (!isNaN(id)) {
    loadCertificate(id)
  } else {
    error.value = '无效的证书ID'
  }
}

// 监听路由变化
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

/* 主体：图片 + 右侧信息（左右布局） */
.cert-body {
  display: flex;
  gap: 32px;
  margin-bottom: 32px; /* 与摘要保持间距 */
  flex-wrap: wrap;
}

.cert-image-wrapper {
  flex-shrink: 0;
  width: 240px; /* 固定图片区域宽度 */
}

.cert-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.cert-info {
  flex: 1;
  min-width: 0;
}

.cert-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
}

.cert-keywords {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.keyword {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
}

/* 联系人信息 */
.cert-contact {
  line-height: 1.6;
  color: #555;
  white-space: pre-line; /* 保留换行 */
}

/* === 报告摘要：全宽 + 边框 === */
.full-width-section {
  width: 100%;
  max-width: 100%; /* 覆盖 container 限制 */
  margin: 0 auto 40px;
}

.summary-section h2 {
  margin-bottom: 16px;
  font-size: 20px;
  color: #333;
}

.summary-content {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
  line-height: 1.7;
  color: #555;
  white-space: pre-line; /* 保留 \n 换行 */
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

/* 面包屑导航 */
.breadcrumb {
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #1890ff;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 6px;
  color: #999;
}

.breadcrumb-current {
  color: #333;
  font-weight: 500;
}
</style>