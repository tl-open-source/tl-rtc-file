<script lang="ts" setup>
import { ChatContent, ChatRoomUser, ChatInput } from '@/components/chat-room';
import MenuAction from '@/components/menu-action.vue';
import { ChatInputAction } from '@/config';
import { useSwitchMember } from '@/views/chat/hooks/useSwitchMember';
import { useGetRoomInfo } from '@/hooks/useRoom';
import { useChat } from './hooks/useChat';
import { escapeStr } from '@/utils';
import dayjs from 'dayjs';
import { computed, ref } from 'vue';

defineOptions({
  name: 'ChatRoomCom',
});

const { open } = useSwitchMember();

const { members, roomOwner, self } = useGetRoomInfo();

const { sendMessage, msgList } = useChat();

const inputMsg = ref('');

const handleSendmsg = (msg: string) => {
  if (self.value) {
    const { roomInfo, nickName = '' } = self.value;
    sendMessage({
      content: escapeStr(msg),
      room: roomInfo?.roomId || '',
      from: roomInfo?.socketId || '',
      nickName,
      recoderId: roomInfo?.recoderId,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
};

const msgContent = computed(() =>
  msgList.value.map((item) => ({
    message: item.content,
    time: item.time,
    username: item.nickName,
    reverse: item.type === 'send',
  }))
);

const handleEmojiChange = (data: any) => {
  const unicode = parseInt(`0x${data.r}`, 16);
  inputMsg.value += String.fromCodePoint(unicode);
};
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-1 flex-col">
      <ChatContent class="flex-1 px-4 py-4" :msg-list="msgContent" />
      <div
        class="flex h-[260px] flex-col border-t pb-1.5 dark:border-neutral-600"
      >
        <MenuAction
          :menu-action="ChatInputAction"
          class="pl-2 pt-2"
          @emoji-change="handleEmojiChange"
        />
        <ChatInput
          v-model:msg="inputMsg"
          class="mt-2 flex-1"
          @send-msg="handleSendmsg"
        />
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
