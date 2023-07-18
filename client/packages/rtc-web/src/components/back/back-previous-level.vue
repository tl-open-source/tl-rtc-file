<script lang="ts" setup>
defineOptions({
  name: 'BackPreviousLevel',
});

const emits = defineEmits(['back']);
</script>

<template>
  <div class="flex items-center">
    <button
      class="btn-circle btn border-0 bg-transparent"
      @click="emits('back')"
    >
      <svg-icon name="back" class="h-6 w-6" />
    </button>
    <slot></slot>
  </div>
</template>
