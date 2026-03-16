// src/router/index.ts
import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router';
import CertificateList from '@/views/CertificateList.vue';

// 👇 从 main.ts 导入已创建的 pinia 实例
import { pinia } from '@/main';
// 👇 直接导入 store 函数
import { useAuthStore } from '@/stores/auth';

const routes = [
  // ... 你的公开路由 ...
  { path: '/', component: CertificateList },
  { path: '/certificate', component: CertificateList },
  {
    path: '/certificate/detail/:id',
    name: 'CertificateDetail',
    component: () => import('@/views/CertificateDetail.vue'),
  },
  // 登录页
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  // 管理后台 (受保护)
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      // 👇 关键点：将 pinia 实例作为参数传入！
      const authStore = useAuthStore(pinia);
      if (authStore.isAuthenticated) {
        next();
      } else {
        next({ name: 'Login', query: { redirect: to.fullPath } });
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;