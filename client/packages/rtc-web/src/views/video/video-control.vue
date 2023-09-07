<script lang="ts" setup>
import MenuAction from '@/components/menu-action.vue';
import { ref, watch } from 'vue';
import { VideoMenuAction } from '@/config';
import { useSwitchMember } from '@/hooks';
import VideoControlMenu from './video-control-menu.vue';
import { useAttrs } from 'vue';

defineOptions({
  name: 'VideoControl',
});

const attrs = useAttrs();

const chatActionMenu = ref(VideoMenuAction);

const { switchMember, isLgScreen, open } = useSwitchMember();

watch(
  () => open.value,
  (v) => {
    const findv = chatActionMenu.value.find((item) => item.name === 'member');
    if (findv) {
      findv.color = v ? '#2F54EB' : undefined;
    }
  },
  { immediate: true }
);

const handleClickIcon = (name: string) => {
  if (name === 'member' && !isLgScreen.value) {
    switchMember();
  }
};
</script>

<template>
  <div class="flex items-center justify-between px-4 py-4">
    <VideoControlMenu v-bind="attrs" />
    <MenuAction :menu-action="chatActionMenu" @click-icon="handleClickIcon" />
  </div>
</template>
