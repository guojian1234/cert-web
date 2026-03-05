// src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

// 👇 必须先 use(pinia)，再 use(router)
// 因为 router 的守卫里要用到 pinia
app.use(pinia);
app.use(router);

app.mount('#app');

// 👇 导出 pinia 实例，供 router 文件使用
export { pinia };