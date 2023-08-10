<script lang="ts" setup>
import { useRoomConnect, useCreateRoom } from '@/hooks/useRoom';
import { BackPreviousLevel, BackTitle } from '@/components/back';
import VideoRoom from './video-room.vue';
import { useNow, useDateFormat } from '@vueuse/core';
import { resetUrl } from '@/utils';

defineOptions({
  name: 'VideoView',
});

const { roomId } = useCreateRoom();

useRoomConnect();

const handleBackLevel = () => resetUrl();

const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss');
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
      <VideoRoom />
    </div>
  </div>
</template>
