/**
 * oss seafile api
 * @author iamtsm
 */

const request = require('request');
const seafile = require('../../../conf/cfg.json').oss.seafile

/**
 * 获取token
 */
function seafileGetToken() {
    return new Promise(resolve => {
        request({
            url: `${seafile.host}/api2/auth-token/`,
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                username: seafile.username,
                password: seafile.password
            })
        }, function (error, response, body) {
            if (body) {
                resolve(JSON.parse(body).token)
            } else {
                resolve(undefined)
            }
        });
    })
}

/**
 * 服务是否正常
 * @param {*} token 
 * @returns 
 */
function seafilePingPong(token) {
    return new Promise(resolve => {
        request({
            url: `${seafile.host}/api2/ping/`,
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            },
        }, function (error, response, body) {
            resolve(body)
        });
    })
}

/**
 * 获取上传链接
 * @param {*} token 
 * @returns 
 */
function seafileGetUploadLink(token) {
    return new Promise(resolve => {
        request({
            url: `${seafile.host}/api2/repos/${seafile.repoid}/upload-link/`,
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`
            },
        }, function (error, response, body) {
            resolve(body)
        });
    })
}

/**
 * 上传文件
 * @param {*} token 
 * @param {*} link 
 * @returns 
 */
function seafileUpload(token, options) {
    return new Promise(resolve => {
        request({
            url: `${options.link}?ret-json=1`,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                replace: options.replace,
                file: options.file,
                parent_dir: options.parent_dir
            })
        }, function (error, response, body) {
            if (body) {
                resolve(JSON.parse(body))
            } else {
                resolve(undefined)
            }
        });
    })
}


/**
 * 创建分享链接
 * @param {*} token 
 * @param {*} name 
 * @returns 
 */
function seafileCreateShareLink(token, options) {
    return new Promise(resolve => {
        request({
            url: `${seafile.host}/api/v2.1/share-links/`,
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                "repo_id": seafile.repoid,
                "path": `/${options.name}`,
                "permissions": {
                    "can_edit": options.can_edit,
                    "can_download": options.can_download
                },
                "expire_days": options.expire_days
            })
        }, function (error, response, body) {
            if (body) {
                resolve(JSON.parse(body))
            } else {
                resolve(undefined)
            }
        });
    })
}


/**
 * 删除分享链接
 * @param {*} token 
 * @param {*} name 
 * @returns 
 */
function seafileDeleteShareLink(token, shareLinkToken) {
    return new Promise(resolve => {
        request({
            url: `${seafile.host}/api/v2.1/share-links/${shareLinkToken}/`,
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`
            },
        }, function (error, response, body) {
            resolve(body)
        });
    })
}


/**
 * 获取直接下载链接
 * @param {*} token 
 * @param {*} name 
 * @returns 
 */
function seafileGetDownLoadLink(shareLinkToken) {
    return `${seafile.host}/f/${shareLinkToken}/?dl=1`;
}


module.exports = {
    seafileGetToken,
    seafilePingPong,
    seafileCreateShareLink,
    seafileGetDownLoadLink,
    seafileDeleteShareLink,
    seafileGetUploadLink,
    seafileUpload
}