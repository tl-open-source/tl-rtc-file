const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const bussinessNotify = require("../../bussiness/notify/notifyHandler")
const utils = require("../../../src/utils/utils");
const os = require('os');

/**
 * 服务器网络列表
 */
let serverNetworkList = null;
(() => {
    if (!serverNetworkList) {
        serverNetworkList = [];
        let ifaces = os.networkInterfaces();
        for (let iface in ifaces) {
            for (let i = 0, len = ifaces[iface].length; i < len; ++i) {
                const item = ifaces[iface][i];
                if (item.family === 'IPv4') {
                    serverNetworkList.push(ifaces[iface][i])
                }
            }
        }
    }
})()

console.log(serverNetworkList)


/**
 * 通过ip获取子网掩码
 * @param {*} ip 
 * @returns 
 */
function getNetMaskByIp(ip) {
    if (!serverNetworkList) {
        return "255.255.255.255";
    }
    const filterList = serverNetworkList.filter(item => {
        return item.address === ip;
    })
    if (!filterList || filterList.length === 0) {
        return "255.255.255.255";
    }
    return filterList[0].netmask;
}


/**
 * 处理去重房间列表
 * @param {*} list 
 * @returns 
 */
function addFilterRoomListData(list, obj) {
    let exist = list.filter(item => item.room === obj.room).length > 0;
    if (!exist) {
        list.push(obj)
        return list
    }

    for (let i = 0; i < list.length; i++) {
        if (list[i].room === obj.room) {
            let oldIps = list[i].ips;
            oldIps.push(obj.ips[0])
            list[i].ips = oldIps;
        }
    }
    return list;
}


/**
 * 局域网房间发现列表
 * 连接类型广播
 * 
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
function localNetRoom(io, socket, tables, dbClient, data) {
    const { ips : currentIps = [] } = data;
    
    let filterRoomList = [];

    //所有正常的房间列表ip统计
    let rooms = io.sockets.adapter.rooms;
    let roomIpsList = [];
    for (let roomId in rooms) {
        let roomIps = rooms[roomId].ips;
        if (
            roomId.length > 15 || // 非法房间号
            !rooms[roomId] || // 房间不存在
            !roomIps || // 房间没有上报ip
            roomIps.length === 0 || // 房间没有上报ip
            rooms[roomId].length === 0 || // 房间没有人
            !rooms[roomId].localNetRoom // 房间没有开启局域网
        ) {
            continue;
        }

        //最多处理返回10个局域网房间
        if (roomIpsList.length > 10) {
            break;
        }

        roomIpsList.push(...roomIps.map(item => {
            item.room = roomId;
            item.count = rooms[roomId] ? Object.keys(rooms[roomId].sockets).length : 0,
            item.owner = rooms[roomId].owner;
            item.roomType = rooms[roomId].type;
            return item;
        }))
    }

    //根据当前socket连接的ip信息，筛选出和ip在同一个局域网的房间列表
    currentIps.forEach(currentIpInfo => {
        const { ipType: currentIpType, address: currentAddress } = currentIpInfo;

        roomIpsList.forEach(otherIpInfo => {
            const { ipType: otherIpType, address: otherAddress, room, count, owner, roomType } = otherIpInfo;

            if (otherIpType === "srflx" && currentIpType === 'srflx') { //公网ip                    
                if (utils.isSameSubnet(currentAddress, otherAddress, getNetMaskByIp(currentAddress))) {
                    filterRoomList = addFilterRoomListData(filterRoomList, {
                        room, roomType, count, owner, ips: [otherAddress]
                    })
                }
            } else if (otherIpType === 'host' && currentIpType === 'host') { //内网ip
                if (utils.isSameSubnet(currentAddress, otherAddress, getNetMaskByIp(currentAddress))) {
                    filterRoomList = addFilterRoomListData(filterRoomList, {
                        room, roomType, count, owner, ips: [otherAddress]
                    })
                }
            }
        })
    });

    // filterRoomList.map(item => {
    //     item.room = item.room.toString().substring(0, 1) + "***";
    // })

    return filterRoomList;
}


/**
 * 局域网房间发现列表
 * socket用户连接之后广播
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
function localNetRoomForConnect(io, socket, tables, dbClient, data) {
    try {
        let filterRoomList = localNetRoom(io, socket, tables, dbClient, data);

        socket.emit(rtcClientEvent.localNetRoom, {
            list: filterRoomList,
            mode : 'connect'
        });

    } catch (e) {
        utils.tlConsole(e)
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-localNetRoomForConnect",
            data: JSON.stringify(data),
            room: "",
            from: socket.id,
            msg: JSON.stringify({
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
 * 局域网房间发现列表
 * socket用户加入房间之后广播
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
function localNetRoomForJoin(io, socket, tables, dbClient, data) {
    try {
        const { room } = data;
        const socketRoomInfo = io.sockets.adapter.rooms[room];
        const ips = socketRoomInfo ? socketRoomInfo.ips : [];
        const owner = socketRoomInfo ? socketRoomInfo.owner : socket.id;
        const count = socketRoomInfo ? Object.keys(socketRoomInfo.sockets).length : 0;
        const roomType = socketRoomInfo ? socketRoomInfo.type : "file";

        io.sockets.emit(rtcClientEvent.localNetRoom, {
            list : [{ room, roomType, count, owner, ips : ips.map(item => item.address) }],
            mode : 'join'
        });

    } catch (e) {
        utils.tlConsole(e)
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-localNetRoomForJoin",
            data: JSON.stringify(data),
            room: "",
            from: socket.id,
            msg: JSON.stringify({
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
 * 局域网房间发现列表
 * socket用户退出房间之后广播
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
function localNetRoomForExit(io, socket, tables, dbClient, data) {
    try {
        const { room } = data;
        const socketRoomInfo = io.sockets.adapter.rooms[room];
        const ips = socketRoomInfo ? socketRoomInfo.ips : [];
        const owner = socketRoomInfo ? socketRoomInfo.owner : socket.id;
        const count = socketRoomInfo ? Object.keys(socketRoomInfo.sockets).length : 0;
        const roomType = socketRoomInfo ? socketRoomInfo.type : "file";

        io.sockets.emit(rtcClientEvent.localNetRoom, {
            list : [{ room, roomType, count, owner, ips: ips.map(item => item.address) }],
            mode : 'exit'
        });

    } catch (e) {
        utils.tlConsole(e)
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-localNetRoomForExit",
            data: JSON.stringify(data),
            room: "",
            from: socket.id,
            msg: JSON.stringify({
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
 * 局域网房间发现列表
 * socket用户断开连接之后广播
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
function localNetRoomForDisconnect(io, socket, tables, dbClient, data) {
    try {
        io.sockets.emit(rtcClientEvent.localNetRoom, {
            list : [{ socketId : socket.id }],
            mode : 'disconnect'
        });
    } catch (e) {
        utils.tlConsole(e)
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-localNetRoomForDisconnect",
            data: JSON.stringify(data),
            room: "",
            from: socket.id,
            msg: JSON.stringify({
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
    localNetRoomForConnect, localNetRoomForJoin, 
    localNetRoomForExit, localNetRoomForDisconnect
}