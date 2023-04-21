const bussinessDog = require("./../../bussiness/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifySocketEvent")
const utils = require("./../../utils/utils");

// 通知事件定义
let opName = {
    "sendFileInfo": "准备发送文件",
    "sendDone": "文件发送完毕",
    "sendBugs": "收到问题反馈",
    "sendTxt": "发送文本内容",
    "startScreen": "开始网页录屏",
    "stopScreen": "停止网页录屏",
    "startScreenShare": "开始屏幕共享",
    "stopScreenShare": "停止屏幕共享",
    "startVideoShare": "开始音视频通话",
    "stopVideoShare": "停止音视频通话",
    "startPasswordRoom": "创建密码房间",
    "addCodeFile": "添加取货码文件",
    "getCodeFile" : "取件码取件",
    "openaiChat" : "ChatGPT聊天"
}


/**
 * 公共模板广播消息
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function message(io, socket, tables, dbClient, data){
    try {
        let {emitType, room, from, to} = data;

        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        let clientsInRoom = io.sockets.adapter.rooms[room];

        //特殊事件
        if(emitType === 'commData'){
            socket.emit('commData',{
                switchData : data.switchData,
                chatingCommData : data.chatingCommData
            });
            return
        }

        if (clientsInRoom) {
            let otherSocketIds = Object.keys(clientsInRoom.sockets);
            for (let i = 0; i < otherSocketIds.length; i++) {
                let otherSocket = io.sockets.connected[otherSocketIds[i]];

                if(to && to === otherSocket.id){ //有指定发送id，不用走广播
                    otherSocket.emit(emitType, data);
                    return;
                }
                if(from != otherSocket.id){
                    otherSocket.emit(emitType, data);
                }
            }
        }

        if (emitType === 'sendFileInfo') {
            bussinessNotify.sendFileInfoNotify({
                title: opName.sendFileInfo,
                room: data.room,
                recoderId: data.recoderId,
                from: data.from,
                name: data.name,
                type: data.type,
                size: data.size,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === 'sendDone') {
            bussinessNotify.sendFileDoneNotify({
                title: opName.sendDone,
                room: data.room,
                to: data.to,
                from: data.from,
                name: data.name,
                type: data.type,
                size: data.size,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === 'sendBugs') {
            bussinessNotify.sendBugNotify({
                title: opName.sendBugs,
                room: data.room,
                msg: data.msg,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === 'sendTxt') {
            bussinessNotify.sendTxtNotify({
                title: opName.sendTxt,
                room: data.room,
                from: data.from,
                recoderId: data.recoderId,
                content: data.content,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === 'startScreen') {
            bussinessNotify.sendStartScreenNotify({
                title: opName.startScreen,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === 'stopScreen') {
            bussinessNotify.sendStopScreenNotify({
                title: opName.stopScreen,
                userAgent: data.userAgent,
                cost: data.cost,
                size: data.size,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === 'startScreenShare') {
            bussinessNotify.sendStartScreenShareNotify({
                title: opName.startScreenShare,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === 'stopScreenShare') {
            bussinessNotify.sendStopScreenShareNotify({
                title: opName.stopScreenShare,
                userAgent: data.userAgent,
                cost: data.cost,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === 'startVideoShare') {
            bussinessNotify.sendStartVideoShareNotify({
                title: opName.startVideoShare,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === 'stopVideoShare') {
            bussinessNotify.sendStopVideoShareNotify({
                title: opName.stopVideoShare,
                userAgent: data.userAgent,
                cost: data.cost,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (opName[data.emitType]) {
            await bussinessDog.dogData({
                tables: tables,
                name: opName[data.emitType],
                roomId: "",
                socketId: "",
                device: userAgent,
                flag: 0,
                content: JSON.stringify(data),
                handshake: JSON.stringify(handshake),
                ip: ip
            });
        }

    } catch (e) {
        console.log(e)
        socket.emit("tips", {
            room: data.room,
            emitType: "tips",
            to: socket.id,
            msg: "系统错误"
        });
    }
}

module.exports = {
    message
}