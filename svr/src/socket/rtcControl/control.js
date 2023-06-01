const utils = require("./../../utils/utils");
const daoDog = require("./../../dao/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent

/**
 * 远程控制
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function control(io, socket, tables, dbClient, data){
    try{

        let {room, from, to, opArr} = data;

        if(from !== socket.id){
            socket.emit(rtcClientEvent.tips, {
                room: room,
                to: socket.id,
                msg: "非法控制事件"
            });
            return
        }

        if(!opArr){
            opArr = []
        }

        if(!Array.isArray(opArr)){
            socket.emit(rtcClientEvent.tips, {
                room: room,
                to: socket.id,
                msg: "非法控制事件"
            });
            return
        }

        if(opArr.length > 1000){
            socket.emit(rtcClientEvent.tips, {
                room: room,
                to: socket.id,
                msg: "控制事件过多"
            });
            return
        }

        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        let otherClient = io.sockets.connected[to];
        if (!otherClient){
            return;
        }
        otherClient.emit(rtcClientEvent.control, data);
    
        //控制操作事件入库
        await daoDog.addDogData({
            name: "远程控制",
            roomId: data.room || "",
            socketId: socket.id,
            device: userAgent,
            flag: 0,
            content: JSON.stringify(data),
            handshake: JSON.stringify(handshake),
            ip: ip
        }, tables, dbClient);

    }catch(e){
        utils.tlConsole(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-control",
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
    control
}