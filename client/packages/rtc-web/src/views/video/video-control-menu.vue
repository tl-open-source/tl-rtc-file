<script lang="ts" setup>
import { VideoControlMenuAction } from '@/config';
import { Modal } from '@/components/base';

import MenuAction from '@/components/menu-action.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'VideoControlMenu',
});

const router = useRouter();
const modalVisible = ref(false);

const emits = defineEmits(['controlMenuChange']);

const menuAction = ref(VideoControlMenuAction);

const activeMenu = ref<Set<string>>(new Set());

const useActiveMenu = (name: string) => {
  if (activeMenu.value.has(name)) {
    activeMenu.value.delete(name);
  } else {
    activeMenu.value.add(name);
  }
  emits('controlMenuChange', Array.from(activeMenu.value));
};

const handleClickIcon = (name: string) => {
  useActiveMenu(name);
  const menuItem = menuAction.value.find((item) => item.name === name);
  if (activeMenu.value.has(menuItem?.name || '')) {
    menuItem!.color = '#2F54EB';
  } else {
    menuItem!.color = '#707070';
  }

  modalVisible.value = activeMenu.value.has('hang-up');
};

const confirmExit = () => {
  router.replace({
    path: '/',
    query: {
      showSiderbar: 1,
    },
  });
};

const closeModal = () => {
  activeMenu.value.delete('hang-up');
  modalVisible.value = false;
};
</script>

<template>
  <div class="video-control-menu ml-[50%] flex translate-x-[-50%]">
    <div class="control-camera flex">
      <button class="btn-circle btn" @click="useActiveMenu('audio')">
        <svg-icon
          name="audio"
          :color="activeMenu.has('audio') ? '#2F54EB' : '#707070'"
          class="h-6 w-6"
        />
      </button>
      <div class="dropdown-top dropdown-end dropdown">
        <label tabindex="0" class="cursor-pointer">
          <svg-icon name="up" class="h-4 w-4" color="#707070" />
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu rounded-box z-[1] bg-base-100 shadow"
        >
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div>
    </div>

    <MenuAction
      :menu-action="menuAction"
      :gap="8"
      @click-icon="handleClickIcon"
    />
  </div>

  <Modal v-model:visible="modalVisible" :modal="false">
    <template #content> 确定要结束通话吗？ </template>
    <template #action>
      <div class="flex justify-end">
        <button class="btn-neutral btn mr-4" @click.prevent="closeModal">
          取消
        </button>
        <button class="btn-info btn" @click.prevent="confirmExit">确定</button>
      </div>
    </template>
  </Modal>
</template>
