import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'
import './assets/css/main.css'
import './assets/css/icon.css'
const app = createApp(App)

app.use(router)
app.use(Antd)
app.mount('#app')
