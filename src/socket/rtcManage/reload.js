const bussinessManageDataPage = require("./../../bussiness/manage/dataPage")
const bussinessManageRoomPage = require("./../../bussiness/manage/roomPage")
const bussinessManageSettingPage = require("./../../bussiness/manage/settingPage")
const bussinessNotify = require("./../../bussiness/notify/notifySocketEvent")
const rtcMessage = require("./../rtcMessage/message");
const rtcConfirm = require("./confirm");
const utils = require("./../../utils/utils");
const cfg = require("./../../../conf/cfg.json")
const manageConfig = cfg.router.manage

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

        socket.emit("manage", {
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
                    rname: data.room,
                    sid: socket.id,
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
        console.log(e)
        rtcMessage.message(io, socket, tables, dbClient, {
            room: data.room,
            emitType: "tips",
            to: socket.id,
            msg: "系统错误"
        })
    }
}

module.exports = {
    reload
}