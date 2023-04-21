const bussinessRoom = require("./../../bussiness/room/room")
const bussinessNotify = require("./../../bussiness/notify/notifySocketEvent")
const rtcCount = require("./../rtcCount/count");
const rtcMessage = require("./../rtcMessage/message");
const utils = require("./../../utils/utils");
const cfg = require("./../../../conf/cfg.json")


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

    let {room, type, nickName, password = ''} = data;

    if (room && room.length > 15) {
        room = room.toString().substr(0, 14);
    }

    if(nickName && nickName.length > 20){
        nickName = nickName.substr(0, 20);
    }
    //设置昵称
    io.sockets.connected[socket.id].nickName = nickName;

    if(password && password.length > 6){
        password = password.toString().substr(0,6);
    }

    let recoderId = await bussinessRoom.createJoinRoom({
        socketId: socket.id,
        roomName: room,
        ip: ip,
        device: userAgent,
        content: { handshake: handshake },
        password: password,
        tables: tables
    });
    
    let clientsInRoom = io.sockets.adapter.rooms[room];
    let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

    if (numClients === 0) {
        socket.join(room);

        socket.emit('created', {
            id: socket.id,
            room: room,
            nickName : nickName,
            peers: [],
            type: type,
            recoderId : recoderId
        });

        //密码房间 首次创建设置密码
        if(type === 'password'){
            io.sockets.adapter.rooms[room].password = password
        }
    }else {
        //流媒体房间只允许两个人同时在线
        if((type === 'screen' || type === 'video') && numClients >= 2){
            socket.emit("tips", {
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
                socket.emit("tips", {
                    room : data.room,
                    nickName : nickName,
                    to : socket.id,
                    msg : "密码错误",
                    reload : true
                });
                return
            }
        }

        io.sockets.in(room).emit('joined',{
            id: socket.id,
            room: room,
            nickName : nickName,
            type: type,
            recoderId : recoderId
        });

        let peers = new Array();
        let otherSocketIds = Object.keys(clientsInRoom.sockets);
        for (let i = 0; i < otherSocketIds.length; i++) {
            let otherSocketId = otherSocketIds[i]
            let peerNickName = io.sockets.connected[otherSocketId].nickName
            peers.push({
                id: otherSocketId,
                nickName: peerNickName
            });
        }

        socket.join(room);

        socket.emit('created', {
            id: socket.id,
            room: room,
            nickName : nickName,
            peers: peers,
            type: type,
            recoderId : recoderId
        });
    }

    rtcCount.count(io, socket, tables, dbClient, data);

    io.sockets.adapter.rooms[room].createTime = utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")

    bussinessNotify.sendCreateJoinRoomNotify({
        title: "用户创建/加入房间",
        password: password,
        socketId: socket.id,
        room: room,
        recoderId: recoderId,
        userAgent: userAgent,
        ip: ip,
    })
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
        socket.emit("tips", {
            room : data.room,
            to : socket.id,
            msg : "管理员房间已被登录"
        });
        return
    }

    socket.join(room);

    socket.emit('created', {
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

    socket.emit("manageCheck", data)

    bussinessNotify.sendCreateJoinRoomNotify({
        title: "管理员创建/加入后台管理房间",
        password: "",
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

        if (cfg.router.manage.room !== room) { 
            // 用户加入/创建房间
            userCreateAndJoin(io, socket, tables, dbClient, data)
        }else{ 
            //管理员是一个专属房间，不能创建记录
            manageCreateAndJoin(io, socket, tables, dbClient, data)
        }
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
    createJoin
}