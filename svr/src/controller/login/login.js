const user = require("../../dao/user/user");
const { inject_env_config } = require("../../../conf/env_config")
const conf = inject_env_config(require("../../../conf/cfg.json"));
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const wxapi = require("./../../bussiness/wxapi/wxapi")
const { CookieKey } = require("./../../bussiness/cache/key")
const scanCache = require("./../../bussiness/cache/scan/scanCache")
const uuid = require("uuid")

// 扫码状态
const SCAN_STATE = {
    wait: 'wait',
    scan: 'scan',
    auth_succ: 'auth_succ',
    auth_fail: 'auth_fail',
}

/**
 * 微信小程序授权信息 : 小程序调用
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function loginWechat(req, res) {
    const { code, userInfo } = req.body;
    try {
        const dbClient = req.ctx.dbClient;
        const tables = req.ctx.tables;
        if (!dbClient || !tables) {
            res.json({ code : 500, session_key: "", message: "系统错误" });
            return;
        }

        const openIdInfo = await wxapi.getOpenId(code);
        if(!openIdInfo){
            res.json({ code : 500, session_key: "", message: "系统错误" });
            return
        }

        const { session_key, openid, unionid } = openIdInfo;

        const userId = await user.addWxUser({
            openid: openid,
            avatar: userInfo.avatarUrl,
            uname: userInfo.nickName,
            pwd: '',
            solt: '',
            role: 'user',
        }, tables, dbClient);

        //设置登录信息缓存
        const token = uuid.v4();
        scanCache.setLoginInfo(token, {
            openId : openid,
            userId : userId,
            avatar : userInfo.avatarUrl,
            nickName : userInfo.nickName,
            loginTime : Date.now(),
        });

        bussinessNotify.sendScanLoginNotify({
            title: "微信小程序扫码登录",
            openId : openid,
            userId : userId,
            token : token,
        })

        res.json({ session_key, openid, unionid, user: userId, token });

    } catch (error) {
        console.error('Error fetching sessionKey:', error);
        bussinessNotify.sendSystemErrorMsg({
            title: "api-login-wechat",
            data: error,
            room: "",
            from: "",
            msg: JSON.stringify({
                error: error,
                code,
                userInfo
            }, null, '\t')
        })
        res.json({ code : 500, session_key: "", message: "系统错误" });
    }
}


/**
 * 微信小程序授权扫码成功 : 小程序调用
 * @state : 
 * 'scan': 已扫码
 * 'auth_succ': 授权成功
 * 'auth_fail': 授权失败
 * @scene : socketId
 * @token : 登录token
 * @param {*} req 
 * @param {*} res 
 */
async function scanState(req, res) {
    const { scene, state, token} = req.body;

    if(!scene || scene.length <= 10 || scene.length > 32){
        res.json({ code : 400, message : "scene参数错误" });
        return;
    }

    if(!state || SCAN_STATE[state] === undefined){
        res.json({ code : 400, message : "state参数错误" });
        return;
    }

    // 如果授权成功，设置当前socketId登录状态
    if(state === SCAN_STATE.auth_succ){
        if(!token || token.length < 16){
            res.json({ code : 400, message : "token参数错误" });
            return;
        }
        // socketId - token
        scanCache.setTokenState(scene, token);
    }

    // 设置扫码状态
    scanCache.setScanState(scene, state);

    res.json({ code : 200 });
}


/**
 * 获取小程序登录二维码 : web端调用
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getLoginWechatQrCode(req, res) {
    const { socketId } = req.query;

    try {
        const dbClient = req.ctx.dbClient;
        const tables = req.ctx.tables;
        if (!dbClient || !tables) {
            res.json({ code : 500, message: "系统错误" });
            return;
        }

        const tokenInfo = await wxapi.getAccessToken();
        if(!tokenInfo){
            res.json({ code : 500, message: "系统错误" });
            return
        }
        const { access_token } = tokenInfo;

        const body = await wxapi.generateQRCode(access_token, socketId, "pages/login/login");
                
        res.setHeader('Content-Type', "image/jpeg");
        res.send(body);

    } catch (error) {
        console.error('Error fetching getLoginWechatQrCode:', error);
        bussinessNotify.sendSystemErrorMsg({
            title: "api-login-wechat",
            data: error,
            room: "",
            from: "",
            msg: JSON.stringify({
                error: error
            }, null, '\t')
        })
        res.json({code : 500, message: "系统错误" });
    }
}


/**
 *  获取扫码状态 : web端调用
 * @param {*} scene : socketId
 * @returns 
 */
async function getScanState( req, res ){
    const { scene } = req.query;

    if(!scene || scene.length < 10 || scene.length > 32){
        res.json({ code : 400, message : "scene参数错误" });
        return;
    }

    const state = scanCache.getScanState(scene) || SCAN_STATE.wait;
    //授权没有成功，返回状态
    if(state !== SCAN_STATE.auth_succ){
        res.json({ code : 200, state })
        return
    }

    //先通过socketId获取token
    const token = scanCache.getTokenState(scene);
    if(!token){
        res.json({ code : 200, state, message : "token失效" })
        return
    }

    res.cookie(CookieKey.USER_LOGIN_COOKIE_KEY, token, {
        maxAge: 1000 * 60 * 60, 
        httpOnly: true
    })

    res.json({ code : 200, state, token });
}


/**
 * 获取登录状态 : web端调用
 * @param {*} req 
 * @param {*} res 
 */
async function getTokenState(req, res){
    let token = req.cookies[CookieKey.USER_LOGIN_COOKIE_KEY];
    if(!token){
        token = req.query.token || "";
    }

    if(!token || token.length < 16){
        res.json({ code: 403 });
        return;
    }

    const loginInfo = scanCache.getLoginInfo(token);

    const avatar = loginInfo.avatar || "/image/44826979.png";
    const username = loginInfo.nickName || "";

    if(Object.keys(loginInfo).length > 0){
        res.json({ code: 200, login: true, token, avatar, username });
    }else{
        res.json({ code: 200, login: false });
    }
}


/**
 * 退出登录 : web端调用
 * @param {*} req 
 * @param {*} res 
 */
async function logout(req, res){
    let token = req.cookies[CookieKey.USER_LOGIN_COOKIE_KEY];
    if(!token){
        token = req.query.token || "";
    }

    if(!token || token.length === 0){
        res.json({ code: 200, logout : true });
        return;
    }

    scanCache.setLoginInfo(token, undefined);
    scanCache.setUserInfo(token, undefined);

    res.json({ code: 200, logout: true });
}



/**
 * 获取登录信息 : socket服务调用
 * @param {*} req 
 * @param {*} res 
 */
async function getLoginInfo(req, res){
    let token = req.query.token || "";
    let key = req.query.key || "";

    if(!token || token.length < 16 || key !== 'iamtsm-socket'){
        res.json({ code: 403 });
        return;
    }

    const loginInfo = scanCache.getLoginInfo(token);

    res.json({ code: 200, userId : loginInfo.userId });
}




module.exports = {
    loginWechat, scanState, getLoginWechatQrCode, getScanState, 
    getTokenState, logout, getLoginInfo
}