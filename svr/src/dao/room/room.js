
const utils = require("../../utils/utils");
const cfg = require("../../../conf/cfg.json")
const manageConfig = cfg.router.manage;
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
}

/**
 * 管理后台特殊房间入口、配置信息
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getOrCreateManageRoom(req, res, next) {
	let ctx = req.ctx || {};
	let params = req.params || {};
	let data = {};

	let manageRoomList = await ctx.tables.Room.findAll({
		where: {
			rname: manageConfig.room,
			flag: 1
		}
	});

	if (manageRoomList.length === 0) {
		data = await ctx.tables.Room.create({
			rcode: utils.genRoom(),
			rname: manageConfig.room,
			flag: 1,
			sid: params.sid,
			ip: params.ip,
			device: params.device,
			content: JSON.stringify(defaultSwitchData)
		});

		console.log("创建管理房间配置成功")

		manageRoomList = await ctx.tables.Room.findAll({
			where: {
				rname: manageConfig.room,
				flag: 1
			}
		});
	}

	manageRoomList = manageRoomList.length >= 1 ? manageRoomList[0] : manageRoomList

	if (res) {
		res.json(manageRoomList)
	} else {
		return manageRoomList;
	}
}


/**
 * 获取房间统计信息
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getRoomHistoryInfo(req, res, next) {
	let ctx = req.ctx || {};
	let params = req.params || {};
	let sockets = ctx.sockets || {};
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
	const [roomCoutingListToday, metadata] = await ctx.dbClient.query(
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
	const [roomCoutingListAll, metadata1] = await ctx.dbClient.query(`select count(*) as user from room group by rname`);
	data.createRoomAll += roomCoutingListAll.length;
	roomCoutingListAll.forEach(element => {
		data.joinRoomAll += element.user
	});

	// 某日房间设备统计列表
	const [roomListAgent, metadata2] = await ctx.dbClient.query(`select rname, content, created_at from room where created_at >= "${utils.formateDateTime(new Date(), "yyyy-MM-dd")}" order by created_at desc`);
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

	if (res) {
		res.json(data)
	} else {
		return data;
	}
}

/**
 * 创建/加入房间
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function createJoinRoom(req, res, next) {
	let ctx = req.ctx || {};
	let params = req.params || {};
	let data = {};

	data = await ctx.tables.Room.create({
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

	if (res) {
		res.json(data)
	} else {
		return data;
	}
}


/**
 * 更新房间
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function updateRoomContent(req, res, next) {
	let ctx = req.ctx || {};
	let params = req.params || {};

	let data = await ctx.tables.Room.update({
		content: params.content,
	}, {
		where: {
			id: params.id,
			flag: 1
		}
	});

	if (res) {
		res.json(data)
	} else {
		return data;
	}
}


/**
 * 退出房间
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function exitRoomBySid(req, res, next) {
	let ctx = req.ctx || {};
	let params = req.params || {};

	console.log(ctx.tables)

	let data = await ctx.tables.Room.update({
		status: 1
	}, {
		where: {
			sid: params.sid
		}
	});

	if (res) {
		res.json(data)
	} else {
		return data;
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