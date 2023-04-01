const template = require("./template");
const seafile = require('../oss/seafile')
const openai = require("../openai/openai")
const SocketHandler = template.SocketHandler;
const {
    router
} = require("../../conf/cfg.json");
const manageConfig = router.manage;
const {
    genRoom,
    formateDateTime
} = require("../../utils/utils");
const {
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
    sendCodeFileNotify,
    sendOpenaiChatNotify,
    updateManageRoom,
    exitRoom,
    createJoinRoom,
    dogData,
    getOrCreateManageRoom,
    getRoomPageHtml,
    getDataPageHtml,
    getSettingPageHtml,
    getDogChating10Info
} = require("./bussiness");

// 数据表
let tables = {};
// 登陆token数组
let tokens = [];
// sql操作
let sql = {};
// 公共聊天数据
let chating = []
// 开关数据
let cacheSwitchData = {};
// 通知事件定义
let opName = {
    "sendFileInfo": "准备发送文件",
    "sendDone": "文件发送完毕",
    "sendBugs": "收到问题反馈",
    "sendTxt": "发送文本内容",
    "startScreen": "开始网页录屏",
    "stopScreen": "停止网页录屏",
    "startScreenShare": "开始屏幕共享",
    "stopScreenShare": "停止屏幕共享",
    "startVideoShare": "开始音视频通话",
    "stopVideoShare": "停止音视频通话",
    "startPasswordRoom": "创建密码房间",
    "addCodeFile": "添加取货码文件",
    "getCodeFile" : "取件码取件",
    "openaiChat" : "ChatGPT聊天"
}

/**
 * 执行器
 * @param {*} tabs 
 * @param {*} config 
 */
async function excute(tabs, sequelize, config) {
    tables = tabs;
    sql = sequelize;

    let io = config.ws.io;
    if (io === undefined || io === null) {
        console.error("init socket error ");
        return;
    }

    //前置执行函数
    if (config.ws.beforeInit) {
        config.ws.beforeInit();
    }

    chating = await getDogChating10Info({
        tables: tables,
        sql: sql,
    });

    listen(io);

    //后置执行函数
    if (config.ws.afterInit) {
        config.ws.afterInit();
    }
}


/**
 * 监听函数
 * @param {*} io 
 */
