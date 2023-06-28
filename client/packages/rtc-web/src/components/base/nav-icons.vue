<script lang="ts" setup>
import { useSwitchTheme, ThemeEnum } from '@/hooks';
import { computed } from 'vue';

defineOptions({
  name: 'NavIcons',
});

const { themeInfo, setTheme } = useSwitchTheme();

const themeIcon = computed(() =>
  themeInfo.value === ThemeEnum.DARK ? 'moon' : 'sun'
);

const switchTheme = () =>
  setTheme(themeIcon.value === 'moon' ? ThemeEnum.LIGHT : ThemeEnum.DARK);
</script>

<template>
  <div>
    <a
      href="https://github.com/tl-open-source/tl-rtc-file"
      class="cursor-pointer"
    >
      <svg-icon
        name="github"
        class="h-6 w-6 stroke-current"
        hoverColor="#ffffffde"
      />
    </a>
    <button
      class="btn-circle btn ml-6 border-0 bg-transparent"
      @click="switchTheme"
    >
      <svg-icon :name="themeIcon" class="h-6 w-6 stroke-current" />
    </button>
  </div>
</template>

<style scoped></style>
