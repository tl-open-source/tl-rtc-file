<script lang="ts" setup>
import { MenuSide } from '@/components/base';
import { NavHeader, FullHeightFlexBox } from '@/components/lib';

defineOptions({
  name: 'LayoutIndex',
});
</script>

<template>
  <FullHeightFlexBox dire="col">
    <NavHeader />
    <FullHeightFlexBox type="full">
      <MenuSide class="hidden lg:block" />
      <RouterView />
    </FullHeightFlexBox>
  </FullHeightFlexBox>
</template>
