<script lang="ts" setup>
import ChatInput from './chat-input.vue';
import MenuAction from '../menu-action.vue';
import ChatRoomUser from './chat-room-user.vue';
import ChatContent from './chat-content.vue';
import { ChatInputAction } from '@/config';
import { useSwitchMember } from '@/views/chat/hooks/useSwitchMember';
import { useGetRoomInfo } from '@/hooks/useRoom';

const { open } = useSwitchMember();

const { members, roomOwner, self } = useGetRoomInfo();

const handleSendmsg = (msg: string) => {
  console.log(msg);
};

defineOptions({
  name: 'ChatRoomCom',
});
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-1 flex-col">
      <ChatContent class="flex-1 px-4 py-4" />
      <div
        class="flex h-[260px] flex-col border-t pb-1.5 dark:border-neutral-600"
      >
        <MenuAction :menu-action="ChatInputAction" class="pl-2 pt-2" />
        <ChatInput class="mt-2 flex-1" @send-msg="handleSendmsg" />
      </div>
    </div>
    <div
      v-if="open"
      class="hidden w-[220px] border-l dark:border-neutral-600 lg:block"
    >
      <ChatRoomUser :members="members" :room-owner="roomOwner" :self="self" />
    </div>
  </div>
</template>
