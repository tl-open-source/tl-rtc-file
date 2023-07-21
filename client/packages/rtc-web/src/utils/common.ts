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

export function safenExecuteConditioFn(condition: boolean, fn: CommonFnType) {
  if (condition) {
    fn();
  }
}

// 将 socket on 转换为 promisify
export function transformSocketListenEvent(socket: any, ev: string) {
  return new Promise<any[]>((resolve) => {
    const cb = (...args: any[]) => {
      resolve(args);
    };
    socket.on(ev, cb);
  });
}
