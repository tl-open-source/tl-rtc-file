<script lang="ts" setup>
import { VideoControlMenuAction } from '@/config';
import { Modal } from '@/components/base';

import MenuAction from '@/components/menu-action.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDevicesList } from '@vueuse/core';
import SelectList from '@/components/list/select-list.vue';
import { Dropdown } from '@/components/base';
import { watchEffect } from 'vue';

defineOptions({
  name: 'VideoControlMenu',
});

const router = useRouter();
const modalVisible = ref(false);

const emits = defineEmits(['controlMenuChange', 'selectDevice']);

const menuAction = ref(VideoControlMenuAction);

const activeMenu = ref<Set<string>>(new Set());

const { audioInputs, audioOutputs } = useDevicesList();

const audioDropDownVisible = ref(false);

const audioDeviceRef = ref<MediaDeviceInfo[]>([]);

// 麦克风
const inputStop = watchEffect(() => {
  if (audioInputs.value.length) {
    const findDefault = audioInputs.value.find(
      (item) => item.deviceId === 'default'
    );
    if (findDefault) {
      selectedAudioDevice(findDefault);
      inputStop();
    }
  }
});

// 扬声器
const outputStop = watchEffect(() => {
  if (audioOutputs.value.length) {
    const findDefault = audioOutputs.value.find(
      (item) => item.deviceId === 'default'
    );
    if (findDefault) {
      selectedAudioDevice(findDefault);
      outputStop();
    }
  }
});

const selectedAudioDevice = (device: MediaDeviceInfo) => {
  if (device.kind === 'audioinput') audioDeviceRef.value[0] = device;
  if (device.kind === 'audiooutput') audioDeviceRef.value[1] = device;
  emits('selectDevice', device);
  audioDropDownVisible.value = false;
};

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
      <Dropdown v-model:visible="audioDropDownVisible">
        <svg-icon
          name="up"
          class="h-4 w-4 cursor-pointer"
          color="#707070"
          @click="audioDropDownVisible = true"
        />
        <template #content>
          <div class="panel">
            <SelectList
              title="选择麦克风"
              :list="audioInputs"
              @selected="selectedAudioDevice"
            >
              <template #default="{ item }">
                <div
                  :class="[
                    audioDeviceRef[0].deviceId === item.deviceId
                      ? 'text-[#2F54EB]'
                      : '',
                  ]"
                >
                  {{ item.label }}
                </div>
              </template>
            </SelectList>
            <SelectList
              title="选择扬声器"
              :list="audioOutputs"
              @selected="selectedAudioDevice"
            >
              <template #default="{ item }">
                <div
                  :class="[
                    audioDeviceRef[1].deviceId === item.deviceId
                      ? 'text-[#2F54EB]'
                      : '',
                  ]"
                >
                  {{ item.label }}
                </div>
              </template>
            </SelectList>
          </div>
        </template>
      </Dropdown>
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
