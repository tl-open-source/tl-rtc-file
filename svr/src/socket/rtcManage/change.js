const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const daoRoom = require("./../../dao/room/room")
const rtcConfirm = require("./confirm");
const rtcCommData = require("./../rtcCommData/commData")
const utils = require("./../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const check = require("./../../utils/check/content");

/**
 * 管理后台修改数据
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function change(io, socket, tables, dbClient, data){
    try {
        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        let tokens = rtcConfirm.getTokenList();

        if (!data.token || !tokens.includes(data.token)) {
            bussinessNotify.sendManageUpdateFailedNotify({
                title: "管理后台非法修改配置",
                token: data.token,
                room: data.room,
                content: data.content,
                userAgent: userAgent,
                ip: ip
            })
            return
        }

        await daoRoom.updateRoomContent({
            id: data.id,
            content: JSON.stringify(data.content)
        }, tables, dbClient)

        bussinessNotify.sendManageUpdateInfoNotify({
            title: "管理后台修改配置",
            token: data.token,
            room: data.room,
            content: JSON.stringify(data.content),
            userAgent: userAgent,
            ip: ip
        })
        
        socket.emit(rtcClientEvent.tips, {
            room: data.room,
            to: socket.id,
            msg: "更新成功"
        });

        //更新下缓存，通知下全频道
        let switchData = data.content
        if(switchData){
            rtcCommData.setCacheSwitchData(switchData)
        }
        io.sockets.emit(rtcClientEvent.commData, {
            switchData : switchData
        })

    } catch (e) {
        utils.tlConsole(e)
        socket.emit(rtcClientEvent.tips, {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-manage-change",
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
    change
}