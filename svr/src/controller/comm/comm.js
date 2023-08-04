const utils = require("../../utils/utils");
const conf = require("../../../conf/cfg.json");
const webrtcConf = conf.webrtc;

/**
 * 获取ip地址,初始化等相关配置
 * @param {*} req 
 * @param {*} res 
 */
function initData(req, res) {
	//是否开启turn
	const openTurn = (req.query.turn || "") === 'true';
	//使用的账号模式, true : 有效账号模式, false : 固定账号
	const useSecret = (req.query.secret || "") === 'true' || true;

	//ice服务器配置
	const iceServers = utils.genTurnServerIceServersConfig(openTurn, useSecret, "tlrtcfile");

	if(process.env.ENV_MODE === 'local'){

		let regexIP = /^((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))$/;
		let ip = utils.getLocalIP();
		if (!regexIP.test(ip)) {
			ip = utils.getClientIP(req)
		}
		if (!regexIP.test(ip)) {
			ip = "127.0.0.1"
		}

		let data = {
			version : conf.version,
			wsHost: conf.ws.host || ip,
			rtcConfig: { iceServers },
			options: webrtcConf.options,
			logo : utils.genClientLogo(),
		};
	
		res.json(data)
	}else if(process.env.ENV_MODE === 'server'){

		let data = {
			version : conf.version,
			wsHost: conf.wss.host,
			rtcConfig: { iceServers },
			options: webrtcConf.options,
			logo : utils.genClientLogo(),
		};
	
		res.json(data)
	}	
}

module.exports = {
	initData,
}