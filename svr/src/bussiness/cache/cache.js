const { LRUCache } = require('lru-cache');

// 5分钟缓存
const shortTimeCache = new LRUCache({
    max: 500,
    maxAge: 1000 * 60 * 5
});

// 1小时缓存
const longTimeCache = new LRUCache({
    max: 500,
    maxAge: 1000 * 60 * 60
});

// 1天缓存
const dayTimeCache = new LRUCache({
    max: 500,
    maxAge: 1000 * 60 * 60 * 24
});


const setShortTimeCache = (key, value) => {
    shortTimeCache.set(key, value);
}

const getShortTimeCache = (key) => {
    return shortTimeCache.get(key);
}

const setLongTimeCache = (key, value) => {
    longTimeCache.set(key, value);
}

const getLongTimeCache = (key) => {
    return longTimeCache.get(key);
}

const setDayTimeCache = (key, value) => {
    dayTimeCache.set(key, value);
}

const getDayTimeCache = (key) => {
    return dayTimeCache.get(key);
}

module.exports = {
    setShortTimeCache, getShortTimeCache, 
    setLongTimeCache, getLongTimeCache, 
    setDayTimeCache, getDayTimeCache
}