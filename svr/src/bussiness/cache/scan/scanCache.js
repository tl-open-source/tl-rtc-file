const { StateKey, InfoKey, CookieKey } = require("../key");
const cache = require("../cache");

/**
 * 设置扫码状态 : 五分钟
 * @param {*} key 
 * @param {*} value 
 */
const setScanState = (key, value) => {
    cache.setShortTimeCache(StateKey.SCAN_STATE_KEY + key, value);
}

/**
 * 获取扫码状态 : 五分钟
 * @param {*} key
 * @returns
 * 'scan': 已扫码
 * 'auth_succ': 授权成功
 * 'auth_fail': 授权失败
 * ''
 *  */
const getScanState = (key) => {
    return cache.getShortTimeCache(StateKey.SCAN_STATE_KEY + key) || "";
}

/**
 * 设置登录状态 : 一小时
 * @param {*} key
 * @param {*} value
 * @returns
 * */
const setTokenState = (key, value) => {
    cache.setLongTimeCache(StateKey.TOKEN_STATE_KEY + key, value);
}

/**
 * 获取登录状态 : 一小时
 * @param {*} key
 * @returns
 * {
 * token : token
 * }
 * */
const getTokenState = (key) => {
    return cache.getLongTimeCache(StateKey.TOKEN_STATE_KEY + key) || "";
}


/**
 * 获取登录信息 : 一小时
 * @param {*} key
 * @returns
 * {
 * openId : openId,
 * loginTime: loginTime
 * }
 * */
const getLoginInfo = (key) => {
    return cache.getLongTimeCache(InfoKey.LOGIN_INFO_KEY + key) || {};
}


/**
 * 设置登录信息 : 一小时
 * @param {*} key
 * @param {*} value
 * @returns
 * */
const setLoginInfo = (key, value) => {
    cache.setLongTimeCache(InfoKey.LOGIN_INFO_KEY + key, value);
}


/**
 * 获取用户信息 : 一天
 * @param {*} key 
 * @returns 
 * {
 * id: id,
 * openid: openid,
 * avatar: userInfo.avatarUrl,
 * uname: userInfo.nickName,
 * ...
 * }
 */
const getUserInfo = (key) => {
    return cache.getDayTimeCache(InfoKey.USER_INFO_KEY + key) || {};
}

/**
 * 设置用户信息 : 一天
 * @param {*} key 
 * @param {*} value 
 */
const setUserInfo = (key, value) => {
    cache.setDayTimeCache(InfoKey.USER_INFO_KEY + key, value);
}


module.exports = {
    setScanState, getScanState,
    setTokenState, getTokenState,
    setLoginInfo, getLoginInfo,
    setUserInfo, getUserInfo
}