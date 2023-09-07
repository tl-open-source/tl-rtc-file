<script lang="ts" setup>
import { useRoom } from '@/hooks';
import { useForm } from '../form-base';
import { computed } from 'vue';

defineOptions({
  name: 'FormRoom',
});

const { formData, handleSubmit, register, resetFields, formErrors } = useForm<{
  roomId: string;
}>();

const { validateRoomId } = useRoom(() => formData.value.roomId || '');

const roomIdValid = computed(() => !formErrors.value['roomId']);

defineExpose({
  onSubmit: handleSubmit,
  resetForm: resetFields,
});
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-lg font-bold">创建/加入房间</h3>
    <div class="flex flex-col py-4">
      <input
        type="text"
        placeholder="请输入创建/加入房间的ID"
        :class="[
          'input-bordered',
          'input',
          'w-full',
          'max-w-xs',
          roomIdValid ? 'input-info' : 'input-error',
        ]"
        v-bind="{
          ...register('roomId', {
            validate: () => ({
              message: '房间ID在4-32个数字/英文字母之间',
              valid: validateRoomId(),
            }),
          }),
        }"
      />
      <div
        v-show="!roomIdValid"
        class="mt-4 leading-[20px]"
        :class="roomIdValid ? 'text-info' : 'text-error'"
      >
        {{ formErrors['roomId']?.message }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
