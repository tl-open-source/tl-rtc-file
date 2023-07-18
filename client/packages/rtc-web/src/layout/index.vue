<script lang="ts" setup>
import { MenuSide } from '@/components/menu';
import { NavHeader, FullHeightFlexBox } from '@/components/lib';
import { useInitData } from '@/hooks';
import { watch } from 'vue';

defineOptions({
  name: 'LayoutIndex',
});

const { initData } = useInitData();
console.log(initData);

watch(
  () => initData.value,
  (v) => {
    console.log(v);
  }
);
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
