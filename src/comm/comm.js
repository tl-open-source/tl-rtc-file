const utils = require("../../utils/request");
const conf = require("../../conf/cfg");
const wsConf = conf.ws;
const webrtcConf = conf.webrtc;

//获取ip地址,初始化等相关配置
function initData(req,res) {
     let localIp = utils.getClientIP(req);

     let data = {
          wsHost : wsConf.ws_online ? wsConf.ws_online : "ws://"+localIp+":"+wsConf.port,
          rtcConfig : {iceServers : webrtcConf.iceServers} ,
          options : webrtcConf.options
     };

     res.json(data)
}

module.exports = {
     initData
}