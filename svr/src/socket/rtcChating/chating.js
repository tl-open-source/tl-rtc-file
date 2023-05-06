const bussinessDog = require("./../../bussiness/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifySocketEvent")
const rtcCommData = require("./../rtcCommData/commData");
const utils = require("./../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const rtcServerMessageEventOpName = rtcConstant.rtcServerMessageEventOpName

/**
 * 公共聊天频道
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function chating(io, socket, tables, dbClient, data){
    try {
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

        let recoderId = await bussinessDog.dogData({
            name: rtcServerMessageEventOpName.chatingComm,
            tables: tables,
            roomId: data.room,
            socketId: data.socketId,
            device: userAgent,
            flag: 0,
            content: decodeURIComponent(data.msg),
            handshake: JSON.stringify(handshake),
            ip: ip
        });

        bussinessNotify.sendChatingNotify({
            title: rtcServerMessageEventOpName.chatingComm,
            room: data.room,
            recoderId: recoderId,
            msgRecoderId: recoderId,
            socketId: data.socketId,
            msg: decodeURIComponent(data.msg),
            userAgent: userAgent,
            ip: ip
        })
    } catch (e) {
        console.log(e)
        socket.emit(rtcClientEvent.tips, {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
    }
}

module.exports = {
    chating
}