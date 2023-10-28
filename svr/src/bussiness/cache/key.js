
const prefix = "tl-rtc-file-";

// 状态缓存
const stateKeys = {
    // 扫码状态缓存
    SCAN_STATE_KEY : prefix + "scene-state-",
    // 登录状态缓存
    TOKEN_STATE_KEY : prefix + "token-state-"
}

// 信息缓存
const infoKeys = {
    // 登录信息缓存
    LOGIN_INFO_KEY : prefix + "login-info-",
    // 用户信息缓存
    USER_INFO_KEY : prefix + "user-info-",
}

// cookie key
const cookieKey = {
    // 用户登录cookie key
    USER_LOGIN_COOKIE_KEY : "_tl_u",
}

module.exports = {
    StateKey : stateKeys,
    InfoKey: infoKeys,
    CookieKey: cookieKey,
};

