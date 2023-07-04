import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import { resolve } from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const pathResolve = (path: string) => resolve(__dirname, path);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: pathResolve('src'),
      },
    ],
  },
  plugins: [
    vue(),
    vueJsx(),
    eslintPlugin(),
    createSvgIconsPlugin({
      iconDirs: [pathResolve('src/assets/svg-icon')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
});
