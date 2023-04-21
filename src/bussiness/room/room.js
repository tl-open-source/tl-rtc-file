const room = require("./../../dao/room/room");

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
            pwd: data.password,
            ip: data.ip,
            device: data.device,
            url: data.url || "",
            content: JSON.stringify(data.content)
        }
    };

    let res = await room.createJoinRoom(req, null);

    return res && res.dataValues ? res.dataValues.id : 0
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

    return await room.updateRoomContent(req, null);
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

    return await room.getOrCreateManageRoom(req, null);
}

/**
 * 获取加入/创建房间统计信息
 * @param {*} data 
 * @returns 
 */
async function getRoomHistoryInfo(data){
    let req = {
        ctx: {
            tables: data.tables,
            sockets : data.sockets,
            dbClient : data.dbClient
        },
        params: {
            limit : 10, 
            day : data.day
        }
    };

    return await room.getRoomHistoryInfo(req, null);
}

module.exports = {
    getOrCreateManageRoom,
    updateManageRoom,
    exitRoom,
    createJoinRoom,
    getRoomHistoryInfo
}