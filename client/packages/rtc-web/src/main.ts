import { createApp } from 'vue';
import './assets/styles/index.css';
import App from './App.vue';

import 'virtual:svg-icons-register';
import SvgIcon from '@/components/base/svg-icon.vue';

function setup() {
  return createApp(App).component('svg-icon', SvgIcon);
}

setup().mount('#app');
