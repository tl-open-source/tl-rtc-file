<script lang="ts" setup>
import EmojiPicker from '@/components/emoji/index.vue';

defineOptions({
  name: 'MenuActions',
});

type PropTypes = {
  menuAction: { name: string; tip: string; color?: string }[];
};

const props = withDefaults(defineProps<PropTypes>(), {
  menuAction: () => [] as PropTypes['menuAction'],
});

const emits = defineEmits(['clickIcon']);

const handleClick = (name: string) => emits('clickIcon', name);
</script>

<template>
  <div class="flex">
    <div
      v-for="item in props.menuAction"
      :key="item.name"
      :data-tip="item.tip"
      class="tooltip tooltip-bottom"
    >
      <emoji-picker v-if="item.name === 'emoji'" v-bind="$attrs">
        <svg-icon
          :color="item.color"
          :name="item.name"
          class="h-6 w-6 cursor-pointer"
          @click="handleClick(item.name)"
        />
      </emoji-picker>
      <svg-icon
        v-else
        :color="item.color"
        :name="item.name"
        class="h-6 w-6 cursor-pointer"
        @click="handleClick(item.name)"
      />
    </div>
  </div>
</template>
