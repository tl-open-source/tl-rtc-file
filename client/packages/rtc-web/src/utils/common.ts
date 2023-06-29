import { CommonFnType } from '@/types';

export function withBtnClickEvent(fn: CommonFnType) {
  return (e: Event) => {
    e.preventDefault();
    fn();
  };
}

export function preventDefault(e: Event) {
  e.preventDefault();
}
