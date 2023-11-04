const utils = require("./../../utils/utils");
const daoDog = require("./../../dao/dog/dog")
const daoUser = require("./../../dao/user/user")
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const daoRelation = require("../../dao/relation/relation");


/**
 * 订阅网站通知
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function subscribeNofity(io, socket, tables, dbClient, data){
    let { roomId = '', email = '' } = data;

    let { handshake, userAgent, ip } = utils.getSocketClientInfo(socket);

    socket.emit(rtcClientEvent.subscribeNofity, data);

    //控制操作事件入库
    let recoderId = await daoDog.addDogData({
        name: "订阅网站通知",
        roomId: roomId,
        socketId: socket.id,
        device: userAgent,
        flag: 0,
        content: JSON.stringify(data),
        handshake: JSON.stringify(handshake),
        ip: ip
    }, tables, dbClient);

    //更新用户订阅标识
    const { userId, flag = 0 } = socket.userInfo;
    if(userId){
        await daoUser.updateUserFlag({
            id : userId,
            flag : utils.setBit(flag, tables.UserOther.Flag.IS_SUBSCRIBE_WEBSITE_NOTIFY)
        }, tables, dbClient);
    }

    //添加用户-操作关联记录
    if(socket.userId){
        daoRelation.addUserDogRelation({
            dogId : recoderId,
            userId : socket.userId,
        }, tables, dbClient);
    }
}

module.exports = {
    subscribeNofity
}