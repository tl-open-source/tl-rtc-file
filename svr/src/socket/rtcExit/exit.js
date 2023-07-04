const daoRoom = require("./../../dao/room/room")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const rtcCount = require("./../rtcCount/count");
const utils = require("./../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent

/**
 * 退出房间
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function exit(io, socket, tables, dbClient, data){
    try {
        let room = data.room;
        
        socket.leave(room);
        
        let clientsInRoom = io.sockets.adapter.rooms[room];
        if (clientsInRoom) {
            let otherSocketIds = Object.keys(clientsInRoom.sockets);
            for (let i = 0; i < otherSocketIds.length; i++) {
                let otherSocket = io.sockets.connected[otherSocketIds[i]];
                otherSocket.emit(rtcClientEvent.exit, data);
            }
        }

        let recoderId = data.recoderId;
        if (recoderId != undefined) {
            await daoRoom.exitRoomBySid({ sid: socket.id },tables, dbClient)

            let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

            bussinessNotify.sendExitRoomNotify({
                title: "退出房间",
                room: data.room,
                socketId: socket.id,
                recoderId: data.recoderId,
                userAgent: userAgent,
                ip: ip
            })
        }

        rtcCount.count(io, socket, tables, dbClient, data)
    } catch (e) {
        socket.emit(rtcClientEvent.tips, {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-exit",
            data: JSON.stringify(data),
            room: data.room,
            from : socket.id,
            msg : JSON.stringify({
                message: e.message,
                fileName: e.fileName,
                lineNumber: e.lineNumber,
                stack: e.stack,
                name: e.name
            }, null, '\t')
        })
    }
}

module.exports = {
    exit
}