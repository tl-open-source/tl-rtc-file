const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const utils = require("../../../src/utils/utils");

/**
 * 心跳
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function heartbeat(io, socket, tables, dbClient, data){
    try{
        socket.emit(rtcClientEvent.heartbeat, {
            status : "ok"
        })
    }catch(e){
       utils.tlConsole(e)
    }
}

module.exports = {
    heartbeat
}