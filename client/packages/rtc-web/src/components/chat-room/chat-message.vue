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
  inheritAttrs: true,
});

const props = withDefaults(defineProps<ChatMessageProps>(), {
  iconname: 'user-smail',
  iconcolor: 'currentcolor',
  message: '',
  background: '',
  reverse: false,
});
</script>

<template>
  <UserCard v-bind="props">
    <div
      class="flex flex-wrap"
      :class="[reverse ? 'justify-end' : 'justify-start']"
    >
      <div
        class="whitespace-pre-wrap rounded-lg px-4 py-2 leading-6 text-black"
        :class="[background ? background : 'bg-slate-200']"
      >
        {{ props.message }}
      </div>
    </div>
  </UserCard>
</template>
