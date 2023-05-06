const bussinessDog = require("./../../bussiness/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifySocketEvent")
const utils = require("./../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcServerMessageEventOpName = rtcConstant.rtcServerMessageEventOpName
const rtcServerMessageEvent = rtcConstant.rtcServerMessageEvent
const rtcClientEvent = rtcConstant.rtcClientEvent

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

        //特殊事件
        if(emitType === rtcServerMessageEvent.commData){
            socket.emit(rtcClientEvent.commData,{
                switchData : data.switchData,
                chatingCommData : data.chatingCommData
            });
            return
        }

        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        if (emitType === rtcServerMessageEvent.sendFileInfo) {
            bussinessNotify.sendFileInfoNotify({
                title: rtcServerMessageEventOpName.sendFileInfo,
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

        if (emitType === rtcServerMessageEvent.sendDone) {
            bussinessNotify.sendFileDoneNotify({
                title: rtcServerMessageEventOpName.sendDone,
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

        if (emitType === rtcServerMessageEvent.sendBugs) {
            bussinessNotify.sendBugNotify({
                title: rtcServerMessageEventOpName.sendBugs,
                room: data.room,
                msg: data.msg,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === rtcServerMessageEvent.sendTxt) {
            bussinessNotify.sendTxtNotify({
                title: rtcServerMessageEventOpName.sendTxt,
                room: data.room,
                from: data.from,
                recoderId: data.recoderId,
                content: data.content,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === rtcServerMessageEvent.startScreen) {
            bussinessNotify.sendStartScreenNotify({
                title: rtcServerMessageEventOpName.startScreen,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === rtcServerMessageEvent.stopScreen) {
            bussinessNotify.sendStopScreenNotify({
                title: rtcServerMessageEventOpName.stopScreen,
                userAgent: data.userAgent,
                cost: data.cost,
                size: data.size,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === rtcServerMessageEvent.startScreenShare) {
            bussinessNotify.sendStartScreenShareNotify({
                title: rtcServerMessageEventOpName.startScreenShare,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.stopScreenShare) {
            bussinessNotify.sendStopScreenShareNotify({
                title: rtcServerMessageEventOpName.stopScreenShare,
                userAgent: data.userAgent,
                cost: data.cost,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.startVideoShare) {
            bussinessNotify.sendStartVideoShareNotify({
                title: rtcServerMessageEventOpName.startVideoShare,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.stopVideoShare) {
            bussinessNotify.sendStopVideoShareNotify({
                title: rtcServerMessageEventOpName.stopVideoShare,
                userAgent: data.userAgent,
                cost: data.cost,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.startLiveShare) {
            bussinessNotify.sendStartLiveShareNotify({
                title: rtcServerMessageEventOpName.startLiveShare,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.stopLiveShare) {
            bussinessNotify.sendStopLiveShareNotify({
                title: rtcServerMessageEventOpName.stopLiveShare,
                userAgent: data.userAgent,
                cost: data.cost,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (rtcServerMessageEventOpName[data.emitType]) {
            await bussinessDog.dogData({
                tables: tables,
                name: rtcServerMessageEventOpName[data.emitType],
                roomId: "",
                socketId: "",
                device: userAgent,
                flag: 0,
                content: JSON.stringify(data),
                handshake: JSON.stringify(handshake),
                ip: ip
            });
        }

        let clientsInRoom = io.sockets.adapter.rooms[room];

        if (clientsInRoom) {
            let otherSocketIds = Object.keys(clientsInRoom.sockets);
            for (let i = 0; i < otherSocketIds.length; i++) {
                let otherSocket = io.sockets.connected[otherSocketIds[i]];

                if(to && to === otherSocket.id){ //有指定发送id，不用走广播
                    otherSocket.emit(emitType, data);
                    break;
                }
                if(from != otherSocket.id){
                    otherSocket.emit(emitType, data);
                }
            }
        }

    } catch (e) {
        console.log(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
    }
}

module.exports = {
    message
}