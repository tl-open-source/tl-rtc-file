const daoDog = require("./../../dao/dog/dog")
const bussinessNotify = require("../../bussiness/notify/notifyHandler")
const rtcCommData = require("../rtcCommData/commData");
const utils = require("../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const check = require("../../utils/check/content");
/**
 * 公共聊天频道
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function chatingComm(io, socket, tables, dbClient, data){
    try {
        data.msg = check.contentFilter(data.msg);

        let cacheSwitchData = rtcCommData.getCacheSwitchData()
        let chatingComm = rtcCommData.getChatingComm()

        if(!cacheSwitchData.openCommRoom){
            socket.emit(rtcClientEvent.tips, {
                room: data.room,
                to: socket.id,
                msg: "当前功能已暂时关闭，有问题可以加群交流"
            });
            return
        }

        data.time = new Date().toLocaleString()

        if (chatingComm.length < 10) {
            chatingComm.push(data)
        } else {
            chatingComm.shift()
            chatingComm.push(data)
        }
        rtcCommData.setChatingComm(chatingComm);

        io.sockets.emit(rtcClientEvent.chatingComm, data);

        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        let recoderId = await daoDog.addDogData({
            name: "公共聊天室",
            roomId: data.room,
            socketId: data.socketId,
            device: userAgent,
            flag: 0,
            content: utils.unescapeStr(data.msg),
            handshake: JSON.stringify(handshake),
            ip: ip
        }, tables, dbClient);

        bussinessNotify.sendChatingNotify({
            title: "公共聊天室",
            room: data.room,
            recoderId: recoderId,
            msgRecoderId: recoderId,
            socketId: data.socketId,
            msg: utils.unescapeStr(data.msg),
            userAgent: userAgent,
            ip: ip
        })
    } catch (e) {
        utils.tlConsole(e)
        socket.emit(rtcClientEvent.tips, {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-chatingComm",
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
    chatingComm
}