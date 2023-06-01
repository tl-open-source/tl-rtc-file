const utils = require("../../utils/utils");
const conf = require("../../../conf/cfg.json");
const webrtcConf = conf.webrtc;

/**
 * 获取ip地址,初始化等相关配置
 * @param {*} req 
 * @param {*} res 
 */
function initData(req, res) {

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
			wsHost: conf.ws.host || ip,
			rtcConfig: { iceServers: webrtcConf.iceServers },
			options: webrtcConf.options
		};
	
		res.json(data)
	}else if(process.env.ENV_MODE === 'server'){

		let data = {
			wsHost: conf.wss.host,
			rtcConfig: { iceServers: webrtcConf.iceServers },
			options: webrtcConf.options
		};
	
		res.json(data)
	}	
}

module.exports = {
	initData,
}