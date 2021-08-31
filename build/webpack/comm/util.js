const glob = require('glob');
const path = require("path");
const fs = require("fs");

const readline = require('readline')
const Concat = require('concat-with-sourcemaps');

let jsCount = 1;
let jsIsFirst = true;

const Log = require("./log");
const {
    JS_PATH,
    CSS_PATH,
} = require("./path");

// 将后缀 .src.css .src.js .js .css 截断
const removeExt = (pathname) => {
    let idx = -1;
    if (pathname.indexOf('.src.') !== -1) {
        idx = pathname.indexOf('.src.');
    } else {
        idx = pathname.indexOf('.js') === -1 ? pathname.indexOf('.css') : pathname.indexOf('.js');
    }
    if (idx === -1) {
        return pathname;
    } else {
        return pathname.substring(0, idx);
    }
};


// 将 \ 反斜杠 换成 / 正斜杠
const unifiedSlash = (pathname) => {
    return pathname.replace(/\\/g, '/');
};


// 执行编译后的回调函数
const startCompiler = (err, stats, resolve, reject) => {
    return new Promise((res)=>{
        if (err) {
            Log.error(err.stack || err);
            if (err.details) {
                Log.error(err.details);
            }
            typeof reject === "function" && reject();
            return;
        }
    
        const info = stats.toJson();
    
        if (stats.hasErrors()) {
            Log.error('webpack', '编译错误，错误信息如下：');
            info.errors.forEach(err => {
                Log.error('error', err);
            });
            typeof reject === 'function' && reject();
        }
    
        if (stats.hasWarnings()) {
            Log.warn('webpack', '编译提醒信息如下：');
            info.warnings.forEach(warning => {
                Log.warn(warning)
            })
        }

        typeof resolve === 'function' && resolve();
        Log.log(stats.toString({
            hash: true,
            timings: true,
            version: true,
            cached: false,
            cachedAssets: false,
            colors: true,
            modules: false,
            children: false,
            resons: false,
            source: false,
            chunks: false,
            chunkModules: false,
            entrypoints: false
        }) + '\n\n');
        res();
    })
};

/**
 * 文件是否更新
 * @param pathArr
 */
const watchFile = ( pathArr ) => {
    if(!pathArr || !(pathArr instanceof Array)){
        return;
    }
    for (let pathArrKey in pathArr) {
        fs.watch(pathArr[pathArrKey],(event,filename)=>{
            if (filename && event === 'change') {
                buildAllFListJS(['features.js','template.js']);
            }
        })
    }
};

const startCompilerCss = (err, stats, resolve, reject) => {
    return startCompiler(err, stats, resolve, reject);
};

const startCompilerJs = (err, stats, resolve, reject) => {
    return startCompiler(err, stats, resolve, reject);
};


function transformFListFileToArray(partitionFilePath) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(partitionFilePath),
            terminal: false,
            crlfDelay: Infinity,
        });

        const files = [];
    
        rl.on('line', (line) => {
            if (!line.includes("<!--")) {
                files.push(line)
            }
        });
    
        rl.on('close', function () {
            resolve(files);
        })
    })
}

/**
 * 合并某个目录下的js到js目录下
 */
function buildSingleFListJs(pathname = '') {
    if (pathname === '') return buildAllFListJS();

    const _flist = path.resolve(pathname, './_flist')
    const outputFileName = path.basename(pathname).replace('.js', '.src.js');

    /**
     * 按照_flist的顺序合并为一个src文件，src文件统一放到flist下面
     */
    transformFListFileToArray(_flist).then((files) => {
        const concat = new Concat(false, outputFileName, '\n');
        files.forEach(filename => {
            concat.add(filename, fs.readFileSync(path.resolve(pathname, `./${filename}`)))
        });
        fs.writeFile(path.resolve(pathname, `../single/${outputFileName}`), concat.content, (err) => {
            if (err) throw err
        });
    })
}

/**
 * 合并目录下所有的xx.js的目录
 */
function buildAllFListJS(pathArr = []) {
    if(pathArr === undefined || pathArr.length === 0){
        return;
    }
    for(let i = 0; i < pathArr.length; i++){
        glob.sync(path.resolve(JS_PATH, pathArr[i])).forEach(buildSingleFListJs);
    }
}


module.exports = {
    unifiedSlash,
    startCompilerCss,
    startCompilerJs,
    startCompiler,
    removeExt,
    buildAllFListJS,
    watchFile
};