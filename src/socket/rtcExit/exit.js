const bussinessRoom = require("./../../bussiness/room/room")
const bussinessNotify = require("./../../bussiness/notify/notifySocketEvent")
const rtcCount = require("./../rtcCount/count");
const rtcMessage = require("./../rtcMessage/message");
const utils = require("./../../utils/utils");

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
                otherSocket.emit('exit', data);
            }
        }

        let recoderId = data.recoderId;
        if (recoderId != undefined) {
            await bussinessRoom.exitRoom({ sid: socket.id, tables })

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
        rtcMessage.message(io, socket, tables, dbClient, {
            room: data.room,
            emitType: "tips",
            to: socket.id,
            msg: "系统错误"
        })
    }
}

module.exports = {
    exit
}