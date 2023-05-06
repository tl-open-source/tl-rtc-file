const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const allConfig = require('./webpackall');
const {
    JS_PATH,
    CSS_PATH,
} = require('../comm/path');

const {
    startCompilerCss,
    startCompilerJs,
    watchFile
} = require('../comm/util');
const deleteCssJs = require('../plugin/deleteCssJs'); // 用于对打包css生成的无用js和js.map进行删除的操作
const watchNewEntry = require('../plugin/watchNewEntry'); // 用于watch时监听新增文件的监听

/**
 * 用于生产环境监听打包，打包出min版
 * @watchJs
 * @watchCss
 * * */
class Cli {
    constructor() {
        this.jsComplier = null; // 对应 js/dist 出口
        this.cssComplier = null; // 对应 css/dist 出口
    }

    watchJs() {
        this.jsComplier = webpack(merge(allConfig, {
            entry: watchNewEntry.getEntries(
                [
                    path.resolve(JS_PATH, './!(*.min).js'),  
                ],
            ),
            output: {
                libraryTarget: 'umd',
                globalObject: 'this',
                path: path.resolve(JS_PATH, "./"),
                filename: '[name].min.js',
            }
        }));

        // 开始编译并且监听
        this.jsComplier.watch({
            aggregateTimeout: 400,
            ignored: [
                path.resolve(JS_PATH, "./*.min.js"),
            ],
        }, startCompilerJs);

        process.stdout.write('开始webpack编译js目录' + '\n\n');
    }
   
    watchCss() {
        this.cssComplier = webpack(merge(allConfig, {
            entry: watchNewEntry.getEntries(
                [
                    path.resolve(CSS_PATH, './!(*.min).css'),  
                ],
            ),
            output: {
                libraryTarget: 'umd',
                globalObject: 'this',
                path: path.resolve(CSS_PATH, "./"),
                filename: "./cssJsDist/[name].min.js",
            },
            plugins: [
                new deleteCssJs(),
            ],
        }));

        // 开始编译监听
        this.cssComplier.watch({
            aggregateTimeout: 400,
            ignored: [
                path.resolve(CSS_PATH, "./*.min.css"),
            ],
        }, startCompilerCss);

        process.stdout.write('开始webpack编译css目录' + '\n\n');
    }
}

module.exports = new Cli();
