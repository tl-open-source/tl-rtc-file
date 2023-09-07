import { useWindowSize } from '@vueuse/core';
import { Ref, computed, watch } from 'vue';
import { useRouteQueryReactive } from './useRouterReactive';

export const useSwitchMember = () => {
  const { width } = useWindowSize();
  const showMembers = useRouteQueryReactive('showMembers', '0', {
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

  return {
    open,
    switchMember,
    isLgScreen,
  };
};

export const useSwitchSiderbar = () => {
  const showSiderbar = useRouteQueryReactive('showSiderbar', '1', {
    transform: Number,
  }) as Ref<number>;

  const switchSiderbar = () => {
    showSiderbar.value = showSiderbar.value === 0 ? 1 : 0;
  };

  const open = computed(() => {
    return showSiderbar.value === 1;
  });

  return {
    switchSiderbar,
    open,
    showSiderbar,
  };
};
