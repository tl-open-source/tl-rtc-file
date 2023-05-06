const checkLib = require("./core").trie

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


console.log(contentFilter("草泥马，休息休息，傻逼"))
