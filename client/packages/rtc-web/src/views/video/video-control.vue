<script lang="ts" setup>
import MenuAction from '@/components/menu-action.vue';
import { ref, watch } from 'vue';
import { VideoMenuAction } from '@/config';
import { useSwitchMember } from '@/hooks';
import VideoControlMenu from './video-control-menu.vue';

defineOptions({
  name: 'VideoControl',
});

const emits = defineEmits(['controlMenuChange', 'deviceIdChange']);

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

const controlMenuChange = (active: string[]) =>
  emits('controlMenuChange', active);
</script>

<template>
  <div class="flex items-center justify-between px-4 py-4">
    <VideoControlMenu @control-menu-change="controlMenuChange" />
    <MenuAction :menu-action="chatActionMenu" @click-icon="handleClickIcon" />
  </div>
</template>
