<script lang="ts" setup>
import UserCard from './user-card.vue';
import { UserCardProps } from './props';

type ChatMessageProps = Partial<
  UserCardProps & {
    message: string;
    background: string;
  }
>;

defineOptions({
  name: 'ChatMessage',
});

const props = withDefaults(defineProps<ChatMessageProps>(), {
  iconname: 'user-smail',
  iconcolor: 'currentcolor',
  message: '',
  background: '',
});
</script>

<template>
  <UserCard v-bind="props">
    <div
      :style="{ backgroundColor: background }"
      class="flex max-w-[45%] flex-1 flex-wrap rounded-lg bg-slate-200 px-4 py-2 leading-6 text-black"
    >
      {{ props.message }}
    </div>
  </UserCard>
</template>
