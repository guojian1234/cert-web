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

}



/* 图片区域 */
.cert-image {
  width: 200px; /* ← 放大到 160x160 */
  height: 200px;
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
  object-fit: fill;
  display: block;
}

.image-placeholder {
  font-size: 40px;
  color: #ccc;
}

.cert-info h3 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
  
}

.cert-info h3 a {
  color: #000000 !important; /* 纯黑 */
  text-decoration: none;
  display: inline-block; /* 避免行高问题 */
}

.cert-info h3 a:hover {
  text-decoration: underline;
  color: #000000 !important; /* 悬停也保持黑色 */
}

/* 标签区域 */
.tags {
  margin: 3px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 14px;
  border: 1px solid #000;
  border-radius: 8px; /* 调整此值以获得期望的圆角大小 */
  font-size: 12px;
  color: #333;
  display: inline-block; /* 确保标签不会因为内容过长而破坏布局 */
}

/* 日期显示 */
.date {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 30px;
}

.icon {
  font-size: 14px;
  color: #999;
}
</style>