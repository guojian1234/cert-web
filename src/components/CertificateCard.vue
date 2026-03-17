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
      />
      <div v-else class="image-placeholder">
        🖼️
      </div>
    </div>

    <!-- 右侧：文字信息 -->
    <div class="cert-info">
      <!-- 证书名称 -->
      <h3>
        <a
          :href="cert.detailUrl"
          target="_blank"
          rel="noopener noreferrer"
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
  gap: 24px; /* 增大间距 */
  align-items: flex-start;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;
}

.cert-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 图片区域 */
.cert-image {
  width: 160px; /* ← 放大到 160x160 */
  height: 160px;
  flex-shrink: 0;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.cert-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-placeholder {
  font-size: 40px;
  color: #ccc;
}

/* 文字区域 */
.cert-info {
  flex: 1;
  min-width: 0;
}

.cert-info h3 {
  margin: 0 0 12px;
  font-size: 20px; /* ← 放大标题 */
  font-weight: 600;
  line-height: 1.4;
  color: #1a1a1a;
}

.cert-info a {
  color: #1890ff;
  text-decoration: none;
  word-break: break-word;
}

.cert-info a:hover {
  text-decoration: underline;
}

/* 标签区域 */
.tags {
  margin: 8px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-size: 12px;
  color: #333;
  background-color: #f5f5f5;
}

/* 日期显示 */
.date {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.icon {
  font-size: 14px;
  color: #999;
}
</style>