const colors = require('ansi-colors');
const fancyLog = require('fancy-log');
const argv = require('yargs').argv;
const supportsColor = require('color-support');

class Log {
    constructor() {
        this.colors = colors;
    }

    addColor(str, type) {
        if (supportsColor() && (typeof argv.color === 'undefined' || argv.color)) {
            if (type === 'warn') {
                return this.colors.yellow(str);
            } else if (type === 'error') {
                return this.colors.red(str);
            } else if (type === 'info') {
                return this.colors.gray(str);
            }
            return this.colors.green(str);
        }
        return str;
    }

    log(content, tag = '1.0.0') {
       fancyLog(this.addColor(`[TL-RTC-FILE] ${tag}: `, 'log') + content);
    }

    warn(content, tag = '1.0.0') {
        fancyLog(this.addColor(`[TL-RTC-FILE] ${tag}: `, 'warn') + content);
    }

    error(content, tag = '1.0.0') {
        fancyLog(this.addColor(`[TL-RTC-FILE] ${tag}: `, 'error') + content);
    }
}

module.exports = new Log();