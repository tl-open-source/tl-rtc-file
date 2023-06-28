import { themeChange } from 'theme-change';
import { useLocalStorage, usePreferredDark } from '@vueuse/core';
import { onMounted, watch } from 'vue';

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

  return {
    themeInfo,
    setTheme,
  };
};

export const useSwitchTheme = () => {
  const { themeInfo, setTheme } = useTheme();

  watch(
    () => themeInfo.value,
    (v) => {
      document.documentElement.setAttribute('data-theme', v);
    },
    {
      immediate: true,
    }
  );

  return { themeInfo, setTheme };
};
