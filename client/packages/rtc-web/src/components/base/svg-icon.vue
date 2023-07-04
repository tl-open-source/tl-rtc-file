<template>
  <svg aria-hidden="true" class="svg-icon stroke-current">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    hoverColor: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String as PropType<string>,
      default: 'currentcolor',
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);

    const realHoverColor = computed(() => props.hoverColor || props.color);
    return { symbolId, realHoverColor };
  },
});
</script>

<style scoped>
.svg-icon {
  &:hover {
    use {
      fill: v-bind(realHoverColor);
    }
  }
}
</style>
