const path = require('path');
const glob = require('glob');
const globBase = require('glob-base');
const { removeExt, unifiedSlash } = require('../comm/util');

const directories = [];

/**
 * 由于webpack的watch不会对新增文件进行编译，使用这个插件可以在watch状态下可以检测到新增文件入口。
 * */
class WatchNewEntry {
    static getEntries(globEntries, globOptions = {}) {
        return function () {
            if (!Array.isArray(globEntries)) {
                throw new TypeError('globEntries must be an array of strings');
            }

            if (globOptions && typeof globOptions !== 'object') {
                throw new TypeError('globOptions must be an object');
            }


            let globbedFiles = {};

            globEntries.forEach((globString) => {
                const globBaseOptions = globBase(globString);
                if (directories.indexOf(globBaseOptions.base) === -1) {
                    directories.push(globBaseOptions.base);
                }
                const files = WatchNewEntry.getFiles(globString, globOptions);

                globbedFiles = Object.assign(files, globbedFiles);
            });

            return globbedFiles;
        };
    }

    static getFiles(globString, globOptions) {
        const files = {};
        glob.sync(globString, globOptions).forEach((file) => {
            files[unifiedSlash(path.basename(removeExt(file)))] = unifiedSlash(file);
        });
        return files;
    }

    apply(compiler) {
        compiler.hooks.afterCompile.tapAsync(this.constructor.name, this.afterCompile);
    }

    afterCompile(compilation, callback) {
        for (const directory of directories) {
            compilation.contextDependencies.add(directory);
        }
        callback();
    }
}
module.exports = WatchNewEntry;
