const conf = require("../../../conf/cfg.json");
const request = require('request');
const qiwei = conf.notify.qiwei;
const open = conf.notify.open;

// 统计企微机器人发送map
const qiweiMap = {}
for (let key in qiwei) {
     qiweiMap[qiwei[key]] = {
          time: new Date().valueOf(),
          count: 0
     };
}

/**
 * 企业微信通知
 * @param {*} msg 
 */
function requestMsg(msg) {
    if(!open){
         return
    }
    let finalKey = "";
    for (let key in qiweiMap) {
         // 单个还没达到20次，直接用
         if (qiweiMap[key].count < 20) {
              qiweiMap[key].count += 1;
              finalKey = key;
              break;
         } else {
              //达到20次，看看时间如果在1分钟内，说明达到限制，直接跳过
              if ((new Date().valueOf() / 1000) - (qiweiMap[key].time / 1000) <= 60) {
                   continue;
              } else {
                   //达到20次，但是时间超过1分钟，我们尝试清零
                   qiweiMap[key].count = 1;
                   qiweiMap[key].time = new Date().valueOf()
                   finalKey = key;
                   break;
              }
         }
    }

    if (finalKey === '' && qiwei.length > 0) {
         finalKey = qiwei[0];
    }

    msg = msg + `机器人KEY: ${finalKey}\n`;
    msg = msg + `机器人KEY列表: ${JSON.stringify(qiweiMap)}\n`;

    request({
         url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=" + finalKey,
         method: "POST",
         headers: {
              "content-type": "application/json",
         },
         body: JSON.stringify({
              msgtype: "markdown",
              markdown: {
                   content: msg,
              }
         })
    }, function (error, response, body) {
         console.log('提示成功！', qiweiMap);
    });
}

module.exports = {
    requestMsg
}