const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const daoDog = require("./../../dao/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const utils = require("./../../utils/utils");
const daoFile = require("./../../dao/file/file")
const rtcCommData = require("./../rtcCommData/commData");
const check = require("../../bussiness/check/content");

/**
 * 取件码取件
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function getCodeFile(io, socket, tables, dbClient, data){
    try{
        let cacheSwitchData = rtcCommData.getCacheSwitchData()

        if(!cacheSwitchData.openGetCodeFile){
            socket.emit(rtcClientEvent.tips, {
                room: data.room,
                to: socket.id,
                msg: "当前功能已暂时关闭，有问题可以加群交流"
            });
            return
        }

        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        let codeFile = await daoFile.getCodeFile({
            code : data.code
        }, tables, dbClient)
    
        if(codeFile){
            Object.assign(data, codeFile)
        }
    
        utils.tlConsole("取件码取件 : ",data)
    
        bussinessNotify.getCodeFileNotify({
            title: "取件码取件",
            room: data.room,
            from: data.from,
            code : data.code,
            userAgent: userAgent,
            ip: ip
        })
    
        await daoDog.addDogData({
            name: "取件码取件",
            roomId: data.room || "",
            socketId: socket.id,
            device: userAgent,
            flag: 0,
            content: JSON.stringify(data),
            handshake: JSON.stringify(handshake),
            ip: ip
        }, tables, dbClient);
        
        socket.emit(rtcClientEvent.getCodeFile, data);

    }catch(e){
        utils.tlConsole(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-getCodeFile",
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
    getCodeFile
}