<script lang="ts" setup>
import Popper from 'vue3-popper';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import { useTheme } from '@/hooks';
import { ref } from 'vue';

defineOptions({
  name: 'EmojiPicker',
});

const emits = defineEmits(['emojiChange']);

const { isDark } = useTheme();

const visibleEmoji = ref(false);

const onSelectEmoji = (data: any) => {
  emits('emojiChange', data);
};
</script>

<template>
  <Popper
    @open:popper="visibleEmoji = true"
    @close:popper="visibleEmoji = false"
  >
    <slot></slot>

    <template #content>
      <EmojiPicker
        v-if="visibleEmoji"
        :native="true"
        :theme="isDark ? 'dark' : 'light'"
        @select="onSelectEmoji"
      />
    </template>
  </Popper>
</template>
