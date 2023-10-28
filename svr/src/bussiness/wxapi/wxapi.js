const request = require('request');
const { inject_env_config } = require("../../../conf/env_config")
const conf = inject_env_config(require("../../../conf/cfg.json"));

//微信小程序授权登录
const getOpenId = async ( code ) => {
    try {
        return await new Promise((resolve, reject) => {
            request.get({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                qs: {
                    appid: conf.login.appId,
                    secret: conf.login.appSecret,
                    js_code: code,
                    grant_type: 'authorization_code',
                },
                json: true,
            }, async (error, response, body) => {
                if (error) {
                    console.error('Error fetching sessionKey:', error);
                    reject(error);
                } else if (body.errcode) {
                    console.error('Error fetching sessionKey:', body.errmsg);
                    reject(body.errmsg);
                } else {
                    resolve(body);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching sessionKey:', error);
        return null
    }
}

// 定义一个函数来获取访问令牌
const getAccessToken = async () => {
    try {
        return await new Promise((resolve, reject) => {
            request.get({
                url: 'https://api.weixin.qq.com/cgi-bin/token',
                qs: {
                    grant_type: 'client_credential',
                    appid: conf.login.appId,
                    secret: conf.login.appSecret,
                },
                json: true,
            }, (error, response, body) => {
                if (error) {
                    console.error('Error fetching access token:', error);
                    reject(error);
                } else if (body.errcode) {
                    console.error('Error fetching access token:', body.errmsg);
                    reject(body.errmsg);
                } else {
                    resolve(body);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null
    }
};

// 定义一个函数来生成小程序码
const generateQRCode = async (accessToken, scene, page) => {
    try {
        return await new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='+accessToken,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    scene, page, check_path: false
                }),
                encoding: null,
            }, (error, response, body) => {
                if (error) {
                    console.error('Error fetching generateQRCode:', error);
                    reject(error);
                } else if (body.errcode) {
                    console.error('Error fetching generateQRCode:', body.errmsg);
                    reject(body.errmsg);
                } else {
                    resolve(body);
                }   
            });
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null
    }
};

module.exports = {
    getOpenId, getAccessToken, generateQRCode
}