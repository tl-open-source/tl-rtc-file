
const utils = require("../../utils/utils");
const cfg = require("../../../conf/cfg.json")
const manageConfig = cfg.manage;
const dbOpen = cfg.db.open;

// 默认开关数据
const defaultSwitchData = {
	openSendBug: true,
	openScreen: true,
	openOnlineUser: true,
	openShareRoom: true,
	openAiChat: true,
	openGetCodeFile: true,
	openVideoShare: true,
	openLiveShare: true,
	openRemoteDraw: true,
	openPasswordRoom: true,
	openScreenShare: true,
	openFileTransfer: true,
	openTxtTransfer: true,
	openTurnServer: true,
	openNetworkIcon: true,
	openUseTurnIcon: true,
	openCommRoom: true,
	openRefleshRoom: true,
	openNotice: true,
	allowNumber: true,
	allowChinese: true,
	allowSymbol: true,
	noticeMsgList: [],
	chatingCommCount : 10,
}


/**
 * 管理后台特殊房间入口、配置信息
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function getOrCreateManageRoom(params, tables, dbClient) {
	try{
        if(!tables || !dbClient){
            return {};
        }
        if(!params){
            params = {};
        }

		let manageRoomList = await tables.Room.findAll({
			where: {
				rname: manageConfig.room,
				flag: 1
			}
		});
	
		if (manageRoomList.length === 0) {
			let res = await tables.Room.create({
				rcode: utils.genRoom(),
				rname: manageConfig.room,
				flag: 1,
				sid: params.sid,
				ip: params.ip,
				device: params.device,
				content: JSON.stringify(defaultSwitchData)
			});

			utils.tlConsole("创建管理房间配置成功")

			manageRoomList = await tables.Room.findAll({
				where: {
					rname: manageConfig.room,
					flag: 1
				}
			});
		}
		
        return manageRoomList.length >= 1 ? manageRoomList[0].dataValues : {};

    }catch(e){
        console.error(e);
        return {};
    }
}


/**
 * 获取房间统计信息
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @param {*} sockets 
 * @returns 
 */
async function getRoomHistoryInfo(params, tables, dbClient, sockets) {
	try{
        if(!tables || !dbClient || !sockets){
            return {};
        }
        if(!params){
            params = {};
        }

		let data = {
			createRoomToday: 0,
			createRoomAll: 0,
			joinRoomTodady: 0,
			joinRoomAll: 0,
			onlineRoomList: [],
			todayRoomList: [],
			userAgentIpList: []
		};
	
		//当前在线房间列表
		for (let room in sockets.adapter.rooms) {
			if (room.length > 15) {
				continue
			}
			data.onlineRoomList.push({
				status: "在线",
				room: room,
				userNumber: sockets.adapter.rooms[room] ? Object.keys(sockets.adapter.rooms[room].sockets).length : 0,
				createTime: sockets.adapter.rooms[room].createTime
			})
		}
	
		let day;
		try {
			day = new Date(params.day)
		} catch (e) {
			day = new Date()
		}
		let chooseDay = utils.formateDateTime(day, "yyyy-MM-dd");
		let nextDay = utils.getNextDay(chooseDay);
	
		// 某日房间聚合列表，数量统计
		const [roomCoutingListToday, metadata] = await dbClient.query(
			`select rname, any_value(created_at) as created_at, count(*) as user from room where created_at >= "${chooseDay}" and created_at <= "${nextDay}" group by rname order by created_at desc`);
	
		data.createRoomToday += roomCoutingListToday.length;
		roomCoutingListToday.forEach(element => {
			data.joinRoomTodady += element.user;
			data.todayRoomList.push({
				room: element.rname,
				count: element.user,
				createTime: utils.formateDateTime(new Date(element.created_at), "yyyy-MM-dd hh:mm:ss"),
			})
		});
	
		// 全部数量统计
		const [roomCoutingListAll, metadata1] = await dbClient.query(`select count(*) as user from room group by rname`);
		data.createRoomAll += roomCoutingListAll.length;
		roomCoutingListAll.forEach(element => {
			data.joinRoomAll += element.user
		});
	
		// 某日房间设备统计列表
		const [roomListAgent, metadata2] = await dbClient.query(`select rname, content, created_at from room where created_at >= "${utils.formateDateTime(new Date(), "yyyy-MM-dd")}" order by created_at desc`);
		roomListAgent.forEach(element => {
			let content = JSON.parse(element.content);
			if (content && content.handshake) {
				data.userAgentIpList.push({
					room: element.rname,
					userAgent: content.handshake.headers['user-agent'],
					Ip: content.handshake.headers['x-real-ip'] || content.handshake.headers['x-forwarded-for'] || content.handshake.headers['host'],
					createTime: utils.formateDateTime(new Date(element.created_at), "yyyy-MM-dd hh:mm:ss"),
				})
			}
		});
	
		data.chooseDay = chooseDay;

		return data;
	}catch(e){
        console.error(e);
        return {};
    }
}


/**
 * 加入房间
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function createJoinRoom(params, tables, dbClient) {
	try{
        if(!tables || !dbClient){
            return {};
        }
        if(!params){
            params = {};
        }

		let data = await tables.Room.create({
			uid: params.uid,
			uname: params.uname,
			rcode: utils.genRoom(),
			rname: params.rname,
			sid: params.sid,
			ip: params.ip,
			device: params.device,
			url: params.url,
			content: params.content
		});
		
		utils.tlConsole("加入房间 : ", params.uname, params.sid, params.rname)

        return data && data.dataValues ? data.dataValues.id : 0;
    }catch(e){
        console.error(e);
        return {};
    }
}


/**
 * 更新房间
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function updateRoomContent(params, tables, dbClient) {
	try{
        if(!tables || !dbClient){
            return {};
        }
        if(!params){
            params = {};
        }

		let data = await tables.Room.update({
			content: params.content,
		}, {
			where: {
				id: params.id,
				flag: 1
			}
		});

		utils.tlConsole("更新房间 : ", params, data)

        return data;

    }catch(e){
        console.error(e);
        return {};
    }
}


/**
 * 退出房间
 * @param {*} params 
 * @param {*} tables 
 * @param {*} dbClient 
 * @returns 
 */
async function exitRoomBySid(params, tables, dbClient) {
	try{
        if(!tables || !dbClient){
            return {};
        }
        if(!params){
            params = {};
        }

		let data = await tables.Room.update({
			status: 1
		}, {
			where: {
				sid: params.sid
			}
		});

		utils.tlConsole("退出房间 : ", params, data)
		
        return 0;
    }catch(e){
        console.error(e);
        return {};
    }
}


module.exports = dbOpen ? {
	getRoomHistoryInfo,
	createJoinRoom,
	updateRoomContent,
	exitRoomBySid,
	getOrCreateManageRoom
} : {
	getRoomHistoryInfo: () => {
		return {}
	},
	createJoinRoom: () => {
		return {}
	},
	updateRoomContent: () => {
		return {}
	},
	exitRoomBySid: () => {
		return {}
	},
	getOrCreateManageRoom: () => {
		return {
			content: JSON.stringify(defaultSwitchData)
		}
	},
}