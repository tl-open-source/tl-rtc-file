<script lang="ts" setup>
import { UserCardProps } from './props';

defineOptions({
  name: 'UserCard',
});

withDefaults(defineProps<UserCardProps>(), {
  iconname: 'member',
  iconcolor: 'currentcolor',
  username: '',
  time: '',
  reverse: false,
});
</script>

<template>
  <div
    class="user-card flex items-start"
    :class="[reverse ? 'flex-row-reverse' : '']"
  >
    <button class="btn-square btn border-0 bg-transparent">
      <svg-icon :name="iconname" class="h-8 w-8" :color="iconcolor" />
    </button>
    <div class="ml-1 flex flex-col text-sm">
      <div class="mb-1" :class="[reverse ? 'text-right' : 'text-left']">
        {{ username }}
        <span v-if="time" class="ml-4 text-slate-700 dark:text-gray-300">{{
          time
        }}</span>
      </div>
      <slot></slot>
      <!-- <div class="other-info"></div> -->
    </div>
  </div>
</template>
