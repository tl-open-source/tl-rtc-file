<script lang="ts" setup>
import ChatMessage from './chat-message.vue';

defineOptions({
  name: 'ChatContent',
});

const props = defineProps<{
  msgList: {
    time: string;
    username: string;
    message: string;
    reverse: boolean;
  }[];
}>();
</script>

<template>
  <div class="flex flex-col justify-end overflow-y-auto overflow-x-hidden">
    <ChatMessage
      v-for="(item, index) in props.msgList"
      :key="index"
      class="mb-4"
      :time="item.time"
      :username="item.username"
      :message="item.message"
      :reverse="item.reverse"
      :background="item.reverse ? 'bg-success' : ''"
    />
  </div>
</template>
