const checkLib = require("./core").trie

/**
 * 内容过滤
 * @param {*} text 
 * @param {*} replaceChar 
 * @returns 
 */
function contentFilter(text, replaceChar = '*') {
    let filteredText = '';
    let currentIndex = 0;

    while (currentIndex < text.length) {
        const match = checkLib.search(text.slice(currentIndex));
        if (match) {
            filteredText += replaceChar.repeat(match.length);
            currentIndex += match.length;
        } else {
            filteredText += text[currentIndex];
            currentIndex++;
        }
    }
    return filteredText;
}

/**
 * 对象内容过滤
 * @param {*} text 
 * @returns 
 */
function objectContentFilter(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj === 'string') {
        return contentFilter(obj);
    }
    if (typeof obj === 'object') {
        if (obj instanceof Array) {
            return obj.map(item => objectContentFilter(item));
        } else {
            const newObj = {};
            for (const key in obj) {
                newObj[key] = objectContentFilter(obj[key]);
            }
            return newObj;
        }
    }
    return obj;
}

module.exports = {
    contentFilter, objectContentFilter
}