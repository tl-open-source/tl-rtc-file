import { useRouteParams } from '@vueuse/router';
import { Ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export const useRouteParamsReactive = <T extends string>(keys: T[]) => {
  const params = keys.reduce(
    (cur, next) => ({ ...cur, [next]: useRouteParams(next) }),
    {} as Record<T, Ref<string | string[] | null>>
  );

  const route = useRoute();

  watch(
    () => route.params,
    (v) => {
      Object.keys(v).forEach((key) => {
        if (params[key as T]) {
          params[key as T].value = v[key];
        }
      });
    },
    {
      immediate: true,
    }
  );

  return params;
};
