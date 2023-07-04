class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = true;
    }

    search(word) {
        let node = this.root;
        let match = '';
        for (const char of word) {
            if (node.children.has(char)) {
                match += char;
                node = node.children.get(char);
                if (node.isEndOfWord) {
                    return match;
                }
            } else {
                break;
            }
        }
        return null;
    }

    toJson() {
        //将树转换为json
        return JSON.stringify(this.root, (key, value) => {
            if (key === 'children') {
                return [...value];
            }
            return value;
        });
    }
}

// 敏感词库
let sensitiveWords = require("./words")

// 将敏感词库转换为前缀树
let trie = null;
(function buildTrie(){
    if(!trie){
        trie = new Trie();
        for (const word of sensitiveWords) {
            trie.insert(word);
        }
        let mem = process.memoryUsage();
        let format = function (bytes) {
            return (bytes / 1024 / 1024).toFixed(4) + 'MB';
        };

        console.log({
            heapTotal : format(mem.heapTotal),
            heapUsed : format(mem.heapUsed),
            rss : format(mem.rss)
        });
    }
})()


module.exports = {
    trie
}