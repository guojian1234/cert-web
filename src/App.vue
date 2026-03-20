<!-- App.vue -->
<template>
  <div id="app">
    <!-- 导航栏 -->
    <header v-if="!isLoginPage" class="main-header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a href="/">
              <h1>证书管理系统</h1>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer v-if="!isLoginPage" class="main-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h3>证书管理系统</h3>
            <p>专业的证书管理平台</p>
          </div>
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><a href="/">首页</a></li>
              <li><a href="/certificate/list">证书列表</a></li>
              <li><a href="/admin">管理后台</a></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h4>联系我们</h4>
            <p>邮箱: contact@certificate-system.com</p>
            <p>电话: 123-456-7890</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} 证书管理系统. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isLoginPage = computed(() => {
  return route.path === '/login';
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 导航栏样式 */
.main-header {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  align-items: center;
  padding: 16px 0;
}

.logo h1 {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
}

.logo a {
  text-decoration: none;
  color: #1890ff;
}

/* 主内容样式 */
.main-content {
  min-height: calc(100vh - 120px);
}

/* 页脚样式 */
.main-footer {
  background-color: #1f1f1f;
  color: #ffffff;
  padding: 48px 0 24px;
  margin-top: 48px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.footer-info h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.footer-info p {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.6;
}

.footer-links h4,
.footer-contact h4 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #8c8c8c;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #1890ff;
}

.footer-contact p {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
  line-height: 1.6;
}

.footer-bottom {
  border-top: 1px solid #262626;
  padding-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #8c8c8c;
}

/* 页面过渡动画 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
  }
  
  .main-nav ul {
    gap: 16px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .main-content {
    min-height: calc(100vh - 160px);
  }
}
</style>