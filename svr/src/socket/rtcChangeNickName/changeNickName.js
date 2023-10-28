const daoDog = require("./../../dao/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const utils = require("./../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const check = require("../../bussiness/check/content");
const daoRelation = require("../../dao/relation/relation");


/**
 * 房间内更新昵称
 * 指定了to : 就会发送给指定的用户
 * 没有指定to : 广播给除了自己外的房间内的所有用户
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function changeNickName(io, socket, tables, dbClient, data){
    try {
        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        let { nickName = '', preNickName = ''} = data;
        
        if(nickName && nickName.length > 10){
            nickName = nickName.toString().substr(0, 9);
        }

        data.nickName = check.contentFilter(nickName);

        let recoderId = await daoDog.addDogData({
            name: "修改个人昵称",
            roomId: data.room || "",
            socketId: "",
            device: userAgent,
            flag: 0,
            content: JSON.stringify(data),
            handshake: JSON.stringify(handshake),
            ip: ip
        }, tables, dbClient);

        //添加用户-操作关联记录
        if(socket.userId){
            daoRelation.addUserDogRelation({
                dogId : recoderId,
                userId : socket.userId,
            }, tables, dbClient);
        }

        bussinessNotify.sendChangeNickNameNotify({
            title: "修改个人昵称",
            room: data.room,
            nickName: data.nickName,
            preNickName: preNickName,
            userAgent: userAgent,
            ip: ip
        })

        //更新下服务端存下的昵称
        io.sockets.connected[socket.id].nickName = data.nickName;

        // 指定发送
        if(data.to && data.to !== ''){
            let toOtherSocket = io.sockets.connected[data.to];
            if(toOtherSocket){
                toOtherSocket.emit(rtcClientEvent.chatingRoom, data);
            }
            return
        }

        // 没指定，走广播（除了自己）
        let clientsInRoom = io.sockets.adapter.rooms[data.room];
        if (!clientsInRoom) {
            return
        }
        let otherSocketIds = Object.keys(clientsInRoom.sockets);
        for (let i = 0; i < otherSocketIds.length; i++) {
            if(data.from === otherSocketIds[i]){ //跳过自己
                continue;
            }
            let otherSocket = io.sockets.connected[otherSocketIds[i]];
            if(!otherSocket){
                continue;
            }
            otherSocket.emit(rtcClientEvent.changeNickName, data);
        }

    } catch (e) {
        utils.tlConsole(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-changeNickName",
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
    changeNickName
}