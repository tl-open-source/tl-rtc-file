const utils = require("./../../utils/utils");
const daoDog = require("./../../dao/dog/dog")
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const check = require("../../bussiness/check/content");
/**
 * canvas画图
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function draw(io, socket, tables, dbClient, data){
    let { to } = data;

    let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

    let otherClient = io.sockets.connected[to];
    if (!otherClient){
        return;
    }

    otherClient.emit(rtcClientEvent.draw, data);

    //控制操作事件入库
    await daoDog.addDogData({
        name: "canvas画图",
        roomId: "",
        socketId: "",
        device: userAgent,
        flag: 0,
        content: JSON.stringify(data),
        handshake: JSON.stringify(handshake),
        ip: ip
    }, tables, dbClient);
}

module.exports = {
    draw
}