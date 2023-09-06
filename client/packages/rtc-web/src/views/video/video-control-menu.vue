<script lang="ts" setup>
import { VideoControlMenuAction } from '@/config';
import { Modal } from '@/components/base';

import MenuAction from '@/components/menu-action.vue';
import { ref } from 'vue';
import { useDevicesList } from '@vueuse/core';
import SelectList from '@/components/list/select-list.vue';
import { Dropdown } from '@/components/base';
import { PropType } from 'vue';
import { computed } from 'vue';
import { resetUrl } from '@/utils';
import { nextTick } from 'vue';

defineOptions({
  name: 'VideoControlMenu',
});

const props = defineProps({
  activeControlMenu: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  menuDisabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  selectDevice: {
    type: Object as PropType<Record<'audioInput' | 'audioOutput', string>>,
    default: () => ({ audioInput: '', audioOutput: '' }),
  },
});

const modalVisible = ref(false);

const emits = defineEmits(['controlMenuChange', 'selectDevice']);

const menuAction = computed(() => {
  return VideoControlMenuAction.map((item) => ({
    ...item,
    disabled: props.menuDisabled,
    color: props.activeControlMenu.includes(item.name) ? '#2F54EB' : undefined,
  }));
});

const { audioInputs, audioOutputs } = useDevicesList();

const audioDropDownVisible = ref(false);

const selectedAudioDevice = (device: MediaDeviceInfo) => {
  emits('selectDevice', device);
  audioDropDownVisible.value = false;
};

const handleClickIcon = (name: string) => {
  if (name === 'hang-up') {
    modalVisible.value = true;
  }
  emits('controlMenuChange', name);
};

const closeModal = () => {
  modalVisible.value = false;
};
</script>

<template>
  <div class="video-control-menu ml-[50%] flex translate-x-[-50%]">
    <div class="control-camera flex">
      <button
        class="btn-circle btn"
        :disabled="menuDisabled"
        @click="handleClickIcon('audio')"
      >
        <svg-icon
          name="audio"
          :color="
            props.activeControlMenu.includes('audio') ? '#2F54EB' : '#707070'
          "
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
                    props.selectDevice.audioInput === item.deviceId
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
                    props.selectDevice.audioOutput === item.deviceId
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
        <button
          class="btn-info btn"
          @click.prevent="
            () => {
              nextTick(resetUrl);
            }
          "
        >
          确定
        </button>
      </div>
    </template>
  </Modal>
</template>
