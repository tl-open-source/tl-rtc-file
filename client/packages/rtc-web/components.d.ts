// components.d.ts
declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof import('./src/components/base/svg-icon.vue')['default'];
  }
}

export {};
