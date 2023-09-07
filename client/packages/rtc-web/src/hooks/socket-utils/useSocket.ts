import { InitDataKey } from '@/context';
import { CommonFnType } from '@/types';
import { inject, watch } from 'vue';

export const useSocket = (fn?: CommonFnType) => {
  const initData = inject(InitDataKey);

  if (initData) {
    watch(
      () => initData.value.socket,
      async (v) => {
        if (v) {
          await fn?.(v);
        }
      },
      {
        immediate: true,
      }
    );
  }
};
