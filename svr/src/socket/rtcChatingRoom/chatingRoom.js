const daoDog = require("./../../dao/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const utils = require("./../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const check = require("./../../utils/check/content");

/**
 * 房间内聊天 群聊/私聊
 * 指定了to : 就会发送给指定的用户
 * 没有指定to : 广播给除了自己外的房间内的所有用户
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function chatingRoom(io, socket, tables, dbClient, data){
    try {
        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        await daoDog.addDogData({
            name: "发送文本内容",
            roomId: data.room || "",
            socketId: "",
            device: userAgent,
            flag: 0,
            content: JSON.stringify(data),
            handshake: JSON.stringify(handshake),
            ip: ip
        }, tables, dbClient);

        bussinessNotify.sendChatingRoomNotify({
            title: "发送文本内容",
            room: data.room,
            from: data.from,
            recoderId: data.recoderId,
            content: data.content,
            userAgent: userAgent,
            ip: ip
        })

        // 指定发送
        if(data.to && data.to !== ''){
            let toOtherSocket = io.sockets.connected[data.to];
            if(toOtherSocket){
                toOtherSocket.emit(rtcClientEvent.chatingRoom, data);
            }
            return
        }

        // 没指定，走广播（除了自己）
        let clientsInRoom = io.sockets.adapter.rooms[data.room];
        if (!clientsInRoom) {
            return
        }
        let otherSocketIds = Object.keys(clientsInRoom.sockets);
        for (let i = 0; i < otherSocketIds.length; i++) {
            if(data.from === otherSocketIds[i]){ //跳过自己
                continue;
            }
            let otherSocket = io.sockets.connected[otherSocketIds[i]];
            if(!otherSocket){
                continue;
            }
            otherSocket.emit(rtcClientEvent.chatingRoom, data);
        }

    } catch (e) {
        utils.tlConsole(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-chatingRoom",
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
    chatingRoom
}