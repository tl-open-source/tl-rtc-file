const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const utils = require("../../../src/utils/utils");

/**
 * 在线人数统计广播
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function count(io, socket, tables, dbClient, data){
    try{
        let allManCount = Object.keys(io.sockets.connected).length || 0;
        io.sockets.emit(rtcClientEvent.count, {
            mc : allManCount + 50
        })
    }catch(e){
       utils.tlConsole(e)
    }
}

module.exports = {
    count
}