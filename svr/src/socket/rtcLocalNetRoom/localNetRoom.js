const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const bussinessNotify = require("../../bussiness/notify/notifyHandler")
const utils = require("../../../src/utils/utils");

/**
 * 局域网房间发现列表
 * 
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function localNetRoom(io, socket, tables, dbClient, data){
    try{
        const { toCurrentSocket = false, toAll = false } = data;
        
        let { ip, address } = utils.getSocketClientInfo(socket);

        let roomList = [];
        let rooms = io.sockets.adapter.rooms;

        for(let roomId in rooms){
            if(roomId.length > 15){
                continue;
            }

            //最多返回10个房间
            if(roomList.length > 10){
                break;
            }

            // 是否开启局域网房间
            const localNetRoom = rooms[roomId].localNetRoom || false;
            if(!localNetRoom){
                continue;
            }

            // 房间ip
            const roomIp = rooms[roomId].ip || "";
            // 房间address/ip
            const roomAddress = rooms[roomId].address || "";

            if(roomIp){ 
                // 本地请求
                if(
                    (roomIp.indexOf("127.0.0.1") > -1 && ip.indexOf("127.0.0.1") > -1)
                    ||
                    (roomIp.indexOf("localhost") > -1 && ip.indexOf("localhost") > -1)
                ){
                    roomList = addFilterRoomListData(roomList, {
                        room : roomId,
                        type : 'file',
                        ips : [roomIp],
                        count : rooms[roomId].length
                    })
                }else{
                    // 在同一个网段
                    if(utils.isSameSubnet(roomIp, ip, "255.255.255.255")){
                        roomList = addFilterRoomListData(roomList, {
                            room : roomId,
                            type : 'file',
                            ips : [roomIp],
                            count : rooms[roomId].length
                        })
                    }
                }
            }

            if(roomAddress){
                // 本地请求
                if(
                    (roomAddress.indexOf("127.0.0.1") > -1 && address.indexOf("127.0.0.1") > -1)
                    ||
                    (roomAddress.indexOf("localhost") > -1 && address.indexOf("localhost") > -1)
                ){
                    roomList = addFilterRoomListData(roomList, {
                        room : roomId,
                        type : 'file',
                        ips : [roomAddress],
                        count : rooms[roomId].length
                    })
                }else{
                    // 在同一个网段
                    if(utils.isSameSubnet(roomAddress, address, "255.255.255.255")){
                        roomList = addFilterRoomListData(roomList, {
                            room : roomId,
                            type : 'file',
                            ips : [roomAddress],
                            count : rooms[roomId].length
                        })
                    }
                }
            }
        }

        roomList.map(item=>{
            item.room = item.room.toString().substring(0,1) + "***";
        })

        // 通知当前用户
        if(toCurrentSocket){
            socket.emit(rtcClientEvent.localNetRoom, {
                list : roomList
            })
        }

        // 通知全部用户
        if(toAll){
            io.sockets.emit(rtcClientEvent.localNetRoom, {
                list : roomList
            });
        }

    }catch(e){
       utils.tlConsole(e)
       bussinessNotify.sendSystemErrorMsg({
        title: "socket-localNetRoom",
        data: JSON.stringify(data),
        room: "",
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


/**
 * 处理去重房间列表
 * @param {*} list 
 * @returns 
 */
function addFilterRoomListData(list, obj){
    let exist = list.filter(item => item.room === obj.room).length > 0;
    if(!exist){
        list.push(obj)
        return list
    }

    for(let i = 0; i < list.length; i++){
        if(list[i].room === obj.room){
            let oldIps = list[i].ips;
            oldIps.push(obj.ips[0])
            list[i].ips = oldIps;
        }
    }
    return list;
}


module.exports = {
    localNetRoom
}