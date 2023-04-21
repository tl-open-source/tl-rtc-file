const bussinessRoom = require("./../../bussiness/room/room")
const rtcCount = require("./../rtcCount/count");

/**
 * 断开连接的操作
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 */
async function disconnect(io, socket, tables, dbClient, data){
    socket.broadcast.emit('exit', {
        from : socket.id,
    });
    
    await bussinessRoom.exitRoom({ sid: socket.id, tables: tables });

    rtcCount.count(io, socket, tables, dbClient, data)
}

module.exports = {
    disconnect
}