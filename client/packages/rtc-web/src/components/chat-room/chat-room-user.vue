<script lang="ts" setup>
import { useGetRoomInfo } from '@/hooks';
import UserCard from './user-card.vue';
import { computed } from 'vue';

const { members, roomOwner, self } = useGetRoomInfo();
const memberwithoutOwner = computed(() =>
  members.value.filter((item) => !item.owner)
);

defineOptions({
  name: 'ChatRoomUsers',
});
</script>

<template>
  <div class="px-2 pt-2 text-sm">
    <div class="mb-1 text-gray-400">房主</div>
    <UserCard
      class="mb-4"
      iconcolor="#2F54EB"
      :username="
        roomOwner?.id === self?.id
          ? `${roomOwner?.nickName} (本人)`
          : roomOwner?.nickName
      "
    />

    <div class="mb-1 text-gray-400">
      房间成员 ({{ memberwithoutOwner.length }})
    </div>
    <UserCard
      v-for="item in memberwithoutOwner"
      :key="item.id"
      :username="
        item.id === self?.id ? `${item.nickName} (本人)` : item.nickName
      "
      iconname="user-smail"
    />
  </div>
</template>
