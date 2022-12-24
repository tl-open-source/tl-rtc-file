
const room = require("../room/room");
const dog = require("../dog/dog");
const request = require('request');
const comm = require("../comm/comm");
const utils = require("../../utils/utils");
const dbOpen = require("../../conf/cfg.json").db.open;


/**
 * 操作记录
 * @param {*} data 
 */
async function dogData(data) {
    let req = {
        ctx: {
            tables: data.tables
        },
        params: data
    };
    let res = 0;
    try {
        res = await dog.add(req, null);
    } catch (e) {
        console.log(e)
    }
    return res && res.dataValues ? res.dataValues.id : 0;
}


/**
 * 创建/加入房间数据入库
 * @param {*} data 
 */
async function createJoinRoom(data) {
    let req = {
        ctx: {
            tables: data.tables
        },
        params: {
            uid: "1",
            uname: "user",
            rname: data.roomName,
            sid: data.socketId,
            ip: data.ip,
            device: data.device,
            url: data.url || "",
            content: JSON.stringify(data.content)
        }
    };

    let res = await room.createJoinRoom(req, null);

    return res && res.dataValues ? res.dataValues.id : 0;
}


/**
 * 退出房间
 * @param {*} data 
 */
async function exitRoom(data) {
    let req = {
        ctx: {
            tables: data.tables
        },
        params: {
            sid: data.sid
        }
    };
    let res = await room.exitRoomBySid(req, null);
    console.log("退出成功 : ", data, res)
    return 0;
}


/**
 * 更新管理后台频道设置信息
 * @param {*} data 
 */
async function updateManageRoom(data) {
    let req = {
        ctx: {
            tables: data.tables
        },
        params: {
            id: data.id,
            content: data.content
        }
    };
    let res = await room.updateRoomContent(req, null);
    return res;
}

/**
 * 获取管理后台频道设置信息
 * 管理频道房间号不存在就创建
 * @param {*} data 
 */
async function getOrCreateManageRoom(data) {
    let req = {
        ctx: {
            tables: data.tables
        },
        params: {
            sid: data.socketId,
            ip: data.ip,
            device: data.device,
            content: data.content
        }
    };
    let res = await room.getOrCreateManageRoom(req, null);
    return res;
}


/**
 * 发送公共频道聊天通知
 * @param {*} data 
 */
function sendChatingNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `消息体ID: ${data.msgRecoderId}\n` +
        `发送方ID: ${data.socketId}\n` +
        `文本内容: ${decodeURIComponent(data.msg)}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}

/**
 * 获取最近10条公共聊天室数据
 * @param {*} data 
 */
async function getDogChating10Info(data) {
    let req = {
        ctx: {
            tables: data.tables,
            sql: data.sql
        }
    };
    let res = await dog.getDogChating10Info(req, null);
    return res;
}


/**
 * 发送开始发送文件通知
 * @param {*} data 
 */
function sendFileInfoNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `发送方ID: ${data.from}\n` +
        `文件名称: ${data.name}\n` +
        `文件类型: ${data.type}\n` +
        `文件大小: ${data.size} == (${data.size / 1024 / 1024}M)\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送文件发送完毕通知
 * @param {*} data 
 */
function sendFileDoneNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `发送方ID: ${data.from}\n` +
        `接收方ID: ${data.to}\n` +
        `文件名称: ${data.name}\n` +
        `文件类型: ${data.type}\n` +
        `文件大小: ${data.size} == (${data.size / 1024 / 1024}M)\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送文本内容通知
 * @param {*} data 
 */
function sendTxtNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `发送方ID: ${data.from}\n` +
        `文本内容: ${decodeURIComponent(data.content)}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送开始录屏通知
 * @param {*} data 
 */
function sendStartScreenNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送停止录屏通知
 * @param {*} data 
 */
function sendStopScreenNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `录屏时长: ${data.cost}秒\n` +
        `录屏大小: ${data.size} == (${data.size / 1024 / 1024}M)\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送开始屏幕共享通知
 * @param {*} data 
 */
function sendStartScreenShareNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送停止屏幕共享通知
 * @param {*} data 
 */
function sendStopScreenShareNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `共享时长: ${data.cost}秒\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送开始音视频通话通知
 * @param {*} data 
 */
function sendStartVideoShareNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送停止音视频通话通知
 * @param {*} data 
 */
function sendStopVideoShareNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `通话时长: ${data.cost}秒\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送意见反馈通知
 * @param {*} data 
 */
function sendBugNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `反馈内容: ${data.msg}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送管理后台登录失败通知
 * @param {*} data 
 */
function sendManageLoginFailedNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `访问密码: ${data.value}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送管理后台登录成功通知
 * @param {*} data 
 */
function sendManageLoginSuccessNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `访问密码: ${data.value}\n` +
        `TOKEN: ${data.token}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送管理后台修改配置通知
 * @param {*} data 
 */
function sendManageUpdateInfoNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `修改内容: ${data.content}\n` +
        `TOKEN: ${data.token}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送管理后台非法修改配置通知
 * @param {*} data 
 */
function sendManageUpdateFailedNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `修改内容: ${data.content}\n` +
        `TOKEN: ${data.token}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 发送创建/加入房间通知
 * @param {*} data 
 */
function sendCreateJoinRoomNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `连接方ID: ${data.socketId}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 退出房间通知
 * @param {*} data 
 */
function sendExitRoomNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `连接方ID: ${data.socketId}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    comm.requestMsg(notifyMsg)
}


/**
 * 获取房间页面
 * @param {*} data 
 * @returns 
 */
async function getRoomPageHtml(data) {

    if (!dbOpen) {
        return 'db配置未开启';
    }

    let resData = await room.getManageRoomInfo({
        ctx: {
            tables: data.tables,
            sql: data.sql,
            sockets: data.sockets,
        },
        params: {
            limit: 10,
            day: data.day,
        }
    }, null)

    return `
    <style>
        .layui-layer{
            box-sizing: content-box;
            transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;
        }
        .layui-layer-page .layui-layer-content {
            background: #ededed;
        }
        .layuiadmin-span-color, .layuiadmin-big-font{
            font-weight: bold;
        }
        .layui-table{
            word-break: break-all;box-shadow: 10px 3px 15px 3px rgb(0 0 0 / 5%);
        }
        .room-recent-title{
            margin-left: 10px;margin-top: 10px;font-weight: bold;font-size: 17px;
        }
        .room-status-svg{
            width: 15px; height: 15px; top: 2px; position: relative;
        }
        .layui-layer-tab .layui-layer-title span {
            min-width: unset;
            max-width: unset;
        }
        .layui-layer-tab .layui-layer-title {
            display: inline-flex;
            width: 100%;
            padding: 0;
        }
    </style>
    <link rel="stylesheet" href="/static/layui/css/admin.css" media="all">
    <div class="layui-fluid" id="manageRoom" v-cloak>
        <span style="position: absolute; top: 22px; font-size: 20px; color: cadetblue; font-weight: 900;  margin-left: 15px;"> 当前查询时间： </span>
        <input type="text" value="${data.day}" class="layui-input" id="dayRoom" style="padding-right: 12px;text-align: right;margin-bottom: 10px; font-size: 20px; color: cadetblue; font-weight: 900;margin-bottom: 10px;" onclick="reRenderDateRoom()">
        <div class="layui-row layui-col-space15" id="tl_console_home_tpl_view">
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                    {{chooseDay}}房间频道创建/加入 <span class="layui-badge layui-bg-blue layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
                        <p class="layuiadmin-big-font">{{createRoomToday}}个</p>
                        <p> 总计房间频道创建/加入
                            <span class="layuiadmin-span-color">{{createRoomAll}}个
                                <i class="layui-inline layui-icon layui-icon-home"></i>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                    {{chooseDay}}加入房间人数
                        <span class="layui-badge layui-bg-cyan layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
                        <p class="layuiadmin-big-font">{{joinRoomTodady}}人</p>
                        <p>
                            总计加入房间人数
                            <span class="layuiadmin-span-color">{{joinRoomAll}}人
                                <i class="layui-inline layui-icon layui-icon-user"></i></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">在线房间列表</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>在线状态</th> <th>房间人数</th> <th>创建时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="r in onlineRoomList">
                                    <td style="font-weight: bold;">{{r.room}}</td>
                                    <td style="font-weight: bold;">
                                        <svg class="room-status-svg" viewBox="0 0 1024 1024" p-id="4241" width="128" height="128">
                                            <path d="M512 277.333333a234.666667 234.666667 0 1 0 0 469.333334 234.666667 234.666667 0 0 0 0-469.333334z" p-id="4242" fill="#1afa29"></path>
                                        </svg>
                                        {{r.status}}
                                    </td>
                                    <td style="font-weight: bold;">{{r.userNumber}}</td>
                                    <td>{{r.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}房间统计</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>聚合创建次数</th> <th>最近创建时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="r in todayRoomList">
                                    <td style="font-weight: bold;">{{r.room}}</td>
                                    <td style="font-weight: bold;">{{r.count}}</td>
                                    <td>{{r.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}访问设备/IP</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>IP地址</th> <th>设备信息</th> <th>时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="userAgentIp in userAgentIpList">
                                    <td style="font-weight: bold;">{{userAgentIp.room}}</td>
                                    <td >{{userAgentIp.Ip}}</td>
                                    <td>{{userAgentIp.userAgent}}</td>
                                    <td>{{userAgentIp.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
        </div>
    </div>
    
    <script>
        window.reRenderDateRoom = function(){
            layui.laydate.render({
                elem: '#dayRoom',
                closeStop: '#dayRoom',
                trigger: 'click',
                max : '${new Date()}',
                done: function(value, date, endDate){
                    if(value){
                        window.manageReload({
                            time : value
                        })
                    }
                }
            });
        }
        layui.use(['laydate'], function () {
            window.reRenderDateRoom()
        });
        new Vue({
            el: '#manageRoom',
            data: function () {
                return ${JSON.stringify(resData)}
            },
            methods: {
                sortList : function(list, fields){
                    return list.sort(function(a, b){return a[fields].localeCompare(b[fields],'zh-CN')})
                }
            },
            mounted: function () {
            }
        })
    </script>
    `
}

