<script lang="ts" setup>
import { MenuSide } from '@/components/menu';
import { NavHeader, FullHeightFlexBox } from '@/components/lib';

defineOptions({
  name: 'LayoutIndex',
});
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
