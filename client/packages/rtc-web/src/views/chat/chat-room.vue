<script lang="ts" setup>
import { ChatContent, ChatRoomUser, ChatInput } from '@/components/chat-room';
import MenuAction from '@/components/menu-action.vue';
import { ChatInputAction } from '@/config';
import { useSwitchMember } from '@/views/chat/hooks/useSwitchMember';
import { useGetRoomInfo } from '@/hooks/useRoom';
import { useChat } from './hooks/useChat';
import { escapeStr } from '@/utils';
import dayjs from 'dayjs';
import { computed, ref, nextTick } from 'vue';
import { useDragChangeSize } from '@/hooks';

defineOptions({
  name: 'ChatRoomCom',
});

const { open } = useSwitchMember();

const { members, roomOwner, self } = useGetRoomInfo();

const { sendMessage, msgList } = useChat();

const inputMsg = ref('');

const chatMsgBoxRef = ref<any>(null);
const chatMsgContentRef = ref<Element | null>(null);

const { canDragged, style } = useDragChangeSize(chatMsgBoxRef, {
  initialSize: { height: '260px' },
  position: 'top',
  persistentSize: {
    width: '100%',
  },
});

const reSizeClass = computed(() => {
  if (canDragged.value.draggable) {
    if (canDragged.value.position === 'top') {
      return ['cursor-ns-resize'];
    }
  }
  return [];
});

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

    nextTick(() => {
      chatMsgContentRef?.value?.scroll({
        top: chatMsgContentRef.value.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
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
      <!-- 这里得多加一个 div 才能 scroll -->
      <div
        ref="chatMsgContentRef"
        class="ces min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4"
      >
        <ChatContent :msg-list="msgContent" />
      </div>
      <div
        ref="chatMsgBoxRef"
        :style="style"
        :class="[...reSizeClass]"
        class="flex h-[260px] max-h-[610px] flex-col border-t pb-1.5 dark:border-neutral-600"
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
    <ChatRoomUser
      v-show="open"
      class="hidden max-w-[400px] border-l dark:border-neutral-600 lg:block"
      width="220px"
      :members="members"
      :room-owner="roomOwner"
      :self="self"
    />
  </div>
</template>
