<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCreateRoom } from '@/hooks';
import { BackPreviousLevel, BackTitle } from '@/components/back';
import { ChatRoomCom } from '@/components/chat-room';
import MenuAction from '@/components/menu-action.vue';
import { ChatAction } from '@/config';
import { useSwitchMember } from './hooks/useSwitchMember';

defineOptions({
  name: 'ChatView',
});

const router = useRouter();

const { roomId } = useCreateRoom();

const { switchMember, open, isLgScreen } = useSwitchMember();

const chatActionMenu = ref(ChatAction);

watch(
  () => open.value,
  (v) => {
    const findv = chatActionMenu.value.find((item) => item.name === 'member');
    if (findv) {
      findv.color = v ? '#2F54EB' : undefined;
    }
  },
  { immediate: true }
);

const handleBackLevel = () => router.replace('/');

const handleClickIcon = (name: string) => {
  if (name === 'member' && !isLgScreen.value) {
    switchMember();
  }
};
</script>

<template>
  <div class="flex w-full flex-col">
    <BackPreviousLevel
      class="py-2 shadow-md dark:shadow-sm dark:shadow-neutral-600"
      @back="handleBackLevel"
    >
      <BackTitle svg-name="chat" class="flex-1 justify-between">
        <div class="cursor-pointer">
          {{ roomId }}
        </div>
        <MenuAction
          :menu-action="chatActionMenu"
          class="mr-6"
          @click-icon="handleClickIcon"
        />
      </BackTitle>
    </BackPreviousLevel>

    <div class="min-h-0 flex-1">
      <ChatRoomCom />
    </div>
  </div>
</template>

<style scoped></style>
