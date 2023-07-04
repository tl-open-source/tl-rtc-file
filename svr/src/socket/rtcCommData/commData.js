const daoRoom = require("./../../dao/room/room")
const daoDog = require("./../../dao/dog/dog")
const utils = require("./../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")

// 公共聊天数据缓存
let chatingComm = null
// 开关数据缓存
let cacheSwitchData = null

/**
 * 获取初始数据
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function getCommData(io, socket, tables, dbClient, data){
    try{
        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        let manageInfo = await daoRoom.getOrCreateManageRoom({
            sid: socket.id,
            ip: ip,
            device: userAgent,
        }, tables, dbClient)
        let switchData = JSON.parse(manageInfo.content)
        if(switchData){
            cacheSwitchData = switchData
        }

        if(!chatingComm){
            chatingComm = await daoDog.getDogChatingCommInfo({
                limit : switchData.chatingCommCount || 10
            }, tables, dbClient);
        }

        socket.emit(rtcClientEvent.commData,{
            switchData : switchData,
            chatingCommData : chatingComm || []
        });

    }catch(e){
        utils.tlConsole(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-commData",
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

/**
 * 获取 chatingComm
 * @returns 
 */
function getChatingComm(){
    return chatingComm;
}

/**
 * 更新 chatingComm
 * @returns 
 */
function setChatingComm(data){
    chatingComm = data
    return chatingComm;
}

/**
 * 获取 cacheSwitchData
 * @returns 
 */
function getCacheSwitchData(){
    return cacheSwitchData;
}

/**
 * 更新 cacheSwitchData
 * @param {*} data 
 */
function setCacheSwitchData(data){
    cacheSwitchData = data
    return cacheSwitchData;
}

module.exports = {
    getCommData,
    getCacheSwitchData,
    setCacheSwitchData,
    getChatingComm,
    setChatingComm
}