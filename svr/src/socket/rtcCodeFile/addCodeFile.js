const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const daoDog = require("./../../dao/dog/dog")
const daoFile = require("./../../dao/file/file")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const utils = require("./../../utils/utils");
const seafile = require("./../../bussiness/oss/seafile")
const rtcCommData = require("./../rtcCommData/commData");
const check = require("../../bussiness/check/content");

/**
 * 添加取件码文件
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function addCodeFile(io, socket, tables, dbClient, data){
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

        let donwloadLink = ""
        const ossToken = await seafile.seafileGetToken();
        if(ossToken){
            let downloadData = await seafile.seafileGetDownLoadLink(ossToken, {
                name : data.ossFileName,
                can_edit : false,
                can_download : true,
                expire_days : 1
            });
            if(downloadData){
                donwloadLink = downloadData.downloadLink;
            }
        }

        data.donwloadLink = donwloadLink;

        utils.tlConsole("获取下载链接成功 : ",donwloadLink)

        bussinessNotify.addCodeFileNotify({
            title: "添加取件码文件",
            room: data.room,
            from: data.from,
            name: data.name,
            type: data.type,
            size: data.size,
            ossFileId : data.ossFileId,
            ossFileName : data.ossFileName,
            donwloadLink : data.donwloadLink,
            userAgent: userAgent,
            ip: ip
        })

        await daoDog.addDogData({
            name: "添加取件码文件",
            roomId: data.room || "",
            socketId: socket.id,
            device: userAgent,
            flag: 0,
            content: JSON.stringify(data),
            handshake: JSON.stringify(handshake),
            ip: ip
        }, tables, dbClient);

        await daoFile.addCodeFile({
            roomId: data.room || "",
            code: data.ossFileId,
            name : data.name,
            ossName : data.ossFileName,
            download: data.donwloadLink,
            content: JSON.stringify(data),
        }, tables, dbClient)
        
        //不返回下载链接
        delete data.donwloadLink;
        socket.emit(rtcClientEvent.addCodeFile, data);
        
    }catch(e){
        utils.tlConsole(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-addCodeFile",
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
    addCodeFile
}