<script lang="ts" setup>
import { MenuSide } from '@/components/menu';
import { NavHeader, FullHeightFlexBox } from '@/components/lib';
import { useInitData } from '@/hooks';
import { provide } from 'vue';
import { InitDataKey } from '@/context';

defineOptions({
  name: 'LayoutIndex',
});

const { initData } = await useInitData();

provide(InitDataKey, initData);
</script>

<template>
  <FullHeightFlexBox dire="col">
    <NavHeader />
    <FullHeightFlexBox type="full">
      <MenuSide
        class="hidden dark:shadow-sm dark:shadow-neutral-600 lg:block lg:shadow-md"
      />
      <RouterView class="flex-1" />
    </FullHeightFlexBox>
  </FullHeightFlexBox>
</template>
