<!-- src/components/CertificateCard.vue -->
<template>
  <div class="cert-card">
    <!-- 左侧：证书图片 -->
    <div class="cert-image">
      <img
        v-if="cert.imageUrl"
        :src="cert.imageUrl"
        :alt="cert.name"
        @error="handleImageError"
        loading="lazy"
        class="cert-img"
      />
      <div v-else class="image-placeholder">
        🖼️
      </div>
    </div>

    <!-- 右侧：文字信息 -->
    <div class="cert-info">
      <!-- 证书名称 -->
      <h3 class="cert-title">
        <a
          :href="cert.detailUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="cert-link"
        >
          {{ cert.name }}
        </a>
      </h3>

      <!-- 研究领域标签 -->
      <div class="tags">
        <span class="tag">{{ cert.domain }}</span>
      </div>

      <!-- 发布时间 -->
      <div class="date">
        <span class="icon">📅</span>
        <span>{{ cert.createdAt }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Certificate } from '@/types/certificate';

interface Props {
  cert: Certificate;
}

const props = defineProps<Props>();

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
}
</script>

<style scoped>
.cert-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 20px;
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 100%;
  position: relative;
  overflow: hidden;
}

.cert-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #1890ff;
}

/* 图片区域 */
.cert-image {
  width: 100%;
  height: 320px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  display: block;
  background-color: #fafafa;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.cert-card:hover .cert-image {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cert-img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
  transition: transform 0.3s ease;
}

.image-placeholder {
  font-size: 48px;
  color: #ccc;
  transition: color 0.3s ease;
}

.cert-card:hover .image-placeholder {
  color: #1890ff;
}

/* 证书信息 */
.cert-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cert-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  color: #333;
  transition: color 0.3s ease;
}

.cert-card:hover .cert-title {
  color: #1890ff;
}

.cert-link {
  color: #333;
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
}

.cert-link:hover {
  color: #1890ff;
  text-decoration: none;
}

/* 标签区域 */
.tags {
  margin: 4px 0 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  padding: 3px 10px;
  border: 1px solid #1890ff;
  border-radius: 12px;
  font-size: 11px;
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
  display: inline-block;
  transition: all 0.3s ease;
}

.cert-card:hover .tag {
  background-color: rgba(24, 144, 255, 0.1);
  border-color: #40a9ff;
}

/* 日期显示 */
.date {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.cert-card:hover .date {
  color: #999;
}

.icon {
  font-size: 12px;
  color: #999;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .cert-card {
    padding: 16px;
  }
  
  .cert-image {
    height: 160px;
  }
  
  .cert-title {
    font-size: 15px;
  }
  
  .detail-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>