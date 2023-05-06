/**
 * openapi api
 * @author iamtsm
 */

const request = require('request')
const openai = require('../../../conf/cfg.json').openai
let keysMap = {}

/**
 * openai聊天接口
 * @param {*} apiKey 
 * @param {*} prompt 
 * @param {*} model 
 * @param {*} maxTokens 
 * @param {*} temperature 
 * @param {*} n 
 * @returns 
 */
function openaiChatApi(
    apiKey,
    prompt,
    model = 'text-davinci-003',
    maxTokens = 256,
    temperature = 0.7,
    n = 1
) {
    return new Promise((resolve, reject) => {
        const options = {
            url: 'https://api.openai.com/v1/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            json: {
                prompt: prompt,
                model: model,
                max_tokens: maxTokens,
                temperature: temperature,
                n : n,
            }
        }

        request.post(options, (error, response, body) => {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
}


/**
 * 获取所有AI key使用状态
 * @returns 
 */
function apiKeysStatus(){
    return keysMap
}

/**
 * 设置AI key使用状态
 * @param {*} key 
 */
function setApiKeyStatus( key ){
    if(Object.keys(keysMap).length > 0){
        keysMap[key].used = 0
    }
}

/**
 * 获取一个可用的apiKey
 * @param {*} roomId 
 * @returns 
 */
function getApiKey( roomId ){
    // init
    if(Object.keys(keysMap).length === 0){
        let apiKeys = openai.apiKeys;
        apiKeys.forEach((key)=>{
            keysMap[key] = {
                used : 0
            }
        })
    }
    // get
    for(let key in keysMap){
        if(keysMap[key].used === 0){
            keysMap[key].used = roomId
            return key;
        }
    }
    return undefined
}


/**
 * AI聊天
 * @param {*} msg 
 * @param {*} roomId 
 * @returns 
 */
async function openaiChat(msg, roomId){
    let apiKey = getApiKey(roomId)
    if(!apiKey){
        return "AI忙不过来啦，稍等重试一下"
    }

    let result = "";
    let maxCount = 0;
    while (maxCount++ < 100000) {
        const res = await openaiChatApi( apiKey, msg )
        console.log("res : ",res)
        result += res.choices[0].text.substring(res.choices[0].text.indexOf("\n")+1);
        if(result.startsWith("\n")){
            result = result.substring(1);
        }
        if (res.choices[0].finish_reason === "stop") {
            break;
        }
        msg = res.choices[0].text;
    }

    //回答完，清空下key的占用
    setApiKeyStatus(apiKey)

    return result;
}


// (async()=>{console.log(await openaiChat("1加1等于几"))})()

module.exports = {
    openaiChat, apiKeysStatus
}