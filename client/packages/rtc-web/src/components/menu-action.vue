<script lang="ts" setup>
import EmojiPicker from '@/components/emoji/index.vue';

defineOptions({
  name: 'MenuActions',
});

type PropTypes = {
  menuAction: {
    name: string;
    tip: string;
    color?: string;
    tipDir?: string;
    btn?: boolean;
    disabled?: boolean;
  }[];
  gap?: number;
};

const props = withDefaults(defineProps<PropTypes>(), {
  menuAction: () => [] as PropTypes['menuAction'],
  gap: 0,
});

const emits = defineEmits(['clickIcon']);

const handleClick = (name: string) => emits('clickIcon', name);
</script>

<template>
  <div class="flex">
    <div
      v-for="(item, index) in props.menuAction"
      :key="item.name"
      :data-tip="item.tip"
      class="tooltip"
      :class="[item.tipDir ?? 'tooltip-bottom', props.gap ? 'first:ml-0' : '']"
      :style="
        props.gap && index === 0
          ? `margin-left: 0`
          : props.gap
          ? `margin-left: ${props.gap}px`
          : ''
      "
    >
      <emoji-picker v-if="item.name === 'emoji'" v-bind="$attrs">
        <svg-icon
          :color="item.color"
          :name="item.name"
          class="h-6 w-6 cursor-pointer"
          @click="handleClick(item.name)"
        />
      </emoji-picker>
      <button
        v-else-if="item.btn"
        class="btn-circle btn"
        :disabled="item.disabled"
        @click="handleClick(item.name)"
      >
        <svg-icon
          :color="item.color"
          :name="item.name"
          class="h-6 w-6 cursor-pointer"
        />
      </button>
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
