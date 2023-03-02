import { createRouter, createWebHistory } from 'vue-router'
import rtcRoom from '../views/rtcRoom.vue'
import rtcChat from '../views/rtcChat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '进入房间',
      component: rtcRoom
    },
    {
      path: '/chat',
      name: '房间聊天中',
      component: rtcChat
    }
  ]
})

export default router
