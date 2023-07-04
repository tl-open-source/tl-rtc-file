export const routes = [
  { path: '/', component: () => import('@/views/welcome.vue') },
  { path: '/chat/:roomId', component: () => import('@/views/chat/chat.vue') },
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect() {
      return { path: '/' };
    },
  },
];
