const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const daoDog = require("./../../dao/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const utils = require("./../../utils/utils");
const seafile = require("./../../bussiness/oss/seafile")
const rtcCommData = require("./../rtcCommData/commData");
const check = require("../../bussiness/check/content");

/**
 * 生成取件码上传链接
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function prepareCodeFile(io, socket, tables, dbClient, data){
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
    
        let fileSize = data.size || 0;
    
        if(fileSize > 1024 * 1024 * 10){
            socket.emit("tips", {
                room: data.room,
                to: socket.id,
                msg: "文件太大，暂不支持"
            });
            return
        }
    
        data.uploadLink = "";
        const ossToken = await seafile.seafileGetToken();
        if(ossToken){
            let uploadLink = await seafile.seafileGetUploadLink(ossToken);
            uploadLink = uploadLink.replace(/^(\s|\")+|(\s|\")+$/g, '') + "?ret-json=1";
            data.uploadLink = uploadLink;
            data.replace = 0;
            data.parent_dir = "/";
        }
    
        utils.tlConsole("获取上传链接成功 : ",data.uploadLink)
    
        bussinessNotify.prepareCodeFileNotify({
            title: "生成取件码上传链接",
            room: data.room,
            from: data.from,
            name: data.name,
            type: data.type,
            size: data.size,
            link : data.uploadLink,
            userAgent: userAgent,
            ip: ip
        })
    
        await daoDog.addDogData({
            name: "生成取件码上传链接",
            roomId: data.room || "",
            socketId: socket.id,
            device: userAgent,
            flag: 0,
            content: JSON.stringify(data),
            handshake: JSON.stringify(handshake),
            ip: ip
        }, tables, dbClient);
        
        socket.emit(rtcClientEvent.prepareCodeFile, data);

    }catch(e){
        utils.tlConsole(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-prepareCodeFile",
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
    prepareCodeFile
}