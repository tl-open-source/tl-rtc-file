import { useUrlSearchParams, useWindowSize } from '@vueuse/core';
import { computed, watch } from 'vue';

export const useSwitchMember = () => {
  const { width } = useWindowSize();

  const params = useUrlSearchParams<{ showMembers: string | undefined }>(
    'history'
  );

  if (params.showMembers === undefined) {
    params.showMembers = 'true';
  }

  const switchMember = () => {
    params.showMembers = params.showMembers === 'true' ? 'false' : 'true';
  };

  const open = computed(() => params.showMembers === 'true');

  const isIgScreen = computed(() => width.value <= 1024);

  watch(
    () => isIgScreen.value,
    (w) => {
      params.showMembers = w ? 'false' : 'true';
    }
  );

  return {
    open,
    switchMember,
    isIgScreen,
  };
};
