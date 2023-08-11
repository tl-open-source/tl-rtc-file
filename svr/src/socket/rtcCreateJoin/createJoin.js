const daoRoom = require("./../../dao/room/room")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const rtcCount = require("./../rtcCount/count");
const utils = require("./../../utils/utils");
const {inject_env_config} = require("./../../../conf/env_config");
const cfg = inject_env_config(require("./../../../conf/cfg.json"))
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const check = require("../../bussiness/check/content");

/**
 * 用户创建或加入房间
 * @param {*} io 
 * @param {*} socket 
 * @param {*} tables 
 * @param {*} dbClient 
 * @param {*} data 
 * @returns 
 */
async function userCreateAndJoin(io, socket, tables, dbClient, data){
    let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

    let {
        room, type = 'file', nickName = '', password = '', 
        langMode = 'zh', ua = '', network = ''
    } = data;

    if (room && room.length > 15) {
        room = room.toString().substr(0, 14);
    }

    if(nickName && nickName.length > 20){
        nickName = nickName.substr(0, 20);
    }

    if(['zh', 'en'].indexOf(langMode) === -1){
        langMode = 'zh'
    }

    if(['file', 'screen', 'video', 'password', 'live'].indexOf(type) === -1){
        type = 'file'
    }

    if(['pc', 'mobile'].indexOf(ua) === -1){
        ua = 'pc';
    }

    if(['wifi', '4g', '3g', '2g', '5g'].indexOf(network) === -1){
        network = '2g';
    }

    if(password && password.length > 6){
        password = password.toString().substr(0,6);
    }

    //设置连接信息
    io.sockets.connected[socket.id].nickName = nickName;
    io.sockets.connected[socket.id].langMode = langMode;
    io.sockets.connected[socket.id].ua = ua;
    io.sockets.connected[socket.id].network = network;
    io.sockets.connected[socket.id].ip = ip;
    const joinTime = utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")
    io.sockets.connected[socket.id].joinTime = joinTime;
    io.sockets.connected[socket.id].userAgent = userAgent;
    io.sockets.connected[socket.id].owner = false;

    let recoderId = await daoRoom.createJoinRoom({
        uid: "1",
        uname: nickName,
        room_id: room,
        socket_id: socket.id,
        pwd: password,
        ip: ip,
        device: userAgent,
        content: JSON.stringify({ handshake: handshake })
    }, tables, dbClient);
    
    let clientsInRoom = io.sockets.adapter.rooms[room];
    let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

    if (numClients === 0) {
        socket.join(room);

        socket.emit(rtcClientEvent.created, {
            id: socket.id,
            room: room,
            nickName : nickName,
            peers: [],
            type: type,
            owner : true,
            recoderId : recoderId
        });
        //设置为房主
        io.sockets.connected[socket.id].owner = true;

        //设置房间类型
        io.sockets.adapter.rooms[room].type = type;

        //密码房间设置密码
        if(type === 'password'){
            io.sockets.adapter.rooms[room].password = password
        }
    }else {
        //加入时，房间类型不匹配，提示并退出
        const createdRoomType = io.sockets.adapter.rooms[room].type;
        if(type !== createdRoomType){
            socket.emit(rtcClientEvent.tips, {
                room : data.room,
                nickName : nickName,
                to : socket.id,
                msg : room + "是" + getRoomTypeZh(createdRoomType) + "类型的房间，请从对应功能入口进入",
                reload : true
            });
            return
        }

        //流媒体房间只允许两个人同时在线
        if((type === 'screen' || type === 'video') && numClients >= 2){
            socket.emit(rtcClientEvent.tips, {
                room : data.room,
                to : socket.id,
                msg : "当前房间已满，请开启其他房间号发起操作"
            });
            return
        }

        // 密码房间，检查密码
        if(type === 'password'){
            let roomPassword = io.sockets.adapter.rooms[room].password;
            if(roomPassword !== password){
                socket.emit(rtcClientEvent.tips, {
                    room : data.room,
                    nickName : nickName,
                    to : socket.id,
                    msg : "密码错误",
                    reload : true
                });
                return
            }
        }

        io.sockets.in(room).emit(rtcClientEvent.joined, {
            id: socket.id,
            room: room,
            nickName : nickName,
            type: type,
            recoderId : recoderId,
            langMode : langMode,
            ua : ua,
            network : network,
            joinTime : joinTime,
            ip : ip,
            owner : false,
            userAgent : userAgent
        });

        let peers = new Array();
        let otherSocketIds = Object.keys(clientsInRoom.sockets);
        for (let i = 0; i < otherSocketIds.length; i++) {
            let otherSocketId = otherSocketIds[i]
            let peerNickName = io.sockets.connected[otherSocketId].nickName
            let peerOwner = io.sockets.connected[otherSocketId].owner
            let peerLangMode = io.sockets.connected[otherSocketId].langMode
            let peerUa = io.sockets.connected[otherSocketId].ua
            let peerNetwork = io.sockets.connected[otherSocketId].network
            let peerJoinTime = io.sockets.connected[otherSocketId].joinTime
            let peerIp = io.sockets.connected[otherSocketId].ip
            let peerUserAgent = io.sockets.connected[otherSocketId].userAgent

            peers.push({
                id: otherSocketId,
                nickName: peerNickName,
                owner : peerOwner,
                langMode : peerLangMode,
                ua : peerUa,
                network : peerNetwork,
                joinTime : peerJoinTime,
                ip : peerIp,
                userAgent : peerUserAgent
            });
        }

        socket.join(room);

        socket.emit(rtcClientEvent.created, {
            id: socket.id,
            room: room,
            nickName : nickName,
            peers: peers,
            type: type,
            owner : false,
            recoderId : recoderId
        });
    }

    rtcCount.count(io, socket, tables, dbClient, data);

    io.sockets.adapter.rooms[room].createTime = utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")

    if(password && password.length > 0){
        bussinessNotify.sendCreateJoinPasswordRoomNotify({
            title: "用户创建/加入密码房间",
            password: password,
            socketId: socket.id,
            room: room,
            recoderId: recoderId,
            userAgent: userAgent,
            ip: ip,
        })
    }else{
        bussinessNotify.sendCreateJoinRoomNotify({
            title: "用户创建/加入房间",
            socketId: socket.id,
            room: room,
            recoderId: recoderId,
            userAgent: userAgent,
            ip: ip,
        })
    }
}

