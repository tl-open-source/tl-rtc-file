<script lang="ts" setup>
import { ref } from 'vue';
import { useRoom } from '@/hooks';

defineOptions({
  name: 'FormRoom',
});

const formData = ref<{ roomId: string }>({ roomId: '' });

const { isValid } = useRoom(() => formData.value.roomId);

const onSubmit = () => {
  if (isValid.value) {
    return formData.value;
  }
};

const resetForm = () => {
  formData.value.roomId = '';
};

const roomIdChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  formData.value.roomId = value;
};

defineExpose({
  onSubmit,
  resetForm,
});
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-lg font-bold">创建/加入房间</h3>
    <div class="flex flex-col py-4">
      <input
        :value="formData.roomId"
        type="text"
        placeholder="请输入创建/加入房间的ID"
        :class="[
          'input-bordered',
          'input',
          'w-full',
          'max-w-xs',
          isValid ? 'input-info' : 'input-error',
        ]"
        @input="roomIdChange"
      />
      <div
        v-show="!isValid"
        class="mt-4 leading-[20px]"
        :class="isValid ? 'text-info' : 'text-error'"
      >
        房间ID在4-32个数字/英文字母之间
      </div>
    </div>
  </div>
</template>

<style scoped></style>
