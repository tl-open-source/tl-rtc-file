<script lang="ts" setup>
import { useVModel } from '@vueuse/core';

defineOptions({
  name: 'ToastBox',
});

type ToastTypes = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  msg?: string;
  type?: ToastTypes;
  closeable?: boolean;
  visible: boolean;
  horizontal?: 'left' | 'end' | 'center';
  vertical?: 'top' | 'middle' | 'bottom';
}

const props = withDefaults(defineProps<ToastProps>(), {
  msg: '',
  type: 'info',
  closeable: false,
  visible: false,
  horizontal: 'left',
  vertical: 'top',
});

const emits = defineEmits(['update:visible']);

const toastType = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

const horizontalType = {
  left: 'toast-start',
  end: 'toast-end',
  center: 'toast-center',
};

const verticalType = {
  top: 'toast-top',
  middle: 'toast-middle',
  bottom: 'toast-bottom',
};

const visiblevm = useVModel(props, 'visible', emits);

setTimeout(() => {
  visiblevm.value = false;
}, 1500);
</script>

<template>
  <div
    v-if="visiblevm"
    class="toast"
    :class="[horizontalType[props.horizontal], verticalType[props.vertical]]"
  >
    <div class="alert relative" :class="toastType[props.type]">
      <button
        v-if="props.closeable"
        class="btn-ghost btn-xs btn-circle btn absolute right-1 top-1"
        @click="visiblevm = false"
      >
        x
      </button>
      <span>{{ props.msg }}</span>
    </div>
  </div>
</template>
