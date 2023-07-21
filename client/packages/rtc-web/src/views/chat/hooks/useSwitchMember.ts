import { useWindowSize } from '@vueuse/core';
import { useRouteQuery } from '@vueuse/router';
import { computed, toRefs, watch } from 'vue';
import { useRoute } from 'vue-router';
import { isNaN } from 'lodash';

export const useSwitchMember = () => {
  const { width } = useWindowSize();

  const { query } = toRefs(useRoute());

  const showMembers = useRouteQuery('showMembers', '0', {
    transform: Number,
  });

  const switchMember = () => {
    showMembers.value = showMembers.value === 0 ? 1 : 0;
  };

  const open = computed(() => showMembers.value === 1);

  // 是否是宽屏， max-width = 1024
  const isLgScreen = computed(() => width.value <= 1024);

  watch(
    () => isLgScreen.value,
    (w) => {
      showMembers.value = w ? 0 : 1;
    },
    {
      immediate: true,
    }
  );

  watch(
    () => query.value.showMembers,
    (v) => {
      const nv = Number(v);
      if (!isNaN(nv)) {
        showMembers.value = nv;
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );

  return {
    open,
    switchMember,
    isLgScreen,
  };
};
