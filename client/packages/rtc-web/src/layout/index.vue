<script lang="ts" setup>
import { MenuSide } from '@/components/menu';
import { NavHeader, FullHeightFlexBox } from '@/components/lib';
import { useInitData, useSwitchSiderbar } from '@/hooks';
import { provide } from 'vue';
import { InitDataKey } from '@/context';

defineOptions({
  name: 'LayoutIndex',
});
const { showSiderbar, open } = useSwitchSiderbar();

const { initData } = await useInitData();

provide(InitDataKey, initData);

const handleToggleSide = () => {
  showSiderbar.value = 1;
};
</script>

<template>
  <FullHeightFlexBox dire="col">
    <NavHeader :showSiderbar="open" @toggle="handleToggleSide" />
    <FullHeightFlexBox type="full">
      <MenuSide
        v-if="open"
        class="hidden dark:shadow-sm dark:shadow-neutral-600 lg:block lg:shadow-md"
      />
      <RouterView class="flex-1" />
    </FullHeightFlexBox>
  </FullHeightFlexBox>
</template>