/**
 * 获取数据传输页面
 * @param {*} data 
 * @returns 
 */
async function getDataPageHtml(data) {
    if (!dbOpen) {
        return 'db配置未开启';
    }
    let resData = await dog.getDogManageInfo({
        ctx: {
            tables: data.tables,
            sql: data.sql,
            sockets: data.sockets,
        },
        params: {
            limit: 10,
            day: data.day,
        }
    }, null)

    return `
    <style>
        .layui-layer{
            transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;
        }
        .layui-layer-page .layui-layer-content {
            background: #ededed;
        }
        .layuiadmin-span-color, .layuiadmin-big-font{
            font-weight: bold;
        }
        .layui-table{
            word-break: break-all;box-shadow: 10px 3px 15px 3px rgb(0 0 0 / 5%);
        }
        .room-recent-title{
            margin-left: 10px;margin-top: 10px;font-weight: bold;font-size: 17px;
        }
        .room-status-svg{
            width: 15px; height: 15px; top: 2px; position: relative;
        }
        .layui-layer .layui-layer-page .layui-layer-tab{
            box-sizing: content-box;
        }
        .layui-layer-tab .layui-layer-title span {
            min-width: unset;
            max-width: unset;
        }
        .layui-layer-tab .layui-layer-title {
            display: inline-flex;
            width: 100%;
            padding: 0;
        }
    </style>
    <link rel="stylesheet" href="/static/layui/css/admin.css" media="all">
    <div class="layui-fluid" id="manageFile" v-cloak>
        <span style="position: absolute; top: 22px; font-size: 20px; color: cadetblue; font-weight: 900;  margin-left: 15px;"> 当前查询时间： </span>
        <input type="text" class="layui-input" value="${data.day}" id="dayFile" style="padding-right: 12px;text-align: right;margin-bottom: 10px; font-size: 20px; color: cadetblue; font-weight: 900;margin-bottom: 10px;" onclick="reRenderDateFile()">
        <div class="layui-row layui-col-space15" id="tl_console_data_tpl_view">
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                        {{chooseDay}}文件传输 <span class="layui-badge layui-bg-blue layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
                        <p class="layuiadmin-big-font">{{transferFileToday}}次</p>
                        <p> 总计文件传输
                            <span class="layuiadmin-span-color">{{transferFileAll}}次
                                <i class="layui-inline layui-icon layui-icon-home"></i>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                        {{chooseDay}}文件传输大小
                        <span class="layui-badge layui-bg-cyan layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
                        <p class="layuiadmin-big-font">{{transferFileSizeTodady}}M</p>
                        <p>
                            总计文件传输大小
                            <span class="layuiadmin-span-color">暂不统计
                                <i class="layui-inline layui-icon layui-icon-user"></i></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                        {{chooseDay}}文本传输
                        <span class="layui-badge layui-bg-green layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
    
                        <p class="layuiadmin-big-font">{{transferTxtTodady}}次</p>
                        <p>
                            总计文本传输
                            <span class="layuiadmin-span-color"> {{transferTxtAll}}次
                                <i class="layui-inline layui-icon layui-icon-top" style="font-size: 25px;"></i></span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-col-sm6 layui-col-md3">
                <div class="layui-card">
                    <div class="layui-card-header">
                        {{chooseDay}}公共频道发言
                        <span class="layui-badge layui-bg-orange layuiadmin-badge">天</span>
                    </div>
                    <div class="layui-card-body layuiadmin-card-list">
    
                        <p class="layuiadmin-big-font">{{transferCommTxtToday}}次</p>
                        <p>
                            总计公共频道发言
                            <span class="layuiadmin-span-color">{{transferCommTxtAll}}次
                                <i class="layui-inline layui-icon layui-icon-top" style="font-size: 25px;"></i></span>
                        </p>
                    </div>
                </div>
            </div>
    
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}文件传输列表</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>文件名称</th> <th>文件大小</th> <th>发送时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="file in fileList">
                                    <td>{{file.room}}</td>
                                    <td>{{file.name}}</td>
                                    <td>{{file.size}}M</td>
                                    <td>{{file.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}文本传输列表</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>文本内容</th> <th>文本长度</th> <th>发送时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="txt in txtList">
                                    <td>{{txt.room}}</td>
                                    <td>{{txt.content}}</td>
                                    <td>{{txt.size}}字符</td>
                                    <td>{{txt.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">{{chooseDay}}公共频道发言</div>
                        <table class="layui-table">
                            <thead> <tr> <th>房间频道</th> <th>文本内容</th> <th>文本长度</th> <th>发送时间</th> </tr> </thead>
                            <tbody>
                                <tr v-for="txt in commTxtList">
                                    <td>{{txt.room}}</td>
                                    <td>{{txt.content}}</td>
                                    <td>{{txt.size}}字符</td>
                                    <td>{{txt.createTime}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    
        </div>
    </div>
    
    <script>
        window.reRenderDateFile = function(){
            layui.laydate.render({
                elem: '#dayFile',
                closeStop: '#dayFile',
                trigger: 'click',
                max : '${new Date()}',
                done: function(value, date, endDate){
                    if(value){
                        window.manageReload({
                            time : value
                        })
                    }
                }
            });
        }
        layui.use(['laydate'], function () {
            window.reRenderDateFile()
        });
        new Vue({
            el: '#manageFile',
            data: function () {
                return ${JSON.stringify(resData)}
            },
            methods: {
                sortList : function(list, fields){
                    return list.sort(function(a, b){return a[fields].localeCompare(b[fields],'zh-CN')})
                }
            },
            mounted: function () {
            }
        })
    </script>
    `
}

