import { useRouteParams, useRouteQuery } from '@vueuse/router';
import { Ref, toRefs, watch } from 'vue';
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

export const useRouteQueryReactive = (
  ...args: Parameters<typeof useRouteQuery>
) => {
  const { query } = toRefs(useRoute());

  const [key, defaultValue, options] = args;
  const valueRef = useRouteQuery(key, defaultValue, options);

  watch(
    () => query.value[key],
    (v: any) => {
      const nv = options?.transform?.(v);
      if (options?.transform === Number) {
        if (!isNaN(nv as number)) {
          valueRef.value = nv;
        }
      } else {
        valueRef.value = nv;
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );

  return valueRef;
};
