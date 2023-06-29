import { CommonFnType } from '@/types';
import { computed, MaybeRef, ref } from 'vue';
export function resolveRef<T>(r: MaybeRef<T> | CommonFnType) {
  return typeof r === 'function' ? computed(r as any) : ref(r);
}
