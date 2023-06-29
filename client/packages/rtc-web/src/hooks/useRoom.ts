import { CommonFnType } from '@/types';
import { resolveRef } from '@/utils/reactive';
import { MaybeRef, computed } from 'vue';

export const useRoom = (value: MaybeRef<string> | CommonFnType) => {
  const realValue = resolveRef(value);
  const roomIdReg = /^[a-zA-Z0-9]{4,32}$/;

  function validateRoomId() {
    return roomIdReg.test(realValue.value as string);
  }

  const isValid = computed(() => validateRoomId());

  return {
    validateRoomId,
    isValid,
  };
};
