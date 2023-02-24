import Antd from 'ant-design-vue';
// import { Button } from 'ant-design-vue';
// import Button from 'ant-design-vue/lib/button'
export default defineNuxtPlugin((nuxtApp)=>{
    nuxtApp.vueApp.use(Antd);
})
  