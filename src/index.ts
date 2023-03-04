import { createApp } from 'vue';
import '@/styles/index.scss'
import router from './router'
import App from './App.vue';
import store from './store'
const app = createApp(App)
app.use(store).use(router).mount('#app')