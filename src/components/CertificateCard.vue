<!-- src/components/CertificateCard.vue -->
<template>
  <div class="cert-card">
    <!-- 左侧：证书图片 -->
    <div class="cert-image">
      <img
        v-if="cert.imageUrl"
        :src="cert.imageUrl"
        :alt="cert.title"
        @error="handleImageError"
        loading="lazy"
      />
      <div v-else class="image-placeholder">
        🖼️
      </div>
    </div>

    <!-- 右侧：文字信息 -->
    <div class="cert-info">
      <h3>
        <a
          :href="cert.detailUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ cert.title }}
        </a>
      </h3>
      <div class="meta">
        <span>{{ cert.category }}</span>
        <span>{{ cert.domain }}</span>
        <span>{{ cert.publishDate }}</span>
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
  // 可选：替换为默认图标（这里保持隐藏，由 .image-placeholder 占位）
}
</script>

<style scoped>
.cert-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.cert-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cert-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 防止图片变形 */
}

.image-placeholder {
  font-size: 24px;
  color: #ccc;
}

.cert-info {
  flex: 1;
  min-width: 0; /* 允许文本溢出时换行 */
}

.cert-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.cert-info a {
  color: #1890ff;
  text-decoration: none;
  word-break: break-word; /* 长标题自动换行 */
}

.cert-info a:hover {
  text-decoration: underline;
}

.meta {
  font-size: 14px;
  color: #666;
  display: flex;
  gap: 12px;
  flex-wrap: wrap; /* 小屏下 meta 项自动换行 */
}
</style>