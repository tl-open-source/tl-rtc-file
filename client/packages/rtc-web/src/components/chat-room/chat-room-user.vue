<script lang="ts" setup>
import { Member, useDragChangeSize } from '@/hooks';
import UserCard from './user-card.vue';
import { computed, ref } from 'vue';
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
  width: {
    type: String as PropType<string>,
    default: '220px',
  },
});

const memberwithoutOwner = computed(() =>
  props.members.filter((item) => !item.owner)
);

const chatRoomUserRef = ref<any>();

const { style, canDragged } = useDragChangeSize(chatRoomUserRef, {
  initialSize: {
    width: props.width,
  },
  position: 'left',
  persistentSize: {
    height: '100%',
  },
});

const reSizeClass = computed(() => {
  if (canDragged.value.draggable) {
    if (canDragged.value.position === 'left') {
      return ['cursor-w-resize'];
    }
  }
  return [];
});
</script>

<template>
  <div
    ref="chatRoomUserRef"
    :class="[...reSizeClass]"
    class="h-full overflow-auto px-2 py-2 text-sm"
    :style="style"
  >
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
