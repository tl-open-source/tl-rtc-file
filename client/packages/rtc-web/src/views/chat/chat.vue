<script lang="ts" setup>
import { onMounted } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useRoom } from '@/hooks';
import { BackPreviousLevel, BackTitle } from '@/components/back';
import { useRouteParams } from '@vueuse/router';

defineOptions({
  name: 'ChatView',
});

const router = useRouter();
const roomId = useRouteParams('roomId');

const { isValid } = useRoom((roomId.value as string) || '');

const checkParams = () => {
  if (!isValid.value) router.replace('/');
};

onMounted(checkParams);

onBeforeRouteUpdate((to, from) => {
  if (to.params.roomId !== from.params.roomId) {
    roomId.value = to.params.roomId;
    checkParams();
  }
});

const handleBackLevel = () => router.replace('/');
</script>

<template>
  <div class="flex w-full flex-col">
    <BackPreviousLevel class="border-b py-1" @back="handleBackLevel">
      <BackTitle svg-name="chat">
        {{ roomId }}
      </BackTitle>
    </BackPreviousLevel>

    <div class="flex-1">内容</div>
  </div>
</template>

<style scoped></style>
