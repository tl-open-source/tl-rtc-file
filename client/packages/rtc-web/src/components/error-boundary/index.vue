<script lang="ts" setup>
import { PropType } from 'vue';

defineOptions({
  name: 'ErrorBoundary',
});

const props = defineProps({
  tipsList: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <div v-if="props.tipsList.length">
      <p class="mb-2 font-bold">无法显示？也许可以帮到您：</p>
      <ul class="text-secondary">
        <li v-for="(item, index) in props.tipsList" :key="index">
          {{ index + 1 }}. {{ item }}
        </li>
      </ul>
    </div>

    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>
