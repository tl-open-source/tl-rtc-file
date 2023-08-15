const utils = require("../../utils/utils");
const {inject_env_config} = require("../../../conf/env_config")
const conf = inject_env_config(require("../../../conf/cfg.json"));
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

	if(process.env.tl_rtc_file_env_mode === 'http'){

		let regexIP = /^((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))$/;
		let ip = utils.getLocalIP();
		if (!regexIP.test(ip)) {
			ip = utils.getClientIP(req)
		}
		if (!regexIP.test(ip)) {
			ip = "127.0.0.1"
		}

		let wsHost = conf.socket.host || ip + ":" + conf.socket.port;

		let data = {
			version : conf.version,
			wsHost: "ws://" + wsHost,
			rtcConfig: { iceServers },
			options: webrtcConf.options,
			logo : utils.genClientLogo(),
		};
	
		res.json(data)
	}else{

		let wsHost = conf.socket.host || ip;

		let data = {
			version : conf.version,
			wsHost: "wss://" + wsHost,
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