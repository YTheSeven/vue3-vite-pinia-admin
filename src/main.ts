import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import pinia from './store';
import router from './router';
import { useMockPermissionStore } from './store/modules/mockPermission';

const app = createApp(App);
app.use(pinia);
app.use(router);

// 初始化 mock 权限配置（演示模式）
const mockPermissionStore = useMockPermissionStore();
mockPermissionStore.initConfig();

app.mount('#app');
