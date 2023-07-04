/**
 * oss seafile api
 * @author iamtsm
 */

const request = require('request');
const seafile = require('../../../conf/cfg.json').oss.seafile

/**
 * 获取token
 */
async function seafileGetToken() {
    return await new Promise(resolve => {
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
 * 获取上传链接
 * @param {*} token 
 * @returns 
 */
async function seafileGetUploadLink(token) {
    return await new Promise(resolve => {
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
 * 获取直接下载链接
 * @param {*} token 
 * @param {*} options 
 * @returns 
 */
async function seafileGetDownLoadLink(token, options) {
    return await new Promise(resolve => {
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
                let data = JSON.parse(body);
                if(data){
                    resolve({
                        downloadLink : `${seafile.host}/f/${data.token}/?dl=1`,
                    })
                }else{
                    resolve(undefined)
                }
            } else {
                resolve(undefined)
            }
        });
    })
}

module.exports = {
    seafileGetToken,
    seafileGetUploadLink,
    seafileGetDownLoadLink,
}