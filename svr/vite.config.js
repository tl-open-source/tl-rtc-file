const path = require("path");
const glob = require("glob");
const { fileURLToPath } = require("url");
const copy = require("rollup-plugin-copy");
const url = import.meta.url;

module.exports = {
    plugins: [
        copy({
            targets: [
              { src: 'res/*.html', dest: 'res/dist' },
              { src: 'res/image/*', dest: 'res/dist/image' }
            ]
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
                dir : "./res/dist/",
                entryFileNames: "[name].min.js",
                assetFileNames: "css/[name].min[extname]"
            },
        },
        minify: "terser",
        terserOptions: {
            compress: true,
            mangle:true,
            toplevel:false,
            keep_classnames:false
        },
        reportCompressedSize: false,
        sourcemap: false,
    },
};