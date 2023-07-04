<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoom } from '@/hooks';

defineOptions({
  name: 'ChatView',
});

const router = useRouter();
const { params } = useRoute();

const { isValid } = useRoom((params.roomId as string) || '');

const checkParams = () => {
  console.log(isValid.value);
  if (!isValid.value) router.replace('/');
};

onMounted(checkParams);
</script>

<template>
  <div>我是chat - {{ params.roomId }}</div>
</template>

<style scoped></style>
