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

const RoomFormRef = shallowRef<InstanceType<typeof FormRoom> | null>(null);

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

const confirm = (formData: any) => {
  router.push(`/${currentCreateRoomByKey.value}/${formData?.roomId}`);
  currentCreateRoomByKey.value = '';
  modalVisible.value = false;
};

const handleClose = () => {
  const ref = RoomFormRef.value;
  if (ref) {
    ref.resetForm();
  }
};
</script>

<template>
  <div
    v-for="item in menuListData"
    :key="item.key"
    class="flex items-center justify-between"
  >
    <div>{{ item.label }}</div>
    <button
      class="btn-circle btn border-0 bg-transparent"
      @click="createRoom(item.key)"
    >
      <svg-icon :name="item.icon" class="h-5 w-5" />
    </button>
  </div>

  <Modal v-model:visible="modalVisible" :modal="false" @close="handleClose">
    <template #content>
      <FormRoom ref="RoomFormRef" />
    </template>
    <template #action>
      <div class="flex justify-end">
        <button class="btn-neutral btn mr-4" @click="cancel">取消</button>
        <button
          class="btn-info btn"
          @click.prevent="(e) => RoomFormRef?.onSubmit(confirm)(e)"
        >
          确定
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
