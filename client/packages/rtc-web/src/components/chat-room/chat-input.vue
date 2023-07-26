<script lang="ts" setup>
import { computed } from 'vue';
import { ref } from 'vue';

defineOptions({
  name: 'ChatInput',
});

const msg = ref('');

const emits = defineEmits(['sendMsg']);

const canSend = computed(() => msg.value !== '');

const handleSend = () => {
  if (canSend.value) {
    emits('sendMsg', msg.value);
    msg.value = '';
  }
};
</script>

<template>
  <div class="flex flex-col rounded-lg border border-info">
    <textarea
      v-model="msg"
      class="textarea flex-1 resize-none border-b-0 focus:outline-none"
      placeholder="请输入聊天消息"
    ></textarea>
    <div class="mb-2 flex justify-end pr-4">
      <button
        class="btn-info btn px-3"
        :class="{ 'btn-disabled': !canSend }"
        @click="handleSend"
      >
        发送
      </button>
    </div>
  </div>
</template>
