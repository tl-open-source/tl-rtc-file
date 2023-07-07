import path from "path";
import * as glob from "glob";
import { fileURLToPath } from 'url';
import copy from "rollup-plugin-copy";
const url = import.meta.url;

export default {
    plugins: [
        copy({
            targets: [
                { src: 'res/*.html', dest: 'res/dist' },
                { src: 'res/image/*', dest: 'res/dist/image' }
            ],
            hook: 'writeBundle',
            verbose: true
        })
    ],
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                glob.sync('res/*(js|css)/*.*(js|css)').map(file => [
                    path.relative(
                        './res',
                        file.slice(0, file.length - path.extname(file).length)
                    ),
                    fileURLToPath(new URL(file, url))
                ])
            ),
            output: {
                dir: "./res/dist/",
                entryFileNames: "[name].min.js",
                assetFileNames: "css/[name].min[extname]"
            },
        },
        minify: "terser",
        terserOptions: {
            compress: true,
            mangle: true,
            toplevel: false,
            keep_classnames: false
        },
        reportCompressedSize: false,
        sourcemap: false,
    },
};