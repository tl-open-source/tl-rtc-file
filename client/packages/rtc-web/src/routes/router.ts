export const routes = [
  { path: '/', component: () => import('@/views/welcome.vue') },
  { path: '/chat', component: () => import('@/views/chat/chat.vue') },
];
