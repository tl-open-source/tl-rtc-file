<script lang="ts" setup>
import { useSwitchTheme, ThemeEnum } from '@/hooks';
import { computed } from 'vue';
import { useSocketCount } from '@/hooks';

defineOptions({
  name: 'NavIcons',
});

// 获取 当前在线人数
const { data: curCount } = useSocketCount();

const { themeInfo, setTheme, isDark } = useSwitchTheme();

const themeIcon = computed(() =>
  themeInfo.value === ThemeEnum.DARK ? 'moon' : 'sun'
);

const switchTheme = () =>
  setTheme(themeIcon.value === 'moon' ? ThemeEnum.LIGHT : ThemeEnum.DARK);
</script>

<template>
  <div>
    <div class="flex items-center text-sm">
      <svg-icon name="count" class="mr-2 h-3 w-3" />
      在线人数：
      <div class="font-semibold">
        {{ curCount }}
      </div>
    </div>
    <a
      href="https://github.com/tl-open-source/tl-rtc-file"
      class="ml-8 cursor-pointer"
    >
      <svg-icon
        name="github"
        class="h-6 w-6 stroke-current"
        :hoverColor="isDark ? '#ffffffde' : '#3c3c3cb3'"
      />
    </a>
    <button
      class="btn-circle btn ml-6 border-0 bg-transparent"
      @click="switchTheme"
    >
      <svg-icon
        :name="themeIcon"
        :color="!isDark ? 'black' : undefined"
        class="h-6 w-6"
      />
    </button>
  </div>
</template>

<style scoped></style>
