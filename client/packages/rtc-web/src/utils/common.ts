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

// 转义字符串
export function escapeStr(str: string) {
  const entityMap: any = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  const encodedMap: any = {
    '%': '%25',
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A',
    '-': '%2D',
    '.': '%2E',
    _: '%5F',
    '~': '%7E',
  };

  return String(str).replace(/[&<>"'`=/%!'()*\-._~]/g, function (s) {
    return entityMap[s] || encodedMap[s] || '';
  });
}
