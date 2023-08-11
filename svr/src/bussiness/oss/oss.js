const aly = require('./aly');
const tx = require('./tx');
const qiniu = require('./qiniu');
const seafile = require('./seafile');
const {inject_env_config} = require("./../../../conf/env_config");
const cfg = inject_env_config(require('./../../../conf/cfg.json'));

const oss = {
    aly,
    tx,
    qiniu,
    seafile,
}

/**
 * 获取上传token
 */
const getUploadToken = async function(){

}

/**
 * 获取上传url
 */
const getUploadUrl = async function(){

}

/**
 * 获取下载url
 */
const getDownLoadUrl = async function(){

}