const utils = require("../../utils/request");
const conf = require("../../conf/cfg");
const wsConf = conf.ws;
const webrtcConf = conf.webrtc;

//获取ip地址,初始化等相关配置
function initData(req,res) {
     let localIp = utils.getLocalIP();
     let clientIp = utils.getClientIP(req);
     let isLocal = clientIp === '1';

     let data = {
          wsHost : isLocal ? "ws://"+localIp+":"+wsConf.port  : wsConf.ws_online,
          rtcConfig : {iceServers : webrtcConf.iceServers} ,
          options : webrtcConf.options
     };

     res.json(data)
}

module.exports = {
     initData
}