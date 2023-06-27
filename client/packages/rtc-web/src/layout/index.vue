<script lang="ts" setup>
import { MenuSide } from '@/components/base';
import { NavHeader, FullScreenBox, NavContent } from '@/components/lib';

defineOptions({
  name: 'LayoutIndex',
});
</script>

<template>
  <FullScreenBox dire="col">
    <NavHeader />
    <NavContent>
      <MenuSide class="hidden lg:block" />
      <div class="flex-1">content</div>
    </NavContent>
  </FullScreenBox>
</template>
