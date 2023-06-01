const checkLib = require("./core").trie
const utils = require("../../../src/utils/utils");


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

module.exports = {
    contentFilter
}


utils.tlConsole(contentFilter("草泥马"))