/**
 * 获取设置房间页面
 * @param {*} data 
 * @returns 
 */
async function getSettingPageHtml(data) {
    if (!dbOpen) {
        return 'db配置未开启';
    }
    let resData = await getOrCreateManageRoom({
        tables: data.tables,
        rname: data.room,
        sid: data.socketId,
        ip: data.ip,
        device: data.userAgent,
        content: JSON.stringify({
            openSendBug: true,
            openScreen: true,
            openVideoShare: true,
            openScreenShare: true,
            openOnlineUser: true,
            openShareRoom: true,
            openFileTransfer: true,
            openTxtTransfer: true,
            openCommRoom: true,
            openRefleshRoom: true,
            allowNumber: true,
            allowChinese: true,
            allowSymbol: true,
            keys: []
        })
    })


    return `
    <style>
        .layui-layer{
            transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;
        }
        .layuiadmin-span-color, .layuiadmin-big-font{
            font-weight: bold;
        }
        .layui-table{
            word-break: break-all;box-shadow: 10px 3px 15px 3px rgb(0 0 0 / 5%);
        }
        .room-recent-title{
            margin-left: 10px;margin-top: 10px;font-weight: bold;font-size: 17px;
        }
        .room-status-svg{
            width: 15px; height: 15px; top: 2px; position: relative;
        }
        .layui-form-item {
            margin-top: 15px;
        }
        .switch-form .layui-input-block {
            margin-left: 15px;
        }
        @media screen and (min-width: 445px){
            .info-form .layui-form-item:first-child .layui-input-block {
                display: inline-flex;
                margin-left: 15px;
            }
        }
    </style>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15" id="tl_console_setting_tpl_view">
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">数据传输功能开关设置</div>
                        <form class="layui-form switch-form" style="display: inline-flex; flex-wrap: wrap;" lay-filter="switch-form">
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openSendBug" title="开启意见反馈" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openScreen" title="开启网页录屏" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openScreenShare" title="开启屏幕共享" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openVideoShare" title="开启音视频通话" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openOnlineUser" title="开启在线人数显示" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openShareRoom" title="开启房间链接分享" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openFileTransfer" title="开启文件传输" lay-skin="primary" checked disabled>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openTxtTransfer" title="开启文本传输" lay-skin="primary" checked disabled>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openCommRoom" title="开启公共频道发言" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="openRefleshRoom" title="开启随机刷新房间号" lay-skin="primary">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    
            <div class="layui-col-sm12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">数据传输房间信息设置</div>
                        <form class="layui-form info-form" lay-filter="info-form">
                            <div class="layui-form-item">
                                <div class="layui-block">
                                    <label class="layui-form-label" style="text-align: left;">房间号格式</label>
                                    <div class="layui-input-block">
                                        <input type="checkbox" name="allowNumber" title="允许数字格式" lay-skin="primary">
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="checkbox" name="allowChinese" title="允许中文格式" lay-skin="primary">
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="checkbox" name="allowSymbol" title="允许特殊字符格式" lay-skin="primary">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    
            <div class="layui-col-sm12" style="display: none;">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-sm12">
                        <div class="room-recent-title">数据传输事件通知设置</div>
                        <form class="layui-form notify-form" lay-filter="notify-form">
                            <div class="layui-form-item" style="margin-top: 30px;">
                                <div class="layui-block">
                                    <label class="layui-form-label" style="text-align: left;">企微机器人</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="" placeholder="机器人key" autocomplete="off"
                                            class="layui-input">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    
        </div>
    </div>
    
    <script>
        layui.use(['form'], function () {
            window.$ = layui.$;
            window.form = layui.form;
    
            let switchData = ${resData.content}
    
            form.val("switch-form",switchData)
            form.val("info-form",switchData)
    
            form.on('checkbox()', function(data){
                if(switchData[data.elem.name] !== undefined || switchData[data.elem.name] !== null){
                    switchData[data.elem.name] = data.elem.checked
                }
                window.manageChange({
                    id : ${resData.id},
                    content : switchData
                })
            });
        });
    </script>
    `
}


module.exports = {
    sendExitRoomNotify,
    sendCreateJoinRoomNotify,
    sendManageUpdateFailedNotify,
    sendManageUpdateInfoNotify,
    sendManageLoginSuccessNotify,
    sendManageLoginFailedNotify,
    sendBugNotify,
    sendStopScreenNotify,
    sendStartScreenNotify,
    sendStopScreenShareNotify,
    sendStartScreenShareNotify,
    sendStopVideoShareNotify,
    sendStartVideoShareNotify,
    sendTxtNotify,
    sendFileDoneNotify,
    sendFileInfoNotify,
    sendChatingNotify,
    getOrCreateManageRoom,
    updateManageRoom,
    exitRoom,
    createJoinRoom,
    dogData,
    getRoomPageHtml,
    getDataPageHtml,
    getSettingPageHtml,
    getDogChating10Info
}