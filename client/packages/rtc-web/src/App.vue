<script lang="ts" setup>
import Layout from '@/layout/index.vue';
</script>

<!-- 这里后面可以加 provider、区分登录和未登录页面 -->
<template>
  <Suspense>
    <Layout />
    <template #fallback>
      <div class="flex h-screen items-center justify-center">加载中...</div>
    </template>
  </Suspense>
</template>
