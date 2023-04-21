const bussinessManageDataPage = require("./../../bussiness/manage/dataPage")
const bussinessManageRoomPage = require("./../../bussiness/manage/roomPage")
const bussinessManageSettingPage = require("./../../bussiness/manage/settingPage")
const bussinessNotify = require("./../../bussiness/notify/notifySocketEvent")
const rtcMessage = require("./../rtcMessage/message");
const utils = require("./../../utils/utils");
const cfg = require("./../../../conf/cfg.json")
const manageConfig = cfg.router.manage

// 登陆token列表
let tokens = [];

/**
 * 管理后台登陆验证密码
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function confirm(io, socket, tables, dbClient, data){
    try {
        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        if (data.value !== manageConfig.password || data.room !== manageConfig.room) {
            rtcMessage.message(io, socket, tables, dbClient, {
                room: data.room,
                emitType: "tips",
                to: socket.id,
                msg: "秘钥不正确"
            })

            bussinessNotify.sendManageLoginFailedNotify({
                title: "管理后台登录失败",
                room: data.room,
                value: data.value,
                userAgent: userAgent,
                ip: ip
            })
            return
        }

        let token = utils.genRoom();
        tokens.push(token)

        bussinessNotify.sendManageLoginSuccessNotify({
            title: "管理后台登录成功",
            token: token,
            room: data.room,
            value: data.value,
            userAgent: userAgent,
            ip: ip
        })

        socket.emit("manage", {
            token: token,
            socketId: socket.id,
            title: manageConfig.title,
            content: [{
                title: "房间频道",
                html: await bussinessManageRoomPage.getRoomPageHtml({
                    tables: tables,
                    dbClient: dbClient,
                    sockets: io.sockets,
                    day: utils.formateDateTime(new Date(), "yyyy-MM-dd"),
                })
            }, {
                title: "数据传输",
                html: await bussinessManageDataPage.getDataPageHtml({
                    tables: tables,
                    dbClient: dbClient,
                    sockets: io.sockets,
                    day: utils.formateDateTime(new Date(), "yyyy-MM-dd"),
                })
            }, {
                title: "其他设置",
                html: await bussinessManageSettingPage.getSettingPageHtml({
                    tables: tables,
                    rname: data.room,
                    sid: socket.socketId,
                    ip: ip,
                    device: userAgent
                })
            }]
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

function getTokenList(){
    return tokens;
}

module.exports = {
    confirm,
    getTokenList
}