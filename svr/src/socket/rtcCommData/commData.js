const bussinessRoom = require("./../../bussiness/room/room")
const bussinessDog = require("./../../bussiness/dog/dog")
const rtcMessage = require("./../rtcMessage/message");
const utils = require("./../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent

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
async function commData(io, socket, tables, dbClient, data){
    let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

    let manageInfo = await bussinessRoom.getOrCreateManageRoom({
        tables: tables,
        sid: socket.id,
        ip: ip,
        device: userAgent,
        content: ""
    })
    let switchData = JSON.parse(manageInfo.content)
    if(switchData){
        cacheSwitchData = switchData
    }

    if(!chatingComm){
        chatingComm = await bussinessDog.getDogChating10Info({
            tables, dbClient
        });
    }

    rtcMessage.message(io, socket, tables, dbClient, {
        emitType: rtcClientEvent.commData,
        switchData: switchData,
        chatingCommData: chatingComm || [],
    })
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
    commData,
    getCacheSwitchData,
    setCacheSwitchData,
    getChatingComm,
    setChatingComm
}