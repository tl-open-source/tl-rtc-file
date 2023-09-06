<script lang="ts" setup>
import Layout from '@/layout/index.vue';
import ErrorBoundary from '@/components/error-boundary/index.vue';
import { useErrorCaptured } from '@/hooks';

const errors = useErrorCaptured();
</script>

<!-- 这里后面可以加 provider、区分登录和未登录页面 -->
<template>
  <Suspense>
    <Layout />
    <template v-if="errors.length" #fallback>
      <ErrorBoundary
        class="h-screen"
        :tips-list="['服务器开小差了，请联系管理员']"
      />
    </template>
  </Suspense>
</template>