/**
 * 获取房间类型提示
 * @param {*} type 
 * @returns 
 */
function getRoomTypeZh(type){
    if(type === 'file'){
        return "文件"
    }else if(type === 'live'){
        return "直播"
    }else if(type === 'video'){
        return "音视频"
    }else if(type === 'screen'){
        return "屏幕共享"
    }else if(type === 'password'){
        return "密码"
    }else{
        return "未知类型"
    }
}

/**
 * 管理员创建或加入房间
 * @param {*} io 
 * @param {*} socket 
 * @param {*} tables 
 * @param {*} dbClient 
 * @param {*} data 
 * @returns 
 */
async function manageCreateAndJoin(io, socket, tables, dbClient, data){
    let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

    let {room, nickName} = data;

    if (room && room.length > 15) {
        room = room.toString().substr(0, 14);
    }

    if(nickName && nickName.length > 20){
        nickName = nickName.substr(0, 20);
    }
    //设置昵称
    io.sockets.connected[socket.id].nickName = nickName;
    
    let clientsInRoom = io.sockets.adapter.rooms[room];

    let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

    if(numClients > 0){
        socket.emit(rtcClientEvent.tips, {
            room : data.room,
            to : socket.id,
            msg : "管理员房间已被登录"
        });
        return
    }

    socket.join(room);

    socket.emit(rtcClientEvent.created, {
        id: socket.id,
        room: room,
        nickName : nickName,
        peers: [],
        recoderId : 0
    });
    io.sockets.adapter.rooms[room].createTime = utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")
    
    rtcCount.count(io, socket, tables, dbClient, data);

    // 下一步，让管理员输入密码
    data.socketId = socket.id;

    socket.emit(rtcClientEvent.manageCheck, data)

    bussinessNotify.sendCreateJoinRoomNotify({
        title: "管理员创建/加入后台管理房间",
        socketId: socket.id,
        room: room,
        recoderId: 0,
        userAgent: userAgent,
        ip: ip,
    })
}


/**
 * 创建或加入房间
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function createJoin(io, socket, tables, dbClient, data){
    try {
        let room = data.room;
        if (room && room.length > 15) {
            room = room.toString().substr(0, 14);
        }

        if (cfg.manage.room !== room) { 
            data.room = check.contentFilter(data.room);
            // 用户加入/创建房间
            userCreateAndJoin(io, socket, tables, dbClient, data)
        }else{ 
            //管理员是一个专属房间，不能创建记录
            manageCreateAndJoin(io, socket, tables, dbClient, data)
        }
    } catch (e) {
        utils.tlConsole(e)
        socket.emit(rtcClientEvent.tips, {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-createJoin",
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
    createJoin
}