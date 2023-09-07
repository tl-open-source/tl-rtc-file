<script lang="ts" setup>
import { PropType } from 'vue';

defineOptions({
  name: 'BackTitle',
});

const props = defineProps({
  svgName: {
    type: String as PropType<string>,
    required: true,
  },
  title: {
    type: String as PropType<string>,
    default: '',
  },
});
</script>

<template>
  <div class="flex items-center">
    <!-- <svg-icon :name="props.svgName" class="mr-1 h-8 w-8"></svg-icon> -->
    <div v-if="props.title">{{ props.title }}</div>
    <slot v-else></slot>
  </div>
</template>
