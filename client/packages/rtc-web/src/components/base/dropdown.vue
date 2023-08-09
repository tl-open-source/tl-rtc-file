<script lang="ts" setup>
import { useVModel } from '@vueuse/core';
import { PropType } from 'vue';

defineOptions({
  name: 'DropDown',
});

const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emits = defineEmits(['update:visible']);

const visibleVm = useVModel(props, 'visible', emits);
</script>

<template>
  <div class="dropdown-top dropdown-end dropdown">
    <label tabindex="0">
      <slot></slot>
    </label>
    <div
      v-if="visibleVm"
      tabindex="0"
      class="dropdown-content menu rounded-box z-[1] bg-base-100 shadow"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>
