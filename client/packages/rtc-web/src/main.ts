import { createApp } from 'vue';
import './assets/styles/index.css';

import router from './routes';

import 'virtual:svg-icons-register';
import SvgIcon from '@/components/base/svg-icon.vue';

import App from './App.vue';

function setup() {
  return createApp(App).use(router).component('svg-icon', SvgIcon);
}

setup().mount('#app');
