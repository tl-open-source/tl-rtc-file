const template = require("./template");
const SocketHandler = template.SocketHandler;
const dbOpen = require("../../conf/cfg.json").db.open;
const manageConfig = require("../../conf/cfg.json").router.manage;
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
    sendTxtNotify,
    sendFileDoneNotify,
    sendFileInfoNotify,
    sendChatingNotify,
    updateManageRoom,
    exitRoom,
    createJoinRoom,
    dogData,
    getOrCreateManageRoom,
    getRoomPageHtml,
    getDataPageHtml,
    getSettingPageHtml
} = require("./bussiness");
let tables = {};
let tokens = [];
let sql = {};

/**
 * 执行器
 * @param {*} tabs 
 * @param {*} config 
 */
function excute(tabs, sequelize, config) {
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
    io.sockets.on('connection',function (socket) {
  
        var handler = new SocketHandler(io.sockets,socket);


        socket.on("getSwitchData", async function(){
            if(!dbOpen){
                handler._message({
                    emitType : "switchData",
                    data: {
                        openSendBug : true,
                        openScreen : true,
                        openOnlineUser : true,
                        openShareRoom : true,
                        openFileTransfer : true,
                        openTxtTransfer : true,
                        openCommRoom : true,
                        openRefleshRoom : true,
                        allowNumber : true,
                        allowChinese : true,
                        allowSymbol : true,
                    }
                })
                return
            }
            let handshake = socket.handshake
            let userAgent = handshake.headers['user-agent'].toString().substr(0,255);
            let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'] ;
            
            let manageInfo = await getOrCreateManageRoom({
                tables : tables,
                sid: socket.id,
                ip: ip,
                device: userAgent,
                content : JSON.stringify({
                    openSendBug : true,
                    openScreen : true,
                    openOnlineUser : true,
                    openShareRoom : true,
                    openFileTransfer : true,
                    openTxtTransfer : true,
                    openCommRoom : true,
                    openRefleshRoom : true,
                    allowNumber : true,
                    allowChinese : true,
                    allowSymbol : true,
                    keys : []
                })
            })
            let switchData = JSON.parse(manageInfo.content)
            if(switchData && switchData.keys){
                delete switchData.keys;
                handler._message({
                    emitType : "switchData",
                    data: switchData
                })
            }
        })

        socket.on('disconnect',async function (reason) {
            handler._disconnect({});
            await exitRoom({sid : socket.id, tables : tables})
        });

        socket.on('createAndJoin', async function (message) {
            try{
                let room = message.room;
                if(room && room.length > 15){
                    room = room.toString().substr(0,14);
                }
        
                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0,255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'] ;
    
                let recoderId = 0;
                if(manageConfig.room !== room){
                    recoderId = await createJoinRoom({
                        socketId: socket.id,
                        roomName: room,
                        ip: ip,
                        device: userAgent,
                        content: {handshake : handshake},
                        tables : tables
                    });
                }
        
                handler._createAndJoin(message,{
                    created : {recoderId:recoderId},
                    joined : {recoderId:recoderId}
                })
    
                // 管理员房间
                if(room === manageConfig.room){
                    message.socketId = socket.id;
                    socket.emit("manageCheck", message)
                }
    
                sendCreateJoinRoomNotify({
                    title : recoderId === 0 ? "创建/加入后台管理房间" : "创建/加入房间",
                    socketId: socket.id,
                    room: room,
                    recoderId: recoderId,
                    userAgent: userAgent,
                    ip : ip,
                })

                io.sockets.adapter.rooms[room].createTime = formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")
            }catch(e){
                console.log(e)
                handler._message({
                    room : message.room,
                    emitType : "tips",
                    to : socket.id,
                    msg : "系统错误"
                },{})
            }
        });
    
        socket.on('offer', function (message) {
            handler._offer(message,{})
        });
        
        socket.on('answer', function (message) {
            handler._answer(message,{})
        });
        
        socket.on('candidate', function (message) {
            handler._candidate(message,{})
        });
      
        socket.on('exit', async function (message) {
            try{
                let recoderId = message.recoderId;
                handler._exit(message,{})
    
                if(recoderId != undefined){
                    await exitRoom({sid : socket.id,tables : tables})
    
                    let handshake = socket.handshake
                    let userAgent = handshake.headers['user-agent'].toString().substr(0,255);
                    let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'] ;
    
                    sendExitRoomNotify({
                        title : "退出房间",
                        room : message.room,
                        socketId : socket.id,
                        recoderId:message.recoderId,
                        userAgent : userAgent,
                        ip : ip
                    })
                }
            }catch(e){
                handler._message({
                    room : message.room,
                    emitType : "tips",
                    to : socket.id,
                    msg : "系统错误"
                },{})
            }
        });

        socket.on('manageConfirm', async function (message) {
            try{
                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0,255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'] ;
    
                if(message.value !== manageConfig.password || message.room !== manageConfig.room){
                    sendManageLoginFailedNotify({
                        title : "管理后台登录失败",
                        room : message.room,
                        value : message.value,
                        userAgent : userAgent,
                        ip: ip
                    })
                    return
                }
    
                let token = genRoom();
                tokens.push(token)
    
                sendManageLoginSuccessNotify({
                    title : "管理后台登录成功",
                    token : token,
                    room : message.room,
                    value : message.value,
                    userAgent :userAgent,
                    ip : ip
                })
    
                socket.emit("manage",{
                    token: token,
                    socketId :socket.id,
                    title : manageConfig.title,
                    content : [{
                        title : "房间频道",
                        html : await getRoomPageHtml({
                            tables : tables,
                            sql : sql,
                            sockets :  io.sockets
                        })
                    },{
                        title : "数据传输",
                        html : await getDataPageHtml({
                            tables : tables,
                            sql : sql,
                            sockets :  io.sockets
                        })
                    },{
                        title : "其他设置",
                        html : await getSettingPageHtml({
                            tables : tables,
                            rname: message.room,
                            sid: socket.socketId,
                            ip: ip,
                            device: userAgent,
                        })
                    }]
                })
            }catch(e){
                console.log(e)
                handler._message({
                    room : message.room,
                    emitType : "tips",
                    to : socket.id,
                    msg : "系统错误"
                },{})
            }
        });

        socket.on('manageChange', async function(message){
            try{
                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0,255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'] ;
    
                if(!message.token || !tokens.includes(message.token)){
                    sendManageUpdateFailedNotify({
                        title : "管理后台非法修改配置",
                        token : message.token,
                        room : message.room,
                        content : message.content,
                        userAgent :userAgent,
                        ip : ip
                    })
                    return
                }
    
                await updateManageRoom({
                    tables : tables,
                    id : message.id,
                    content : JSON.stringify(message.content)
                })
    
                sendManageUpdateInfoNotify({
                    title : "管理后台修改配置",
                    token : message.token,
                    room : message.room,
                    content : JSON.stringify(message.content),
                    userAgent : userAgent,
                    ip: ip
                })
    
                handler._message({
                    room : message.room,
                    emitType : "tips",
                    to : socket.id,
                    msg : "更新成功"
                },{})
                
            }catch(e){
                console.log(e)
                handler._message({
                    room : message.room,
                    emitType : "tips",
                    to : socket.id,
                    msg : "系统错误"
                },{})
            }
        });

        socket.on('message',async function (message) {
            try{
                let emitType = message.emitType;
                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0,255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'] ;
    
                let opName = {
                    "sendFileInfo": "准备发送文件",
                    "sendDone": "文件发送完毕",
                    "sendBugs": "收到问题反馈",
                    "sendTxt": "发送文本内容",
                    "startScreen": "开始网页录屏",
                    "stopScreen": "停止网页录屏"
                }
    
                handler._message(message,{})
    
                if(emitType === 'sendFileInfo'){
                    sendFileInfoNotify({
                        title : opName.sendFileInfo,
                        room : message.room,
                        recoderId : message.recoderId,
                        from : message.from,
                        name : message.name,
                        type : message.type,
                        size : message.size,
                        userAgent : userAgent,
                        ip : ip
                    })
                }
    
                if(emitType === 'sendDone'){
                    sendFileDoneNotify({
                        title : opName.sendDone,
                        room : message.room,
                        to : message.to,
                        from : message.from,
                        name : message.name,
                        type : message.type,
                        size : message.size,
                        userAgent : userAgent,
                        ip : ip
                    })
                }
    
                if(emitType === 'sendBugs'){
                    sendBugNotify({
                        title : opName.sendBugs,
                        room : message.room,
                        msg : message.msg,
                        userAgent : userAgent,
                        ip : ip
                    })
                }
    
                if(emitType === 'sendTxt'){
                    sendTxtNotify({
                        title : opName.sendTxt,
                        room : message.room,
                        from : message.from,
                        recoderId : message.recoderId,
                        content : message.content,
                        userAgent : userAgent,
                        ip : ip
                    })
                }
    
                if(emitType === 'startScreen'){
                    sendStartScreenNotify({
                        title : opName.startScreen,
                        userAgent : userAgent,
                        ip : ip
                    })
                }
    
                if(emitType === 'stopScreen'){
                    sendStopScreenNotify({
                        title : opName.stopScreen,
                        userAgent : message.userAgent,
                        cost : message.cost,
                        size : message.size,
                        userAgent : userAgent,
                        ip : ip
                    })
                }
    
                if(opName[message.emitType]){
                    await dogData({
                        tables : tables,
                        name : opName[message.emitType],
                        roomId : "",
                        socketId : "",
                        device : userAgent,
                        flag : 0,
                        content : JSON.stringify(message),
                        handshake : JSON.stringify(handshake),
                        ip : ip
                    });
                }
            }catch(e){
                console.log(e)
                handler._message({
                    room : message.room,
                    emitType : "tips",
                    to : socket.id,
                    msg : "系统错误"
                },{})
            }
        });

        socket.on('chating', async function (message) {
            try{
                handler._chating(message,{})

                let handshake = socket.handshake
                let userAgent = handshake.headers['user-agent'].toString().substr(0,255);
                let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'] ;
    
                let recoderId = await dogData({
                    name : "公共聊天室",
                    tables : tables,
                    roomId : message.room,
                    socketId : message.socketId,
                    device : userAgent,
                    flag : 0,
                    content : decodeURIComponent(message.msg),
                    handshake : JSON.stringify(handshake),
                    ip: ip
                });
            
                sendChatingNotify({
                    title : '公共聊天频道',
                    room :  message.room,
                    recoderId :  message.recoderId,
                    msgRecoderId :  recoderId,
                    socketId :  message.socketId,
                    msg :  message.msg,
                    userAgent : userAgent,
                    ip : ip
                })
            }catch(e){
                console.log(e)
                handler._message({
                    room : message.room,
                    emitType : "tips",
                    to : socket.id,
                    msg : "系统错误"
                },{})
            }
        });

        socket.on('count', function (message) {
            handler._count(message,{})
        });

        socket.on('close', function (message) {
            handler._close(message,{})
        });
  
    });
}


module.exports = {
    excute : excute
}