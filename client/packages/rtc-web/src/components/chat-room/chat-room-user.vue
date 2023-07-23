<script lang="ts" setup>
import UserCard from './user-card.vue';

defineOptions({
  name: 'ChatRoomUsers',
});
</script>

<template>
  <div class="px-2 pt-2 text-sm">
    <div class="mb-1 text-gray-400">房主</div>
    <UserCard class="mb-8" />

    <div class="mb-1 text-gray-400">房间成员</div>
    <UserCard />
  </div>
</template>
