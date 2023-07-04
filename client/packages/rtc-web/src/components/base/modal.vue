<script lang="ts" setup>
import { useVModel } from '@vueuse/core';
import { shallowRef, watch } from 'vue';
import { nanoid } from 'nanoid';
import { withBtnClickEvent } from '@/utils';

const dialogId = nanoid(10);

defineOptions({
  name: 'ModalBox',
});

type ModalBoxProps = {
  visible: boolean;
  showCloseButton?: boolean;
  modal?: boolean;
};

type SlotsType = {
  content(props?: any): any;
  action(props?: any): any;
};

type EmitEvents = {
  (e: 'update:visible', visible: boolean): void;
  (e: 'close'): void;
};

defineSlots<Partial<SlotsType>>();
const props = withDefaults(defineProps<ModalBoxProps>(), {
  showCloseButton: false,
});
const emits = defineEmits<EmitEvents>();

const visibleModel = useVModel(props, 'visible', emits);
const dialog = shallowRef<any>(null);

const openDialog = () => dialog.value?.showModal?.();
const closeDialog = () => {
  emits('close');
  dialog.value?.close?.();
};

const closeModal = withBtnClickEvent(() => {
  if (dialog.value) {
    visibleModel.value = false;
    closeDialog();
  }
});

watch(
  () => visibleModel.value,
  (v) => {
    if (v) {
      openDialog();
    } else {
      closeDialog();
    }
  }
);
</script>

<template>
  <dialog
    :id="dialogId"
    ref="dialog"
    class="modal modal-bottom sm:modal-middle"
  >
    <form class="modal-box">
      <button
        v-if="props.showCloseButton"
        class="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
        @click="closeModal"
      >
        ✕
      </button>

      <slot name="content">content</slot>

      <slot name="action" class="modal-action">
        <button class="btn" @click="closeModal">Close</button>
      </slot>
    </form>

    <form v-if="props.modal" class="modal-backdrop">
      <div @click="closeModal">close</div>
    </form>
  </dialog>
</template>

<style lang="scss" scoped></style>