function listen(io) {
    io.sockets.on('connection', function (socket) {

        var handler = new SocketHandler(io.sockets, socket);

        // 通知一下在线人数
        handler._count()

        // 断开连接
        socket.on('disconnect', async function (reason) {
            handler._disconnect({});
            await exitRoom({ sid: socket.id, tables: tables })
        });

        // ice
        socket.on('offer', function (message) {
            handler._offer(message, {})
        });

        // ice
        socket.on('answer', function (message) {
            handler._answer(message, {})
        });

        // ice
        socket.on('candidate', function (message) {
            handler._candidate(message, {})
        });

        // 在线人数统计
        socket.on('count', function (message) {
            handler._count(message, {})
        });

        // 退出
        socket.on('exit', async function (message) {
            try {
                let recoderId = message.recoderId;
                handler._exit(message, {})

                if (recoderId != undefined) {
                    await exitRoom({ sid: socket.id, tables: tables })

                    let handshake = socket.handshake
                    let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
                    let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

                    sendExitRoomNotify({
                        title: "退出房间",
                        room: message.room,
                        socketId: socket.id,
                        recoderId: message.recoderId,
                        userAgent: userAgent,
                        ip: ip
                    })
                }
            } catch (e) {
                handler._message({
                    room: message.room,
                    emitType: "tips",
                    to: socket.id,
                    msg: "系统错误"
                }, {})
            }
        });


        socket.on("getCommData", async function () {
            let handshake = socket.handshake
            let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
            let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

            let manageInfo = await getOrCreateManageRoom({
                tables: tables,
                sid: socket.id,
                ip: ip,
                device: userAgent,
                content: ""
            })
            let switchData = JSON.parse(manageInfo.content)
            if (switchData && switchData.keys) {
                delete switchData.keys;
            }
            if(switchData){
                cacheSwitchData = switchData
            }
            handler._message({
                emitType: "commData",
                switchData: switchData,
                chatingData: chating,
            })
        })

        // 创建或加入房间
        socket.on('createAndJoin', async function (message) {
            try {
                let room = message.room;
                let type = message.type;
                if (room && room.length > 15) {
                    room = room.toString().substr(0, 14);
                }
                let password = message.password || '';
                if (password && password.length > 6) {
                    password = password.toString().substr(0, 6);
                }

                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

                let recoderId = 0;
                if (manageConfig.room !== room) {
                    recoderId = await createJoinRoom({
                        socketId: socket.id,
                        roomName: room,
                        ip: ip,
                        device: userAgent,
                        content: { handshake: handshake },
                        password: password,
                        tables: tables
                    });
                }

                handler._createAndJoin(message, {
                    created: { recoderId: recoderId },
                    joined: { recoderId: recoderId }
                })

                // 管理员房间
                if (room === manageConfig.room) {
                    message.socketId = socket.id;
                    socket.emit("manageCheck", message)
                }

                sendCreateJoinRoomNotify({
                    title: recoderId === 0 ? "创建/加入后台管理房间" : "创建/加入房间",
                    password: password,
                    socketId: socket.id,
                    room: room,
                    recoderId: recoderId,
                    userAgent: userAgent,
                    ip: ip,
                })

                io.sockets.adapter.rooms[room].createTime = formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")
            } catch (e) {
                console.log(e)
                handler._message({
                    room: message.room,
                    emitType: "tips",
                    to: socket.id,
                    msg: "系统错误"
                }, {})
            }
        });

        // 管理后台登陆验证
        socket.on('manageConfirm', async function (message) {
            try {
                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

                if (message.value !== manageConfig.password || message.room !== manageConfig.room) {
                    handler._message({
                        room: message.room,
                        emitType: "tips",
                        to: socket.id,
                        msg: "秘钥不正确"
                    }, {})
                    sendManageLoginFailedNotify({
                        title: "管理后台登录失败",
                        room: message.room,
                        value: message.value,
                        userAgent: userAgent,
                        ip: ip
                    })
                    return
                }

                let token = genRoom();
                tokens.push(token)

                sendManageLoginSuccessNotify({
                    title: "管理后台登录成功",
                    token: token,
                    room: message.room,
                    value: message.value,
                    userAgent: userAgent,
                    ip: ip
                })

                socket.emit("manage", {
                    token: token,
                    socketId: socket.id,
                    title: manageConfig.title,
                    content: [{
                        title: "房间频道",
                        html: await getRoomPageHtml({
                            tables: tables,
                            sql: sql,
                            sockets: io.sockets,
                            day: formateDateTime(new Date(), "yyyy-MM-dd"),
                        })
                    }, {
                        title: "数据传输",
                        html: await getDataPageHtml({
                            tables: tables,
                            sql: sql,
                            sockets: io.sockets,
                            day: formateDateTime(new Date(), "yyyy-MM-dd"),
                        })
                    }, {
                        title: "其他设置",
                        html: await getSettingPageHtml({
                            tables: tables,
                            rname: message.room,
                            sid: socket.socketId,
                            ip: ip,
                            device: userAgent
                        })
                    }]
                })
            } catch (e) {
                console.log(e)
                handler._message({
                    room: message.room,
                    emitType: "tips",
                    to: socket.id,
                    msg: "系统错误"
                }, {})
            }
        });

        // 管理后台修改数据
        socket.on('manageChange', async function (message) {
            try {
                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

                if (!message.token || !tokens.includes(message.token)) {
                    sendManageUpdateFailedNotify({
                        title: "管理后台非法修改配置",
                        token: message.token,
                        room: message.room,
                        content: message.content,
                        userAgent: userAgent,
                        ip: ip
                    })
                    return
                }

                await updateManageRoom({
                    tables: tables,
                    id: message.id,
                    content: JSON.stringify(message.content)
                })

                sendManageUpdateInfoNotify({
                    title: "管理后台修改配置",
                    token: message.token,
                    room: message.room,
                    content: JSON.stringify(message.content),
                    userAgent: userAgent,
                    ip: ip
                })

                handler._message({
                    room: message.room,
                    emitType: "tips",
                    to: socket.id,
                    msg: "更新成功"
                }, {})

                //通知下全频道
                let switchData = message.content
                if (switchData && switchData.keys) {
                    delete switchData.keys;
                }
                if(switchData){
                    cacheSwitchData = switchData
                }
                handler._message({
                    emitType: "commData",
                    switchData: switchData,
                })

            } catch (e) {
                console.log(e)
                handler._message({
                    room: message.room,
                    emitType: "tips",
                    to: socket.id,
                    msg: "系统错误"
                }, {})
            }
        });

        // 管理后台刷新
        socket.on('manageReload', async function (message) {
            try {
                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

                if (!message.token || !tokens.includes(message.token)) {
                    sendManageUpdateFailedNotify({
                        title: "管理后台非法刷新数据",
                        token: message.token,
                        room: message.room,
                        content: message.content,
                        userAgent: userAgent,
                        ip: ip
                    })
                    return
                }

                socket.emit("manage", {
                    token: message.token,
                    socketId: socket.id,
                    title: manageConfig.title,
                    content: [{
                        title: "房间频道",
                        html: await getRoomPageHtml({
                            tables: tables,
                            sql: sql,
                            sockets: io.sockets,
                            day: message.content,
                        })
                    }, {
                        title: "数据传输",
                        html: await getDataPageHtml({
                            tables: tables,
                            sql: sql,
                            sockets: io.sockets,
                            day: message.content,
                        })
                    }, {
                        title: "其他设置",
                        html: await getSettingPageHtml({
                            tables: tables,
                            rname: message.room,
                            sid: socket.socketId,
                            ip: ip,
                            device: userAgent
                        })
                    }]
                })

                sendManageUpdateInfoNotify({
                    title: "管理后台重新获取配置",
                    token: message.token,
                    room: message.room,
                    content: JSON.stringify(message.content),
                    userAgent: userAgent,
                    ip: ip
                })

            } catch (e) {
                console.log(e)
                handler._message({
                    room: message.room,
                    emitType: "tips",
                    to: socket.id,
                    msg: "系统错误"
                }, {})
            }
        });

        // 公共消息
        socket.on('message', async function (message) {
            try {
                let emitType = message.emitType;
                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

                handler._message(message, {})

                if (emitType === 'sendFileInfo') {
                    sendFileInfoNotify({
                        title: opName.sendFileInfo,
                        room: message.room,
                        recoderId: message.recoderId,
                        from: message.from,
                        name: message.name,
                        type: message.type,
                        size: message.size,
                        userAgent: userAgent,
                        ip: ip
                    })
                }

                if (emitType === 'sendDone') {
                    sendFileDoneNotify({
                        title: opName.sendDone,
                        room: message.room,
                        to: message.to,
                        from: message.from,
                        name: message.name,
                        type: message.type,
                        size: message.size,
                        userAgent: userAgent,
                        ip: ip
                    })
                }

                if (emitType === 'sendBugs') {
                    sendBugNotify({
                        title: opName.sendBugs,
                        room: message.room,
                        msg: message.msg,
                        userAgent: userAgent,
                        ip: ip
                    })
                }

                if (emitType === 'sendTxt') {
                    sendTxtNotify({
                        title: opName.sendTxt,
                        room: message.room,
                        from: message.from,
                        recoderId: message.recoderId,
                        content: message.content,
                        userAgent: userAgent,
                        ip: ip
                    })
                }

                if (emitType === 'startScreen') {
                    sendStartScreenNotify({
                        title: opName.startScreen,
                        userAgent: userAgent,
                        ip: ip
                    })
                }

                if (emitType === 'stopScreen') {
                    sendStopScreenNotify({
                        title: opName.stopScreen,
                        userAgent: message.userAgent,
                        cost: message.cost,
                        size: message.size,
                        userAgent: userAgent,
                        ip: ip
                    })
                }

                if (emitType === 'startScreenShare') {
                    sendStartScreenShareNotify({
                        title: opName.startScreenShare,
                        userAgent: userAgent,
                        ip: ip,
                        room: message.room
                    })
                }

                if (emitType === 'stopScreenShare') {
                    sendStopScreenShareNotify({
                        title: opName.stopScreenShare,
                        userAgent: message.userAgent,
                        cost: message.cost,
                        userAgent: userAgent,
                        ip: ip,
                        room: message.room
                    })
                }

                if (emitType === 'startVideoShare') {
                    sendStartVideoShareNotify({
                        title: opName.startVideoShare,
                        userAgent: userAgent,
                        ip: ip,
                        room: message.room
                    })
                }

                if (emitType === 'stopVideoShare') {
                    sendStopVideoShareNotify({
                        title: opName.stopVideoShare,
                        userAgent: message.userAgent,
                        cost: message.cost,
                        userAgent: userAgent,
                        ip: ip,
                        room: message.room
                    })
                }

                if (opName[message.emitType]) {
                    await dogData({
                        tables: tables,
                        name: opName[message.emitType],
                        roomId: "",
                        socketId: "",
                        device: userAgent,
                        flag: 0,
                        content: JSON.stringify(message),
                        handshake: JSON.stringify(handshake),
                        ip: ip
                    });
                }
            } catch (e) {
                console.log(e)
                handler._message({
                    room: message.room,
                    emitType: "tips",
                    to: socket.id,
                    msg: "系统错误"
                }, {})
            }
        });

        // 公共聊天频道
        socket.on('chating', async function (message) {
            try {
                if(!cacheSwitchData.openCommRoom){
                    handler._message({
                        room: message.room,
                        emitType: "tips",
                        to: socket.id,
                        msg: "当前功能已暂时关闭，有问题可以加群交流"
                    }, {})
                    return
                }
                message.time = new Date().toLocaleString()

                if (chating.length < 10) {
                    chating.push(message)
                } else {
                    chating.shift()
                    chating.push(message)
                }

                handler._chating(message, {})

                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

                let recoderId = await dogData({
                    name: "公共聊天室",
                    tables: tables,
                    roomId: message.room,
                    socketId: message.socketId,
                    device: userAgent,
                    flag: 0,
                    content: message.msg,
                    handshake: JSON.stringify(handshake),
                    ip: ip
                });

                sendChatingNotify({
                    title: '公共聊天频道',
                    room: message.room,
                    recoderId: recoderId,
                    msgRecoderId: recoderId,
                    socketId: message.socketId,
                    msg: message.msg,
                    userAgent: userAgent,
                    ip: ip
                })
            } catch (e) {
                console.log(e)
                handler._message({
                    room: message.room,
                    emitType: "tips",
                    to: socket.id,
                    msg: "系统错误"
                }, {})
            }
        });

        // openai聊天
        socket.on('openai', async function (message) {
            if(!cacheSwitchData.openAiChat){
                handler._message({
                    room: message.room,
                    emitType: "tips",
                    to: socket.id,
                    msg: "当前功能已暂时关闭，有问题可以加群交流"
                }, {})
                return
            }

            let roomId = message.room || 10086;
            let content = message.content;
            let value = message.value;
            if(value){
                value = value.substr(0, 1000)
            }

            // 有上下文，结合上下文
            if(content){
                content = content.substr(0, 5000);
                content += "。\n，在上面的基础上继续回答 "+value+"，并且注意如果我的提问内容或者你的回答内容涉及政治，请回复 “我已经被设置关闭涉政问答功能” ";
            }else{
                // 没有就默认
                content = value;
            }

            let handshake = socket.handshake
            let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);
            let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];

            message.time = new Date().toLocaleString()
            message.type = "openai";
            message.content = await openai.openaiChat(content, roomId);
            message.value = "";
            handler._openaiChat(message)

            await dogData({
                name: opName.openaiChat,
                tables: tables,
                roomId: roomId,
                socketId: message.socketId,
                device: userAgent,
                flag: 0,
                content: decodeURIComponent(message.content),
                handshake: JSON.stringify(handshake),
                ip: ip
            });

            sendOpenaiChatNotify({
                title: opName.openaiChat,
                room: roomId,
                keys : JSON.stringify(openai.apiKeysStatus()),
                content: content,
                answer : message.content,
                userAgent: userAgent,
                ip: ip
            })
        });

    });
}

module.exports = {
    excute
}