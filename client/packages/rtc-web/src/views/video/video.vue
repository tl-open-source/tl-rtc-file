<script lang="ts" setup>
import { useCreateRoom } from '@/hooks/useRoom';
import { BackPreviousLevel, BackTitle } from '@/components/back';
import VideoRoom from './video-room.vue';
import { useNow, useDateFormat } from '@vueuse/core';
import { resetUrl } from '@/utils';
import ErrorBoundary from '@/components/error-boundary/index.vue';
import { useErrorCaptured } from '@/hooks/useErrorCaptured';

defineOptions({
  name: 'VideoView',
});

const { roomId } = useCreateRoom('video', false);

const handleBackLevel = () => resetUrl();

const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss');

const errors = useErrorCaptured();
</script>

<template>
  <div class="flex w-full flex-col">
    <BackPreviousLevel
      class="py-2 shadow-md dark:shadow-sm dark:shadow-neutral-600"
      @back="handleBackLevel"
    >
      <BackTitle svg-name="chat" class="flex-1 justify-between">
        <div class="cursor-pointer">
          {{ roomId }}
        </div>
      </BackTitle>
      <div class="time pr-4 font-bold">{{ formatted }}</div>
    </BackPreviousLevel>

    <div class="min-h-0 flex-1">
      <Suspense>
        <VideoRoom />
        <template #fallback>
          <ErrorBoundary
            v-if="errors.length"
            :tips-list="[
              '请检查网络情况',
              '允许浏览器打开摄像头、麦克风权限',
              '清空浏览器缓存重新打开页面',
            ]"
          />
          <div v-else class="flex h-full w-full items-center justify-center">
            <span class="loading loading-dots loading-lg"></span>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>
