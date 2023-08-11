const {inject_env_config} = require("../../../conf/env_config");
const conf = inject_env_config(require("../../../conf/cfg.json"));
const request = require('request');
const qiweiNormal = conf.notify.qiwei.normal;
const qiweiError = conf.notify.qiwei.error;
const open = conf.notify.open;
const utils = require("../../../src/utils/utils");


// 统计企微机器人发送normal map
const qiweiNormalMap = {}
for (let key in qiweiNormal) {
     qiweiNormalMap[qiweiNormal[key]] = {
          time: new Date().valueOf(),
          count: 0
     };
}

/**
 * 企业微信通知
 * 正常通知
 * @param {*} msg 
 */
function requestMsg(msg) {
    if(!open){
         return
    }
    let finalKey = "";
    for (let key in qiweiNormalMap) {
         // 单个还没达到20次，直接用
         if (qiweiNormalMap[key].count < 20) {
              qiweiNormalMap[key].count += 1;
              finalKey = key;
              break;
         } else {
              //达到20次，看看时间如果在1分钟内，说明达到限制，直接跳过
              if ((new Date().valueOf() / 1000) - (qiweiNormalMap[key].time / 1000) <= 60) {
                   continue;
              } else {
                   //达到20次，但是时间超过1分钟，我们尝试清零
                   qiweiNormalMap[key].count = 1;
                   qiweiNormalMap[key].time = new Date().valueOf()
                   finalKey = key;
                   break;
              }
         }
    }

    if (finalKey === '' && qiweiNormal.length > 0) {
         finalKey = qiweiNormal[0];
    }

    msg = msg + `机器人KEY: ${finalKey}\n`;
    msg = msg + `机器人KEY列表: ${JSON.stringify(qiweiNormalMap)}\n`;

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
         utils.tlConsole('提示成功！', qiweiNormalMap);
    });
}


// 统计企微机器人发送error map
const qiweiErrorMap = {}
for (let key in qiweiError) {
     qiweiErrorMap[qiweiError[key]] = {
          time: new Date().valueOf(),
          count: 0
     };
}

/**
 * 企业微信通知
 * 错误通知
 * @param {*} msg 
 */
function requestErrorMsg(msg) {
     if(!open){
          return
     }
     let finalKey = "";
     for (let key in qiweiErrorMap) {
          // 单个还没达到20次，直接用
          if (qiweiErrorMap[key].count < 20) {
               qiweiErrorMap[key].count += 1;
               finalKey = key;
               break;
          } else {
               //达到20次，看看时间如果在1分钟内，说明达到限制，直接跳过
               if ((new Date().valueOf() / 1000) - (qiweiErrorMap[key].time / 1000) <= 60) {
                    continue;
               } else {
                    //达到20次，但是时间超过1分钟，我们尝试清零
                    qiweiErrorMap[key].count = 1;
                    qiweiErrorMap[key].time = new Date().valueOf()
                    finalKey = key;
                    break;
               }
          }
     }
 
     if (finalKey === '' && qiweiNormal.length > 0) {
          finalKey = qiweiNormal[0];
     }
 
     msg = msg + `机器人KEY: ${finalKey}\n`;
     msg = msg + `机器人KEY列表: ${JSON.stringify(qiweiErrorMap)}\n`;
 
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
          utils.tlConsole('提示成功！', qiweiErrorMap);
     });
 }

module.exports = {
    requestMsg, requestErrorMsg
}