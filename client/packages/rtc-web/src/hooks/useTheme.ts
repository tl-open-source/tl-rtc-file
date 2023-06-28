import { useLocalStorage, usePreferredDark } from '@vueuse/core';
import { watch, computed } from 'vue';

export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export const useTheme = () => {
  const isPreferredDark = usePreferredDark();

  const themeInfo = useLocalStorage<ThemeEnum>(
    'rtc-theme',
    isPreferredDark ? ThemeEnum.DARK : ThemeEnum.LIGHT
  );

  const setTheme = (theme: ThemeEnum) => {
    themeInfo.value = theme;
  };

  const isDark = computed(() => themeInfo.value === ThemeEnum.DARK);

  return {
    themeInfo,
    setTheme,
    isDark,
  };
};

export const useSwitchTheme = () => {
  const themeInfomation = useTheme();
  const { themeInfo } = themeInfomation;

  watch(
    () => themeInfo.value,
    (v) => {
      document.documentElement.setAttribute('data-theme', v);
    },
    {
      immediate: true,
    }
  );

  return { ...themeInfomation };
};
