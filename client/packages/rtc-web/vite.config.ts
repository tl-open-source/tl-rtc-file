import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import { resolve } from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';

import fs from 'fs';

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const pathResolve = (path: string) => resolve(__dirname, path);

// http://localhost:9092/api
// https://im.iamtsm.cn/api

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../../../client_dist/rtc-web'),
    minify: 'terser',
    emptyOutDir: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: pathResolve('src'),
      },
    ],
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://192.168.1.11:9092/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
    https: {
      key: fs.readFileSync('./src/keys/server.key'),
      cert: fs.readFileSync('./src/keys/server.crt'),
    },
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
    // basicSsl(),
    // mkcert({
    //   source: 'coding',
    // }),
  ],
});
