const bussinessDog = require("./../../bussiness/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifySocketEvent")
const rtcCommData = require("./../rtcCommData/commData");
const utils = require("./../../utils/utils");
const bussinessOpenai = require("./../../bussiness/openai/openai")
const rtcConstant = require("../rtcConstant");
const rtcServerMessageEventOpName = rtcConstant.rtcServerMessageEventOpName
const rtcClientEvent = rtcConstant.rtcClientEvent

/**
 * 公共聊天频道
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function openai(io, socket, tables, dbClient, data){
    let cacheSwitchData = rtcCommData.getCacheSwitchData()

    if(!cacheSwitchData.openAiChat){
        socket.emit(rtcClientEvent.tips, {
            room: data.room,
            to: socket.id,
            msg: "当前功能已暂时关闭，有问题可以加群交流"
        });
        return
    }

    let {roomId = "10086", content, value} = data;
    if(value){
        value = value.substr(0, 1000)
    }

    // 有上下文，结合上下文
    if(content){
        content = content.substr(0, 5000);
        content += "。\n，假定以上的内容是提问者和你的对话，结合上面的语境回答下面的问题，并且注意如果提问内容或者你的回答内容涉及政治，请回复 “我已经被设置关闭涉政问答功能”。提问内容为 : "+value;
    }else{
        // 没有就默认
        content = value;
    }

    let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);
    
    data.time = new Date().toLocaleString()
    data.type = "openai";
    data.content = await bussinessOpenai.openaiChat(content, roomId);
    data.value = "";

    let to = socket.id;
    let otherSocket = io.sockets.connected[to];
    if(otherSocket){
        otherSocket.emit(rtcClientEvent.openaiAnswer, data);
    }

    await bussinessDog.dogData({
        name: rtcServerMessageEventOpName.openaiChat,
        tables: tables,
        roomId: roomId,
        socketId: data.socketId,
        device: userAgent,
        flag: 0,
        content: decodeURIComponent(data.content),
        handshake: JSON.stringify(handshake),
        ip: ip
    });

    bussinessNotify.sendOpenaiChatNotify({
        title: rtcServerMessageEventOpName.openaiChat,
        room: roomId,
        keys : JSON.stringify(bussinessOpenai.apiKeysStatus()),
        content: content,
        answer : data.content,
        userAgent: userAgent,
        ip: ip
    })
}

module.exports = {
    openai
}