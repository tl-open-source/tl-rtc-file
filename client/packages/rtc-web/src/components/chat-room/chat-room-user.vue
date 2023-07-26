<script lang="ts" setup>
import { Member } from '@/hooks';
import UserCard from './user-card.vue';
import { computed } from 'vue';
import { PropType } from 'vue';

defineOptions({
  name: 'ChatRoomUsers',
});

const props = defineProps({
  members: {
    type: Array as PropType<Partial<Member>[]>,
    default: () => [],
  },
  roomOwner: {
    type: Object as PropType<Partial<Member>>,
    default: () => ({}),
  },
  self: {
    type: Object as PropType<Partial<Member>>,
    default: () => ({}),
  },
});

const memberwithoutOwner = computed(() =>
  props.members.filter((item) => !item.owner)
);
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
