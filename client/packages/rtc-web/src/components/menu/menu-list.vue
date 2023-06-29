<script lang="ts" setup>
import { ref } from 'vue';
import { Modal } from '../base';
import { withBtnClickEvent } from '@/utils';
import FormRoom from '../form-room/form-room.vue';
import { shallowRef } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'MenuList',
});

const router = useRouter();

const RoomFormRef = shallowRef<Record<string, InstanceType<typeof FormRoom>>>(
  {}
);

const menuListData = ref([
  {
    key: 'chat',
    icon: 'add-icon',
    label: '聊天',
  },
]);

const currentCreateRoomByKey = ref('');

const modalVisible = ref(false);

const createRoom = (key: string) => {
  modalVisible.value = true;
  currentCreateRoomByKey.value = key;
};

const cancel = withBtnClickEvent(() => {
  modalVisible.value = false;
});

const confirm = withBtnClickEvent(() => {
  const ref = RoomFormRef.value?.[currentCreateRoomByKey.value];
  if (ref) {
    const formData = ref.onSubmit();
    if (formData) {
      router.push(`/${currentCreateRoomByKey.value}/${formData?.roomId}`);
      currentCreateRoomByKey.value = '';
      modalVisible.value = false;
      ref.resetForm();
    }
  }
});
</script>

<template>
  <div
    v-for="item in menuListData"
    :key="item.key"
    class="flex items-center justify-between"
  >
    <div>{{ item.label }}</div>
    <button class="btn-circle btn bg-transparent" @click="createRoom(item.key)">
      <svg-icon :name="item.icon" class="h-5 w-5" />
    </button>

    <Modal v-model:visible="modalVisible" :modal="true">
      <template #content>
        <FormRoom :ref="(ref: any) => (RoomFormRef[item.key] = ref)" />
      </template>
      <template #action>
        <div class="flex justify-end">
          <button class="btn-neutral btn mr-4" @click="cancel">取消</button>
          <button class="btn-info btn" @click="confirm">确定</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped></style>
