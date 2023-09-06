import { createApp } from 'vue';
import './assets/styles/index.css';

import router from './routes';

import 'virtual:svg-icons-register';
import SvgIcon from '@/components/base/svg-icon.vue';

import App from './App.vue';

import VConsole from 'vconsole';
import { useUserAgent } from '@/hooks';

const { isMobile } = useUserAgent();

function setup() {
  if (isMobile) {
    new VConsole();
  }
  return createApp(App).use(router).component('svg-icon', SvgIcon);
}

setup().mount('#app');
