<script lang="ts" setup>
import { PropType } from 'vue';

defineOptions({
  name: 'UserCard',
});

defineProps({
  iconname: {
    type: String as PropType<string>,
    default: 'member',
  },
  iconcolor: {
    type: String as PropType<string>,
    default: 'currentcolor',
  },
  username: {
    type: String as PropType<string>,
    default: '',
  },
});
</script>

<template>
  <div class="user-card flex">
    <button class="btn-circle btn border-0 bg-transparent">
      <svg-icon :name="iconname" class="h-8 w-8" :color="iconcolor" />
    </button>
    <div class="ml-1 text-sm">
      <div>{{ username }}</div>
      <slot></slot>
      <!-- <div class="other-info"></div> -->
    </div>
  </div>
</template>
