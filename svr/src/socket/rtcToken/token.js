const request = require('request');
const {inject_env_config} = require("./../../../conf/env_config");
const cfg = inject_env_config(require("./../../../conf/cfg.json"))
const utils = require("./../../utils/utils");

/**
 * token 处理
 * 通过token去api服务拿到用户信息, 在后续的事件中可以关联到用户信息
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function token(io, socket, tables, dbClient, data){
    const { token } = socket.handshake.query;

    if(!token || token.length < 16){
        utils.tlConsole("匿名用户-token空")
        return;
    }

    request({
        method: "POST",
        url: `${cfg.login.token.url}/api/login/info`,
        json: true,
        headers: {
            "content-type": "application/json",
        },
        qs: {
            token, key : "iamtsm-socket"
        },
    }, (err, res, body) => {
        if(err){
            console.log(err);
            return;
        }

        if(body.code !== 200){
            console.log(body);
            return;
        }

        socket.userId = body.userId;

        utils.tlConsole("同步token信息成功 : ", token, body.userId)
    });
}

module.exports = {
    token
}