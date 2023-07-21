import { InitDataKey } from '@/context';
import { CommonFnType } from '@/types';
import { inject, ref, watch } from 'vue';

export const useSocket = <T>(fn: CommonFnType) => {
  const initData = inject(InitDataKey);

  const data = ref<T>();

  if (initData) {
    watch(
      () => initData.value.socket,
      async (v) => {
        data.value = await fn(v);
      }
    );
  }

  return {
    data,
  };
};
