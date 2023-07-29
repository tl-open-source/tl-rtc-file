const bussinessManageDataPage = require("./../../bussiness/manage/dataPage")
const bussinessManageRoomPage = require("./../../bussiness/manage/roomPage")
const bussinessManageSettingPage = require("./../../bussiness/manage/settingPage")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const rtcConfirm = require("./confirm");
const utils = require("./../../utils/utils");
const cfg = require("./../../../conf/cfg.json")
const manageConfig = cfg.manage
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const check = require("../../bussiness/check/content");

/**
 * 管理后台登陆验证
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function reload(io, socket, tables, dbClient, data){
    try {
        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);
        let tokens = rtcConfirm.getTokenList();

        if (!data.token || !tokens.includes(data.token)) {
            bussinessNotify.sendManageUpdateFailedNotify({
                title: "管理后台非法刷新数据",
                token: data.token,
                room: data.room,
                content: data.content,
                userAgent: userAgent,
                ip: ip
            })
            return
        }

        socket.emit(rtcClientEvent.manage, {
            token: data.token,
            socketId: socket.id,
            title: manageConfig.title,
            content: [{
                title: "房间频道",
                html: await bussinessManageRoomPage.getRoomPageHtml({
                    tables: tables,
                    dbClient: dbClient,
                    sockets: io.sockets,
                    day: data.content,
                })
            }, {
                title: "数据传输",
                html: await bussinessManageDataPage.getDataPageHtml({
                    tables: tables,
                    dbClient: dbClient,
                    sockets: io.sockets,
                    day: data.content,
                })
            }, {
                title: "其他设置",
                html: await bussinessManageSettingPage.getSettingPageHtml({
                    tables: tables,
                    dbClient: dbClient,
                    socket_id: socket.id,
                    ip: ip,
                    device: userAgent
                })
            }]
        })

        bussinessNotify.sendManageUpdateInfoNotify({
            title: "管理后台重新获取配置",
            token: data.token,
            room: data.room,
            content: JSON.stringify(data.content),
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
            title: "socket-manage-reload",
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
    reload
}