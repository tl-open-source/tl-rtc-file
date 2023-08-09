<script lang="ts" setup generic="T">
defineOptions({
  name: 'SelectList',
});

type SelectListPropsType<L> = {
  list: L[];
  uniKey?: string;
  title?: string;
};

const emits = defineEmits(['selected']);

const props = withDefaults(defineProps<SelectListPropsType<T>>(), {
  list: () => [] as T[],
  uniKey: '',
  title: '',
});

const handleSelected = (item: any) => {
  emits('selected', item);
};
</script>

<template>
  <div class="flex flex-col pb-1">
    <div v-if="props.title" class="list-title select-none px-2 text-slate-500">
      {{ props.title }}
    </div>
    <ul class="flex flex-col">
      <li
        v-for="(item, index) in props.list"
        :key="props.uniKey ? (item as any)[props.uniKey] : index"
        @click="handleSelected(item)"
      >
        <slot :item="item"></slot>
      </li>
    </ul>
  </div>
</template>
