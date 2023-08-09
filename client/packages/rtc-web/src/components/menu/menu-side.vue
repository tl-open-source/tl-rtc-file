<script lang="ts" setup>
import MenuList from './menu-list.vue';
import { useSwitchSiderbar } from '@/hooks';

defineOptions({
  name: 'MenuSide',
});

const { open } = useSwitchSiderbar();
</script>

<template>
  <div v-show="open" class="menu h-full w-80 min-w-[320px] p-4">
    <MenuList />
  </div>
</template>

<style scoped>
/* */
</style>
