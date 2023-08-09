<script lang="ts" setup>
import { useSwitchSiderbar, useSwitchMember } from '@/hooks';
import { onMounted } from 'vue';
import { useVideoShare } from './hooks/useVideoCall';
import VideoControl from './video-control.vue';

defineOptions({
  name: 'VideoRoom',
});

const { showSiderbar } = useSwitchSiderbar();
const { open } = useSwitchMember();

const { video, enabled } = useVideoShare();

onMounted(() => {
  showSiderbar.value = 0;
});

const handleMenuChange = (active: string[]) => {
  console.log(active);
  enabled.value = active.includes('camera');
};
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-1 flex-col overflow-hidden">
      <video
        id="video-call"
        ref="video"
        class="flex-1"
        playsinline
        controls
        autoplay
      ></video>
      <VideoControl @control-menu-change="handleMenuChange" />
    </div>

    <div v-show="open" class="w-[400px]">user 列表</div>
  </div>
</template>
