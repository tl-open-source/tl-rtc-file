const bussinessNotify = require("./../../bussiness/notify/notifySocketEvent")
const bussinessRoom = require("./../../bussiness/room/room")
const rtcMessage = require("./../rtcMessage/message");
const rtcConfirm = require("./confirm");
const rtcCommData = require("./../rtcCommData/commData")
const utils = require("./../../utils/utils");

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

        await bussinessRoom.updateManageRoom({
            tables: tables,
            id: data.id,
            content: JSON.stringify(data.content)
        })

        bussinessNotify.sendManageUpdateInfoNotify({
            title: "管理后台修改配置",
            token: data.token,
            room: data.room,
            content: JSON.stringify(data.content),
            userAgent: userAgent,
            ip: ip
        })

        rtcMessage.message(io, socket, tables, dbClient, {
            room: data.room,
            emitType: "tips",
            to: socket.id,
            msg: "更新成功"
        })

        //更新下缓存，通知下全频道
        let switchData = data.content
        if(switchData){
            rtcCommData.setCacheSwitchData(switchData)
        }
        io.sockets.emit("commData", {
            switchData : switchData
        })

    } catch (e) {
        console.log(e)
        rtcMessage.message(io, socket, tables, dbClient, {
            room: data.room,
            emitType: "tips",
            to: socket.id,
            msg: "系统错误"
        })
    }
}

module.exports = {
    change
}